const router = require('express').Router();
const db = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Avatar upload setup
const avatarDir = path.join(__dirname, '..', 'uploads', 'avatars');
if (!fs.existsSync(avatarDir)) fs.mkdirSync(avatarDir, { recursive: true });
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, avatarDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
    cb(null, `avatar_${req.user.userId}_${Date.now()}${ext}`);
  },
});
const avatarUpload = multer({
  storage: avatarStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Images only'));
  },
});

router.get('/online', (req, res) => res.json(db.getOnlineUsers().map(u => ({ id:u.id, username:u.username, avatar:u.avatar, avatar_url:u.avatar_url, gradient:u.gradient, now_playing:u.now_playing, online:u.online }))));
router.get('/game-follows/mine', requireAuth, (req, res) => res.json(db.getGameFollows(req.user.userId)));
router.post('/game/follow', requireAuth, (req, res) => { const {game}=req.body; if(!game)return res.status(400).json({error:'game required'}); res.json({action:db.toggleGameFollow(req.user.userId,game)}); });

// GET /api/users — search or list
router.get('/', optionalAuth, (req, res) => res.json(db.getAllUsers(req.query.search).slice(0,30).map(u=>db.safeUser(u,req.user?.userId))));

// PATCH /api/users/me — update profile fields
router.patch('/me', requireAuth, (req, res) => {
  const {bio, rank, platform, region, now_playing, username, handle, email} = req.body;
  const changes = {};
  if (bio !== undefined) changes.bio = bio;
  if (rank !== undefined) changes.rank = rank;
  if (platform !== undefined) changes.platform = platform;
  if (region !== undefined) changes.region = region;
  if (now_playing !== undefined) changes.now_playing = now_playing;
  if (username !== undefined && username.trim()) {
    const existing = db.T.users.findOne(u => u.username.toLowerCase() === username.trim().toLowerCase() && u.id !== req.user.userId);
    if (existing) return res.status(400).json({ error: 'Username taken' });
    changes.username = username.trim();
  }
  if (handle !== undefined && handle.trim()) {
    changes.handle = handle.trim().replace(/^@/, '');
  }
  if (email !== undefined && email.trim()) {
    const existing = db.T.users.findOne(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.id !== req.user.userId);
    if (existing) return res.status(400).json({ error: 'Email already in use' });
    changes.email = email.trim().toLowerCase();
  }
  const user = db.updateUser(req.user.userId, changes);
  res.json(db.safeUser(user, req.user.userId));
});

// POST /api/users/me/password — change password
router.post('/me/password', requireAuth, async (req, res) => {
  const { current_password, new_password } = req.body;
  if (!current_password || !new_password) return res.status(400).json({ error: 'Both fields required' });
  if (new_password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
  const user = db.getUser(req.user.userId);
  const valid = await bcrypt.compare(current_password, user.password_hash);
  if (!valid) return res.status(400).json({ error: 'Current password incorrect' });
  const hash = await bcrypt.hash(new_password, 10);
  db.updateUser(req.user.userId, { password_hash: hash });
  res.json({ success: true });
});

// POST /api/users/me/avatar — upload profile picture
router.post('/me/avatar', requireAuth, avatarUpload.single('avatar'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file' });
  const avatar_url = '/uploads/avatars/' + req.file.filename;
  const user = db.updateUser(req.user.userId, { avatar_url });
  res.json({ avatar_url, user: db.safeUser(user, req.user.userId) });
});

// DELETE /api/users/me — delete account
router.delete('/me', requireAuth, (req, res) => {
  const uid = req.user.userId;
  db.T.users.delete(u => u.id === uid);
  db.T.posts.delete(p => p.user_id === uid);
  db.T.follows.delete(f => f.follower_id === uid || f.following_id === uid);
  db.T.notifications.delete(n => n.user_id === uid);
  db.T.messages.delete(m => m.sender_id === uid || m.receiver_id === uid);
  res.json({ success: true });
});

// GET /api/users/:id/followers
router.get('/:id/followers', optionalAuth, (req, res) => {
  const follows = db.T.follows.findAll(f => f.following_id === +req.params.id);
  const users = follows.map(f => {
    const u = db.getUser(f.follower_id);
    return u ? db.safeUser(u, req.user?.userId) : null;
  }).filter(Boolean);
  res.json(users);
});

// GET /api/users/:id/following
router.get('/:id/following', optionalAuth, (req, res) => {
  const follows = db.T.follows.findAll(f => f.follower_id === +req.params.id);
  const users = follows.map(f => {
    const u = db.getUser(f.following_id);
    return u ? db.safeUser(u, req.user?.userId) : null;
  }).filter(Boolean);
  res.json(users);
});

// GET /api/users/:id/game-follows
router.get('/:id/game-follows', optionalAuth, (req, res) => {
  res.json(db.getGameFollows(req.params.id));
});

// GET /api/users/:id
router.get('/:id', optionalAuth, (req, res) => {
  const user = db.getUser(req.params.id);
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json(db.safeUser(user, req.user?.userId));
});

// POST /api/users/:id/follow
router.post('/:id/follow', requireAuth, (req, res) => {
  const tid = +req.params.id;
  if (tid === req.user.userId) return res.status(400).json({ error: 'Cannot follow yourself' });
  const target = db.getUser(tid);
  if (!target) return res.status(404).json({ error: 'Not found' });
  const result = db.follow(req.user.userId, tid);
  if (result.action === 'followed') {
    const me = db.getUser(req.user.userId);
    db.addNotif({ user_id: tid, actor_id: req.user.userId, type: 'follow', icon: '👤', text: `<strong>${me.username}</strong> started following you.`, read: 0 });
  }
  res.json(result);
});

module.exports = router;
