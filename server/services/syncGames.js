/**
 * syncGames.js — Fetches trending games from IGDB + Twitch viewer counts
 * Runs on startup and every hour.
 */

const fetch = require('node-fetch');
const NodeCache = require('node-cache');
const db = require('../db');

require('dotenv').config({ path: require('path').join(__dirname, '../../.env') });

const CLIENT_ID     = process.env.TWITCH_CLIENT_ID;
const CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET;
const IGDB_BASE     = process.env.IGDB_BASE_URL || 'https://api.igdb.com/v4';

// Cache Twitch token for up to 55 days (tokens last 60)
const tokenCache = new NodeCache({ stdTTL: 55 * 24 * 60 * 60 });
// Cache full sync result for 1 hour
const gamesCache = new NodeCache({ stdTTL: 60 * 60 });

// ----------------------------------------------------------------
// Twitch OAuth — client_credentials
// ----------------------------------------------------------------
async function getTwitchToken() {
  const cached = tokenCache.get('token');
  if (cached) return cached;

  const res = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&grant_type=client_credentials`,
    { method: 'POST' }
  );
  if (!res.ok) throw new Error(`Twitch token error: ${res.status}`);
  const data = await res.json();
  tokenCache.set('token', data.access_token, data.expires_in - 300);
  return data.access_token;
}

// ----------------------------------------------------------------
// IGDB query helper
// ----------------------------------------------------------------
async function igdb(endpoint, body) {
  const token = await getTwitchToken();
  const res = await fetch(`${IGDB_BASE}/${endpoint}`, {
    method: 'POST',
    headers: {
      'Client-ID': CLIENT_ID,
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'text/plain',
    },
    body,
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`IGDB ${endpoint} error ${res.status}: ${txt}`);
  }
  return res.json();
}

// ----------------------------------------------------------------
// Twitch Helix — live viewer count, batched 100 names at a time
// ----------------------------------------------------------------
async function _twitchViewerBatch(names, token) {
  if (!names.length) return {};
  // Lookup Twitch game IDs by name
  const params = names.map(n => `name=${encodeURIComponent(n)}`).join('&');
  const gRes = await fetch(`https://api.twitch.tv/helix/games?${params}`, {
    headers: { 'Client-ID': CLIENT_ID, 'Authorization': `Bearer ${token}` },
  });
  if (!gRes.ok) return {};
  const twitchGames = (await gRes.json()).data || [];
  if (!twitchGames.length) return {};

  // Sum live viewers across top 100 streams per batch
  const streamParams = twitchGames.map(g => `game_id=${g.id}`).join('&');
  const sRes = await fetch(`https://api.twitch.tv/helix/streams?${streamParams}&first=100`, {
    headers: { 'Client-ID': CLIENT_ID, 'Authorization': `Bearer ${token}` },
  });
  if (!sRes.ok) return {};
  const viewsByTwitchId = {};
  for (const s of (await sRes.json()).data || []) {
    viewsByTwitchId[s.game_id] = (viewsByTwitchId[s.game_id] || 0) + s.viewer_count;
  }
  const result = {};
  for (const tg of twitchGames) {
    result[tg.name.toLowerCase()] = viewsByTwitchId[tg.id] || 0;
  }
  return result;
}

async function getTwitchViewers(gameNames) {
  if (!gameNames.length) return {};
  const token = await getTwitchToken();
  const BATCH = 100;
  const allViewers = {};
  for (let i = 0; i < gameNames.length; i += BATCH) {
    const batch = gameNames.slice(i, i + BATCH);
    const batchResult = await _twitchViewerBatch(batch, token).catch(() => ({}));
    Object.assign(allViewers, batchResult);
  }
  return allViewers;
}

// ----------------------------------------------------------------
// Trending score formula with recency decay
// ----------------------------------------------------------------
function trendingScore({ twitch_viewers = 0, igdb_rating = 0, igdb_rating_count = 0, hype = 0, release_date = null }) {
  const base = twitch_viewers * 1.0 + hype * 500 + igdb_rating_count * 2 + igdb_rating * 10;

  // Recency boost: new games get a boost that decays over ~90 days
  // If the game is doing well (high viewers), it stays near top longer (up to ~180 days)
  let recencyBoost = 0;
  if (release_date) {
    const daysSince = Math.max(0, (Date.now() - new Date(release_date)) / 86400000);
    const halfLife = twitch_viewers > 5000 ? 180 : 90; // popular new games stay longer
    if (daysSince < halfLife) {
      const decay = (halfLife - daysSince) / halfLife; // 1.0 → 0.0
      recencyBoost = Math.round(decay * Math.max(base * 2, 50000));
    }
  }

  return Math.round(base + recencyBoost);
}

// ----------------------------------------------------------------
// Main sync function
// ----------------------------------------------------------------
async function syncGames() {
  if (!CLIENT_ID || !CLIENT_SECRET) {
    console.warn('[syncGames] Missing Twitch credentials — skipping sync');
    return;
  }

  const cacheHit = gamesCache.get('synced');
  if (cacheHit) {
    console.log('[syncGames] Cache hit — skipping IGDB fetch');
    return;
  }

  console.log('[syncGames] Fetching trending games from IGDB...');

  try {
    // Three separate queries to get broad variety — IGDB max 500 per request
    const [byHype, byPopularity, byRating] = await Promise.all([
      // Most hyped / upcoming
      igdb('games', `
        fields id, name, cover.url, genres.name, summary, rating, rating_count, hypes, first_release_date, websites.url, websites.category;
        where cover != null & hypes > 0;
        sort hypes desc;
        limit 200;
      `),
      // Most played all-time
      igdb('games', `
        fields id, name, cover.url, genres.name, summary, rating, rating_count, hypes, first_release_date, websites.url, websites.category;
        where rating_count > 200 & cover != null;
        sort rating_count desc;
        limit 200;
      `),
      // Highest rated
      igdb('games', `
        fields id, name, cover.url, genres.name, summary, rating, rating_count, hypes, first_release_date, websites.url, websites.category;
        where rating > 80 & rating_count > 100 & cover != null;
        sort rating desc;
        limit 200;
      `),
    ]);

    // Merge and deduplicate by IGDB id
    const seen = new Set();
    const games = [];
    for (const g of [...(byHype||[]), ...(byPopularity||[]), ...(byRating||[])]) {
      if (!seen.has(g.id)) { seen.add(g.id); games.push(g); }
    }

    if (!games.length) {
      console.warn('[syncGames] IGDB returned no games');
      return;
    }


    // Get Twitch viewer counts for all games (batched 100 at a time)
    const names = games.map(g => g.name);
    const viewerMap = await getTwitchViewers(names).catch(e => {
      console.warn('[syncGames] Twitch viewers fetch failed:', e.message);
      return {};
    });

    for (const g of games) {
      const coverUrl = g.cover?.url
        ? g.cover.url.replace('t_thumb', 't_cover_big').replace(/^\/\//, 'https://')
        : null;

      const genres = (g.genres || []).map(x => x.name);
      const twitchViewers = viewerMap[g.name.toLowerCase()] || 0;

      const releaseDate = g.first_release_date
        ? new Date(g.first_release_date * 1000).toISOString().slice(0, 10)
        : null;

      // Detect Steam store URL by domain (category field not always returned)
      const steamUrl = (g.websites || []).find(w => w.url && w.url.includes('store.steampowered.com'))?.url || null;

      const score = trendingScore({
        twitch_viewers: twitchViewers,
        igdb_rating: g.rating || 0,
        igdb_rating_count: g.rating_count || 0,
        hype: g.hypes || 0,
        release_date: releaseDate,
      });

      db.upsertGame({
        igdb_id:        g.id,
        name:           g.name,
        cover_url:      coverUrl,
        genres:         genres.join(', '),
        summary:        (g.summary || '').slice(0, 300),
        igdb_rating:    Math.round(g.rating || 0),
        rating_count:   g.rating_count || 0,
        hypes:          g.hypes || 0,
        twitch_viewers: twitchViewers,
        trending_score: score,
        release_date:   releaseDate,
        steam_url:      steamUrl,
      });
    }

    gamesCache.set('synced', true);
    console.log(`[syncGames] Synced ${games.length} games.`);
  } catch (err) {
    console.error('[syncGames] Error:', err.message);
  }
}

module.exports = { syncGames, getTrendingGames: () => db.getTrendingGames() };
