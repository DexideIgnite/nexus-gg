require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const fs = require('fs');
const db = require('./db');
const EVENTS = require('../shared/events');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*', methods: ['GET', 'POST', 'PATCH', 'DELETE'] }
});

const JWT_SECRET = process.env.JWT_SECRET || 'dxed_super_secret_key_change_this_in_production';
const PORT = process.env.PORT || 3000;

// ================================================================
// ASYNC STARTUP — wait for DB before accepting requests
// ================================================================
async function startServer() {
  // Initialize database (loads data from PostgreSQL if DATABASE_URL is set)
  await db.initDb();

  // Reset all users to offline on every server start (only sockets set online:1)
  db.T.users.update(() => true, { online: 0 });

  // Ensure Claude bot user exists (id 999)
  if (!db.T.users.findOne(u => u.id === 999)) {
    db.T.users.data.push({
      id: 999,
      created_at: '2026-01-01T00:00:00.000Z',
      username: 'Claude',
      handle: 'Claude',
      email: 'claude@dxed.gg',
      password_hash: '',
      avatar: 'C',
      avatar_url: '/claude-avatar.svg',
      rank: 'AI',
      bio: 'AI gaming assistant powered by Anthropic. Mention @Claude in any post or comment!',
      gradient: 'linear-gradient(135deg,#cc785c,#a85f45)',
      online: 1,
      now_playing: null,
      platform: 'All',
      region: 'Global',
      verified: true,
      badge_type: 'official',
      is_bot: true,
    });
    db.T.users._save();
  }

  // Ensure the first non-bot user (platform owner) has ownership badge
  const firstUser = db.T.users.findAll(u => !u.is_bot).sort((a, b) => a.id - b.id)[0];
  if (firstUser && firstUser.badge_type !== 'ownership') {
    db.updateUser(firstUser.id, { badge_type: 'ownership', verified: true });
  }

  // Sync comment counts after data is loaded
  db.syncCommentCounts();

  // ================================================================
  // MIDDLEWARE
  // ================================================================
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, '..')));
  app.use('/shared', express.static(path.join(__dirname, '..', 'shared')));
  app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

  // ================================================================
  // ROUTES
  // ================================================================
  app.get('/api/health', (req, res) => res.json({ status: 'ok', uptime: process.uptime() }));
  app.use('/api/auth',          require('./routes/auth'));
  app.use('/api/oauth',         require('./routes/oauth'));
  app.use('/api/posts',         require('./routes/posts'));
  app.use('/api/users',         require('./routes/users'));
  app.use('/api/lfg',           require('./routes/lfg'));
  app.use('/api/messages',      require('./routes/messages'));
  app.use('/api/notifications', require('./routes/notifications'));
  app.use('/api/games',         require('./routes/games'));
  app.use('/api/clans',         require('./routes/clans'));
  app.use('/api/hashtags',      require('./routes/hashtags'));
  app.use('/api/admin',         require('./routes/admin'));
  app.get('/api/search',        (req, res) => res.json(db.fullSearch(req.query.q, null)));

  // Leaderboard endpoint
  app.get('/api/leaderboard', (req, res) => {
    res.json(db.getLeaderboard());
  });

  // ================================================================
  // STORIES — Instagram-style 24h media stories
  // ================================================================
  const storiesUploadDir = path.join(__dirname, 'uploads', 'stories');
  if (!fs.existsSync(storiesUploadDir)) fs.mkdirSync(storiesUploadDir, { recursive: true });

  const storyStorage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, storiesUploadDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      cb(null, `story_${Date.now()}_${Math.random().toString(36).slice(2)}${ext}`);
    },
  });
  const storyUpload = multer({
    storage: storyStorage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
    fileFilter: (req, file, cb) => {
      if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) cb(null, true);
      else cb(new Error('Only images and videos allowed'));
    },
  });

  function storyAuth(req, res, next) {
    const auth = req.headers.authorization;
    if (!auth) return res.status(401).json({ error: 'No token' });
    try { req.user = jwt.verify(auth.replace('Bearer ', ''), JWT_SECRET); next(); }
    catch { res.status(401).json({ error: 'Invalid token' }); }
  }

  // GET /api/stories — active stories grouped by user, ordered unwatched-first
  app.get('/api/stories', storyAuth, (req, res) => {
    res.json(db.getStoriesGrouped(req.user.userId));
  });

  // POST /api/stories — upload media + optional thumbnail
  app.post('/api/stories', storyAuth, storyUpload.fields([
    { name: 'media', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 },
  ]), (req, res) => {
    const mediaFile = req.files?.media?.[0];
    const thumbFile = req.files?.thumbnail?.[0];
    if (!mediaFile) return res.status(400).json({ error: 'No file uploaded' });
    const mediaUrl = '/uploads/stories/' + mediaFile.filename;
    const thumbUrl = thumbFile ? '/uploads/stories/' + thumbFile.filename : null;
    const mediaType = mediaFile.mimetype.startsWith('video/') ? 'video' : 'image';
    const story = db.createStory({
      user_id: req.user.userId,
      media_url: mediaUrl,
      thumbnail_url: thumbUrl,
      media_type: mediaType,
      duration: req.body.duration ? +req.body.duration : null,
      caption: (req.body.caption || '').slice(0, 200),
      text_overlay: (req.body.text_overlay || '').slice(0, 100),
    });
    res.json(story);
  });

  // DELETE /api/stories/:id
  app.delete('/api/stories/:id', storyAuth, (req, res) => {
    const n = db.deleteStory(req.params.id, req.user.userId);
    if (!n) return res.status(404).json({ error: 'Not found' });
    res.json({ ok: true });
  });

  // POST /api/stories/:id/view — deduplicated per viewer
  app.post('/api/stories/:id/view', storyAuth, (req, res) => {
    db.addStoryView(req.params.id, req.user.userId);
    res.json({ ok: true });
  });

  // GET /api/stories/:id/views — view count (own stories)
  app.get('/api/stories/:id/views', storyAuth, (req, res) => {
    const story = db.T.stories.findOne(s => s.id === +req.params.id);
    if (!story) return res.status(404).json({ error: 'Not found' });
    if (story.user_id !== req.user.userId) return res.status(403).json({ error: 'Forbidden' });
    res.json({ count: db.getStoryViewCount(req.params.id) });
  });

  // Fallback: serve index.html for any unmatched route
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'index.html'));
  });

  // ================================================================
  // SOCKET.IO — REAL-TIME
  // ================================================================
  const onlineUsers = new Map(); // userId -> socketId

  app.set('io', io);
  app.set('onlineUsers', onlineUsers);

  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        socket.user = jwt.verify(token, JWT_SECRET);
      } catch {
        return next(new Error('auth_error'));
      }
    }
    next();
  });

  io.on('connection', (socket) => {
    const userId = socket.user?.userId;

    if (userId) {
      onlineUsers.set(userId, socket.id);
      db.updateUser(userId, { online: 1 });
      socket.join(`user:${userId}`);
      io.emit(EVENTS.USER_ONLINE, { userId });
      console.log(`🟢 User ${userId} connected`);
    }

    // Direct message via socket
    socket.on(EVENTS.MESSAGE_SEND, ({ receiverId, text }) => {
      if (!userId || !text?.trim()) return;
      const savedMsg = db.sendMessage(userId, receiverId, text.trim());
      const sender = db.getUser(userId);
      const payload = { ...savedMsg, time: 'just now', username: sender?.username, avatar: sender?.avatar, gradient: sender?.gradient };

      // Send to receiver
      const receiverSocketId = onlineUsers.get(+receiverId);
      if (receiverSocketId) io.to(receiverSocketId).emit(EVENTS.MESSAGE_RECEIVE, { ...payload, mine: false });

      // Confirm to sender
      socket.emit(EVENTS.MESSAGE_SENT, { ...payload, mine: true });

      // Notification
      db.addNotif({ user_id: +receiverId, actor_id: userId, type: 'message', icon: '💬', text: `<strong>${sender?.username}</strong> sent you a message.`, read: 0 });
    });

    // Typing indicator
    socket.on(EVENTS.TYPING_START, ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(+receiverId);
      if (receiverSocketId) io.to(receiverSocketId).emit(EVENTS.TYPING_START, { userId });
    });
    socket.on(EVENTS.TYPING_STOP, ({ receiverId }) => {
      const receiverSocketId = onlineUsers.get(+receiverId);
      if (receiverSocketId) io.to(receiverSocketId).emit(EVENTS.TYPING_STOP, { userId });
    });

    // Update now_playing status
    socket.on(EVENTS.STATUS_UPDATE, ({ nowPlaying }) => {
      if (!userId) return;
      db.updateUser(userId, { now_playing: nowPlaying || null });
      io.emit(EVENTS.USER_STATUS, { userId, nowPlaying });
    });

    socket.on('disconnect', () => {
      if (userId) {
        onlineUsers.delete(userId);
        db.updateUser(userId, { online: 0, now_playing: null });
        io.emit(EVENTS.USER_OFFLINE, { userId });
        console.log(`⚫ User ${userId} disconnected`);
      }
    });
  });

  // ================================================================
  // START
  // ================================================================
  server.listen(PORT, () => {
    console.log('\n╔══════════════════════════════════════╗');
    console.log('║   🎮  DXED  — Server Started            ║');
    console.log(`║   http://localhost:${PORT}               ║`);
    console.log('╚══════════════════════════════════════╝\n');
    console.log('  Test accounts (password: dxed123)');
    console.log('  ► pro@dxed.gg       (ProGamer_X)');
    console.log('  ► night@dxed.gg     (NightWitch_V)');
    console.log('  ► clip@dxed.gg      (ClipMaster_K)');
    console.log('\n  Or register a new account!\n');

    // Sync trending games on startup, then every hour
    const { syncGames } = require('./services/syncGames');
    syncGames().catch(e => console.error('[syncGames startup]', e.message));
    setInterval(() => syncGames().catch(e => console.error('[syncGames interval]', e.message)), 60 * 60 * 1000);
  });
}

// Launch the server
startServer().catch(err => {
  console.error('[startup] Fatal error:', err);
  process.exit(1);
});
