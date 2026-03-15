const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');

const JWT_SECRET = process.env.JWT_SECRET || 'dxed_super_secret_key_change_this_in_production';
const JWT_EXPIRES = process.env.JWT_EXPIRES_IN || '7d';

const makeToken = (userId) => jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES });

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, password, rank, bio, platform, region } = req.body;
  const email = (req.body.email || '').trim().toLowerCase();
  if (!username || !email || !password) return res.status(400).json({ error: 'username, email and password required' });
  if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  if (username.length < 3) return res.status(400).json({ error: 'Username must be at least 3 characters' });
  if (db.getUserByLogin(email) || db.getUserByLogin(username)) return res.status(409).json({ error: 'Username or email already taken' });

  const gradients = ['linear-gradient(135deg,#8b5cf6,#3b82f6)','linear-gradient(135deg,#ef4444,#7c3aed)','linear-gradient(135deg,#22c55e,#06b6d4)','linear-gradient(135deg,#f97316,#ef4444)','linear-gradient(135deg,#a855f7,#ec4899)'];
  const user = db.createUser({
    username, email,
    handle: `${username.toLowerCase().replace(/\s+/g,'_')}#${Math.floor(1000+Math.random()*9000)}`,
    password_hash: bcrypt.hashSync(password, 12),
    avatar: username[0].toUpperCase(),
    rank: rank || 'Bronze',
    bio: bio || '',
    platform: platform || 'PC',
    region: region || 'NA',
    gradient: gradients[Math.floor(Math.random()*gradients.length)],
    online: 0,
    plan: 'free',
  });
  res.status(201).json({ token: makeToken(user.id), user: db.safeUser(user, null) });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { password } = req.body;
  const email = (req.body.email || '').trim();
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = db.getUserByLogin(email);
  if (!user || !user.password_hash || !bcrypt.compareSync(password, user.password_hash)) return res.status(401).json({ error: 'Invalid email or password' });
  res.json({ token: makeToken(user.id), user: db.safeUser(user, null) });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'No token' });
  try {
    const token = header.startsWith('Bearer ') ? header.slice(7) : header;
    const { userId } = jwt.verify(token, JWT_SECRET);
    const user = db.getUser(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user: db.safeUser(user, userId) });
  } catch { res.status(401).json({ error: 'Invalid token' }); }
});

module.exports = router;
