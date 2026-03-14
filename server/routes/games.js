const express = require('express');
const router = express.Router();
const db = require('../db');
const { syncGames } = require('../services/syncGames');

// GET /api/games/trending
router.get('/trending', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 100, 500);
  const games = db.getTrendingGames(limit);
  res.json(games);
});

// GET /api/games/search?q=...
router.get('/search', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.json([]);
  res.json(db.searchGames(q));
});

// GET /api/games/status — diagnostic endpoint to check sync health
router.get('/status', (req, res) => {
  const total = db.getTrendingGames(9999).length;
  const withCovers = db.getTrendingGames(9999).filter(g => g.cover_url).length;
  const withViewers = db.getTrendingGames(9999).filter(g => g.twitch_viewers > 0).length;
  res.json({
    total_games: total,
    with_covers: withCovers,
    with_twitch_viewers: withViewers,
    twitch_client_id_set: !!process.env.TWITCH_CLIENT_ID,
    twitch_secret_set: !!process.env.TWITCH_CLIENT_SECRET,
  });
});

// POST /api/games/sync  (manual trigger, dev use)
router.post('/sync', async (req, res) => {
  try {
    await syncGames();
    res.json({ ok: true, count: db.getTrendingGames(50).length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/games/:id
router.get('/:id', (req, res) => {
  const game = db.getGame(req.params.id);
  if (!game) return res.status(404).json({ error: 'Not found' });
  res.json(game);
});

module.exports = router;
