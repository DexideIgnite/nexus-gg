const router = require('express').Router();
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dxed_super_secret_key_change_this_in_production';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';
const makeToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

const GRADIENTS = [
  'linear-gradient(135deg,#8b5cf6,#3b82f6)',
  'linear-gradient(135deg,#ef4444,#7c3aed)',
  'linear-gradient(135deg,#22c55e,#06b6d4)',
  'linear-gradient(135deg,#f97316,#ef4444)',
  'linear-gradient(135deg,#a855f7,#ec4899)',
];

function getBaseUrl(req) {
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

function findOrCreateOAuthUser(provider, profile) {
  // Check if user already exists with this OAuth
  let user = db.getUserByOAuth(provider, profile.id);
  if (user) return user;

  // Check if email matches existing account — link it
  if (profile.email) {
    user = db.getUserByLogin(profile.email);
    if (user) {
      db.updateUser(user.id, { oauth_provider: provider, oauth_id: profile.id });
      return db.getUser(user.id);
    }
  }

  // Create new user
  const username = profile.username || profile.email?.split('@')[0] || `user_${crypto.randomBytes(4).toString('hex')}`;
  // Ensure unique username
  let finalUsername = username;
  let attempt = 0;
  while (db.getUserByLogin(finalUsername)) {
    attempt++;
    finalUsername = `${username}${attempt}`;
  }

  return db.createUser({
    username: finalUsername,
    email: profile.email || `${provider}_${profile.id}@oauth.dxed.app`,
    handle: `${finalUsername.toLowerCase().replace(/\s+/g, '_')}#${Math.floor(1000 + Math.random() * 9000)}`,
    password_hash: '', // No password for OAuth users
    avatar: profile.avatar || finalUsername[0].toUpperCase(),
    avatar_url: profile.avatar_url || null,
    rank: 'Bronze',
    bio: '',
    platform: 'PC',
    region: 'NA',
    gradient: GRADIENTS[Math.floor(Math.random() * GRADIENTS.length)],
    online: 0,
    plan: 'free',
    oauth_provider: provider,
    oauth_id: profile.id,
  });
}

// ================================================================
// GOOGLE OAuth
// ================================================================
router.get('/google', (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return res.status(500).json({ error: 'Google OAuth not configured' });
  const redirectUri = `${getBaseUrl(req)}/api/oauth/google/callback`;
  const scope = encodeURIComponent('openid email profile');
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&prompt=select_account`;
  res.redirect(url);
});

router.get('/google/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');
  try {
    const fetch = (await import('node-fetch')).default;
    const redirectUri = `${getBaseUrl(req)}/api/oauth/google/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token) throw new Error('Failed to get access token');

    // Get user info
    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await userRes.json();

    const user = findOrCreateOAuthUser('google', {
      id: profile.id,
      email: profile.email,
      username: profile.name?.replace(/\s+/g, '') || profile.email?.split('@')[0],
      avatar_url: profile.picture || null,
    });

    const token = makeToken(user.id);
    sendOAuthSuccess(res, token, db.safeUser(user, null));
  } catch (err) {
    console.error('Google OAuth error:', err.message);
    sendOAuthError(res, 'Google login failed');
  }
});

// ================================================================
// DISCORD OAuth
// ================================================================
router.get('/discord', (req, res) => {
  const clientId = process.env.DISCORD_CLIENT_ID;
  if (!clientId) return res.status(500).json({ error: 'Discord OAuth not configured' });
  const redirectUri = `${getBaseUrl(req)}/api/oauth/discord/callback`;
  const scope = encodeURIComponent('identify email');
  const url = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}`;
  res.redirect(url);
});

router.get('/discord/callback', async (req, res) => {
  const { code } = req.query;
  if (!code) return res.status(400).send('Missing code');
  try {
    const fetch = (await import('node-fetch')).default;
    const redirectUri = `${getBaseUrl(req)}/api/oauth/discord/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.DISCORD_CLIENT_ID,
        client_secret: process.env.DISCORD_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token) throw new Error('Failed to get access token');

    // Get user info
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await userRes.json();

    const avatarUrl = profile.avatar
      ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png?size=256`
      : null;

    const user = findOrCreateOAuthUser('discord', {
      id: profile.id,
      email: profile.email,
      username: profile.global_name || profile.username,
      avatar_url: avatarUrl,
    });

    const token = makeToken(user.id);
    sendOAuthSuccess(res, token, db.safeUser(user, null));
  } catch (err) {
    console.error('Discord OAuth error:', err.message);
    sendOAuthError(res, 'Discord login failed');
  }
});

// ================================================================
// APPLE OAuth (Sign in with Apple)
// ================================================================
router.get('/apple', (req, res) => {
  const clientId = process.env.APPLE_CLIENT_ID;
  if (!clientId) return res.status(500).json({ error: 'Apple OAuth not configured' });
  const redirectUri = `${getBaseUrl(req)}/api/oauth/apple/callback`;
  const scope = 'name email';
  const url = `https://appleid.apple.com/auth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${encodeURIComponent(scope)}&response_mode=form_post`;
  res.redirect(url);
});

router.post('/apple/callback', async (req, res) => {
  const { code, id_token, user: userJson } = req.body;
  if (!code) return res.status(400).send('Missing code');
  try {
    const fetch = (await import('node-fetch')).default;

    // Generate client_secret JWT for Apple
    const clientSecret = generateAppleClientSecret();
    const redirectUri = `${getBaseUrl(req)}/api/oauth/apple/callback`;

    // Exchange code for tokens
    const tokenRes = await fetch('https://appleid.apple.com/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: process.env.APPLE_CLIENT_ID,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    });
    const tokens = await tokenRes.json();
    if (!tokens.id_token) throw new Error('Failed to get id_token');

    // Decode Apple's id_token (JWT) to get user info
    const payload = JSON.parse(Buffer.from(tokens.id_token.split('.')[1], 'base64').toString());

    // Apple only sends user info on first authorization
    let userName = null;
    if (userJson) {
      try {
        const parsed = typeof userJson === 'string' ? JSON.parse(userJson) : userJson;
        userName = [parsed.name?.firstName, parsed.name?.lastName].filter(Boolean).join('');
      } catch {}
    }

    const user = findOrCreateOAuthUser('apple', {
      id: payload.sub,
      email: payload.email,
      username: userName || payload.email?.split('@')[0],
    });

    const token = makeToken(user.id);
    sendOAuthSuccess(res, token, db.safeUser(user, null));
  } catch (err) {
    console.error('Apple OAuth error:', err.message);
    sendOAuthError(res, 'Apple login failed');
  }
});

function generateAppleClientSecret() {
  // Apple requires a JWT signed with your private key
  const teamId = process.env.APPLE_TEAM_ID;
  const keyId = process.env.APPLE_KEY_ID;
  const clientId = process.env.APPLE_CLIENT_ID;
  const privateKey = process.env.APPLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!teamId || !keyId || !privateKey) {
    throw new Error('Apple OAuth credentials incomplete');
  }

  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'ES256', kid: keyId };
  const payload = {
    iss: teamId,
    iat: now,
    exp: now + 86400 * 180,
    aud: 'https://appleid.apple.com',
    sub: clientId,
  };

  return jwt.sign(payload, privateKey, { algorithm: 'ES256', header });
}

// ================================================================
// HELPERS — send result back to opener window
// ================================================================
function sendOAuthSuccess(res, token, user) {
  res.send(`<!DOCTYPE html><html><body><script>
    window.opener && window.opener.postMessage({
      type: 'oauth_success',
      token: ${JSON.stringify(token)},
      user: ${JSON.stringify(user)}
    }, window.location.origin);
    window.close();
  </script></body></html>`);
}

function sendOAuthError(res, message) {
  res.send(`<!DOCTYPE html><html><body><script>
    window.opener && window.opener.postMessage({
      type: 'oauth_error',
      error: ${JSON.stringify(message)}
    }, window.location.origin);
    window.close();
  </script></body></html>`);
}

// ================================================================
// STATUS — check which providers are configured
// ================================================================
router.get('/status', (req, res) => {
  res.json({
    google: !!process.env.GOOGLE_CLIENT_ID,
    discord: !!process.env.DISCORD_CLIENT_ID,
    apple: !!process.env.APPLE_CLIENT_ID,
  });
});

module.exports = router;
