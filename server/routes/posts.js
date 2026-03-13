const router = require('express').Router();
const db = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { askClaude, CLAUDE_BOT_ID } = require('../services/askClaude');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const postImgDir = path.join(__dirname, '..', 'uploads', 'posts');
if (!fs.existsSync(postImgDir)) fs.mkdirSync(postImgDir, { recursive: true });
const postImgUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, postImgDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.jpg';
      cb(null, `post_${req.user?.userId}_${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Images only')),
});

// Fire-and-forget: if text mentions @Claude, post Claude's reply as a comment
async function maybeAskClaude(postId, text, contextNote, io) {
  if (!/@Claude\b/i.test(text)) return;
  const reply = await askClaude(text, contextNote);
  if (!reply) return;
  const comment = db.addComment({ post_id: +postId, user_id: CLAUDE_BOT_ID, body: reply });
  io?.emit('post:comment', { postId: String(postId), comment });
}

// GET /api/posts
router.get('/', optionalAuth, (req, res) => {
  const { tab = 'for-you', game } = req.query;
  const uid = req.user?.userId;
  res.json(db.getPosts(tab, uid, game));
});

// GET /api/posts/user/:id
router.get('/user/:id', optionalAuth, (req, res) => {
  res.json(db.getUserPosts(req.params.id, req.user?.userId));
});

// POST /api/posts
router.post('/', requireAuth, (req, res) => {
  const { body, type, game, platform, clip_title, clip_desc, achievement_title, achievement_game, achievement_icon } = req.body;
  if (!body?.trim()) return res.status(400).json({ error: 'Post body required' });
  if (body.length > 500) return res.status(400).json({ error: 'Max 500 characters' });
  const { image_url } = req.body;
  const post = db.createPost({ user_id: req.user.userId, body: body.trim(), type: type||'post', game: game||null, platform: platform||null, image_url: image_url||null, clip_title: clip_title||null, clip_desc: clip_desc||null, achievement_title: achievement_title||null, achievement_game: achievement_game||null, achievement_icon: achievement_icon||null, reactions_gg:0,reactions_fire:0,reactions_rekt:0,reactions_king:0,reactions_epic:0,reactions_lul:0,comments_count:0,reposts_count:0,views:0 });
  const io = req.app.get('io');
  io?.emit('post:new', post);
  // If post mentions @Claude, reply as a comment (async, non-blocking)
  maybeAskClaude(post.id, body.trim(), null, io);
  res.status(201).json(post);
});

// DELETE /api/posts/:id
router.delete('/:id', requireAuth, (req, res) => {
  const post = db.getPost(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  if (post.user_id !== req.user.userId) return res.status(403).json({ error: 'Not your post' });
  db.deletePost(req.params.id);
  res.json({ success: true });
});

// POST /api/posts/:id/react
router.post('/:id/react', requireAuth, (req, res) => {
  const { type } = req.body;
  if (!['gg','fire','rekt','king','epic','lul'].includes(type)) return res.status(400).json({ error: 'Invalid reaction type' });
  const post = db.getPost(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const action = db.react(req.user.userId, req.params.id, type);
  if (action === 'added' && post.user_id !== req.user.userId) {
    const me = db.getUser(req.user.userId);
    const emojis = {gg:'🎮',fire:'🔥',rekt:'💀',king:'👑',epic:'⚡',lul:'🤣'};
    db.addNotif({ user_id: post.user_id, actor_id: req.user.userId, type:'reaction', icon: emojis[type], text:`<strong>${me.username}</strong> reacted ${emojis[type]} to your post.`, read:0 });
  }
  res.json({ action, type });
});

// POST /api/posts/:id/repost
router.post('/:id/repost', requireAuth, (req, res) => {
  const post = db.getPost(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  const result = db.repost(req.user.userId, req.params.id);
  res.json(result);
});

// GET /api/posts/:id/comments
router.get('/:id/comments', (req, res) => res.json(db.getComments(req.params.id)));

// POST /api/posts/:id/comments
router.post('/:id/comments', requireAuth, (req, res) => {
  const { body, parent_id } = req.body;
  if (!body?.trim()) return res.status(400).json({ error: 'body required' });
  const post = db.getPost(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const comment = db.addComment({ post_id:+req.params.id, user_id: req.user.userId, body: body.trim(), parent_id: parent_id||null });
  if (post.user_id !== req.user.userId) {
    const me = db.getUser(req.user.userId);
    db.addNotif({ user_id: post.user_id, actor_id: req.user.userId, type:'mention', icon:'💬', text:`<strong>${me.username}</strong> commented on your post.`, read:0 });
  }
  const io = req.app.get('io');
  io?.emit('post:comment', { postId: req.params.id, comment });
  // If comment mentions @Claude, reply as another comment (async, non-blocking)
  maybeAskClaude(req.params.id, body.trim(), post.body, io);
  res.status(201).json(comment);
});

// POST /api/posts/:id/ask-claude  — inline AI insight (no comment created)
router.post('/:id/ask-claude', async (req, res) => {
  const post = db.getPost(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const { askClaude } = require('../services/askClaude');
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'AI not configured' });
  try {
    const Anthropic = require('@anthropic-ai/sdk');
    const client = new Anthropic({ apiKey });
    const msg = await client.messages.create({
      model: 'claude-haiku-4-5-20251001', max_tokens: 400,
      system: `You are Claude, an AI gaming assistant on NEXUS GG. Give a helpful insight about the post, then suggest 2 short follow-up questions a gamer might ask. Reply as JSON: {"reply":"...","chips":["...","..."]}. Keep reply under 2 sentences. Be casual and gaming-focused.`,
      messages: [{ role: 'user', content: post.body }],
    });
    const text = msg.content[0]?.text || '{}';
    let parsed = { reply: text, chips: [] };
    try { parsed = JSON.parse(text); } catch {}
    res.json(parsed);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/posts/upload-image
router.post('/upload-image', requireAuth, postImgUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image provided' });
  res.json({ url: `/uploads/posts/${req.file.filename}` });
});

module.exports = router;
