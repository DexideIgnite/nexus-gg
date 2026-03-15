const router = require('express').Router();
const db = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { askClaude, CLAUDE_BOT_ID } = require('../services/askClaude');
const EVENTS = require('../../shared/events');
const { hasFeature, getPlanLimits } = require('../../shared/features');
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
  limits: { fileSize: 1024 * 1024 * 1024 },
  fileFilter: (req, file, cb) => file.mimetype.startsWith('image/') ? cb(null, true) : cb(new Error('Images only')),
});

const clipDir = path.join(__dirname, '..', 'uploads', 'clips');
if (!fs.existsSync(clipDir)) fs.mkdirSync(clipDir, { recursive: true });
const clipUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => cb(null, clipDir),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase() || '.mp4';
      cb(null, `clip_${req.user?.userId}_${Date.now()}${ext}`);
    },
  }),
  limits: { fileSize: 1024 * 1024 * 1024 },
  fileFilter: (req, file, cb) => file.mimetype.startsWith('video/') ? cb(null, true) : cb(new Error('Videos only')),
});

// Fire-and-forget: if text mentions @Claude, post Claude's reply as a comment
async function maybeAskClaude(postId, text, contextNote, io, imageUrl, authorId) {
  if (!/@Claude\b/i.test(text)) return;
  // Prevent self-trigger: don't let Claude respond to its own posts/comments
  if (+authorId === CLAUDE_BOT_ID) return;
  try {
    const reply = await askClaude(text, contextNote, imageUrl);
    if (!reply) return;
    const comment = db.addComment({ post_id: +postId, user_id: CLAUDE_BOT_ID, body: reply });
    io?.emit(EVENTS.POST_COMMENT, { postId: String(postId), comment });
    // Notify the user who triggered Claude
    if (+authorId !== CLAUDE_BOT_ID) {
      db.addNotif({ user_id: +authorId, actor_id: CLAUDE_BOT_ID, type: 'mention', icon: '🤖', text: '<strong>Claude</strong> replied to your post.', read: 0 });
    }
  } catch (err) {
    console.error('[maybeAskClaude] Error:', err.message);
    // Post a friendly error comment
    const errorComment = db.addComment({ post_id: +postId, user_id: CLAUDE_BOT_ID, body: "Sorry, I'm having trouble thinking right now. Try again in a bit! 🤖" });
    io?.emit(EVENTS.POST_COMMENT, { postId: String(postId), comment: errorComment });
  }
}

// GET /api/posts
router.get('/', optionalAuth, (req, res) => {
  const { tab = 'for-you', game, after } = req.query;
  const uid = req.user?.userId;
  let posts = db.getPosts(tab, uid, game);
  // Cursor-based pagination: ?after=postId returns posts after that ID
  if (after) {
    const idx = posts.findIndex(p => p.id === +after);
    if (idx >= 0) posts = posts.slice(idx + 1);
  }
  res.json(posts);
});

// GET /api/posts/user/:id
router.get('/user/:id', optionalAuth, (req, res) => {
  res.json(db.getUserPosts(req.params.id, req.user?.userId));
});

// GET /api/posts/bookmarks/mine
router.get('/bookmarks/mine', requireAuth, (req, res) => {
  res.json(db.getBookmarks(req.user.userId));
});

// POST /api/posts
router.post('/', requireAuth, (req, res) => {
  const { body, type, game, platform, clip_title, clip_desc, achievement_title, achievement_game, achievement_icon, has_poll, poll_options, quoted_post_id } = req.body;
  if (!body?.trim()) return res.status(400).json({ error: 'Post body required' });
  if (body.length > 500) return res.status(400).json({ error: 'Max 500 characters' });

  // Enforce post history cap per plan
  const postUser = db.getUser(req.user.userId);
  const limits = getPlanLimits((postUser?.plan) || 'free');
  if (limits.max_posts !== Infinity) {
    const userPostCount = db.T.posts.count(p => p.user_id === req.user.userId);
    if (userPostCount >= limits.max_posts) {
      // Auto-delete oldest posts to make room
      const oldest = db.T.posts.findAll(p => p.user_id === req.user.userId)
        .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        .slice(0, userPostCount - limits.max_posts + 1);
      oldest.forEach(p => {
        if (p.image_url) unlinkUpload(p.image_url);
        if (p.clip_url) unlinkUpload(p.clip_url);
        db.deletePost(p.id);
      });
    }
  }

  const { image_url, clip_url } = req.body;
  const hasPoll = !!has_poll && Array.isArray(poll_options) && poll_options.length >= 2;

  // Snapshot the quoted post at creation time
  let quoted_snapshot = null;
  if (quoted_post_id) {
    const qp = db.getPost(quoted_post_id);
    if (qp) {
      const qu = db.getUser(qp.user_id);
      quoted_snapshot = { body: qp.body, username: qu?.username, handle: qu?.handle || qu?.username, avatar: qu?.avatar, gradient: qu?.gradient, created_at: qp.created_at, image_url: qp.image_url || null, clip_url: qp.clip_url || null };
    }
  }

  const post = db.createPost({ user_id: req.user.userId, body: body.trim(), type: type||'post', game: game||null, platform: platform||null, image_url: image_url||null, clip_url: clip_url||null, clip_title: clip_title||null, clip_desc: clip_desc||null, achievement_title: achievement_title||null, achievement_game: achievement_game||null, achievement_icon: achievement_icon||null, has_poll: hasPoll, quoted_post_id: quoted_post_id||null, quoted_snapshot, reactions_gg:0,reactions_fire:0,reactions_rekt:0,reactions_king:0,reactions_epic:0,reactions_lul:0,comments_count:0,reposts_count:0,views:0 });
  if (hasPoll) db.createPollOptions(post.id, poll_options.slice(0, 6));
  db.updateChallengeProgress(req.user.userId, 'post');
  const io = req.app.get('io');
  io?.emit(EVENTS.POST_NEW, post);
  // If post mentions @Claude, check subscription before replying
  const wantsClaude = /@Claude\b/i.test(body.trim());
  const hasAI = hasFeature(postUser, 'claude_bot');
  if (wantsClaude && hasAI) maybeAskClaude(post.id, body.trim(), null, io, image_url||null, req.user.userId);
  res.status(201).json({ ...post, _claudeGated: wantsClaude && !hasAI });
});

// Helper: fire-and-forget file unlink
function unlinkUpload(urlPath) {
  if (!urlPath || !urlPath.startsWith('/uploads/')) return;
  const abs = path.join(__dirname, '..', urlPath);
  fs.unlink(abs, () => {}); // ignore errors
}

// DELETE /api/posts/:id
router.delete('/:id', requireAuth, (req, res) => {
  const post = db.getPost(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  if (post.user_id !== req.user.userId) return res.status(403).json({ error: 'Not your post' });
  // Clean up uploaded files
  if (post.image_url) unlinkUpload(post.image_url);
  if (post.clip_url) unlinkUpload(post.clip_url);
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
  if (action === 'added') db.updateChallengeProgress(req.user.userId, 'react');
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
  db.updateChallengeProgress(req.user.userId, 'comment');
  const io = req.app.get('io');
  io?.emit(EVENTS.POST_COMMENT, { postId: req.params.id, comment });
  // If comment mentions @Claude, check subscription before replying
  const wantsClaude = /@Claude\b/i.test(body.trim());
  const commentUser = db.getUser(req.user.userId);
  const hasAI = hasFeature(commentUser, 'claude_bot');
  if (wantsClaude && hasAI) maybeAskClaude(req.params.id, body.trim(), post.body, io, null, req.user.userId);
  res.status(201).json({ ...comment, _claudeGated: wantsClaude && !hasAI });
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
      system: `You are Claude, an AI gaming assistant on DXED. Give a helpful insight about the post, then suggest 2 short follow-up questions a gamer might ask. Reply as JSON: {"reply":"...","chips":["...","..."]}. Keep reply under 2 sentences. Be casual and gaming-focused.`,
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

// POST /api/posts/:id/bookmark — toggle bookmark
router.post('/:id/bookmark', requireAuth, (req, res) => {
  const action = db.toggleBookmark(req.user.userId, req.params.id);
  res.json({ action });
});

// POST /api/posts/:id/vote — vote on poll
router.post('/:id/vote', requireAuth, (req, res) => {
  const { option_id } = req.body;
  if (!option_id) return res.status(400).json({ error: 'option_id required' });
  const result = db.votePoll(req.params.id, req.user.userId, option_id);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

// POST /api/posts/upload-image — convert to base64 data URL for DB persistence
router.post('/upload-image', requireAuth, postImgUpload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image provided' });
  // Enforce plan-based file size limit
  const user = db.getUser(req.user.userId);
  const limits = getPlanLimits((user?.plan) || 'free');
  if (req.file.size > limits.max_upload_bytes) {
    fs.unlink(req.file.path, () => {});
    const maxMB = Math.round(limits.max_upload_bytes / (1024 * 1024));
    return res.status(413).json({ error: `File too large. Max ${maxMB}MB for your plan.` });
  }
  const data = fs.readFileSync(req.file.path);
  const base64 = data.toString('base64');
  const mimeType = req.file.mimetype || 'image/jpeg';
  const dataUrl = `data:${mimeType};base64,${base64}`;
  // Remove the temp file since we're storing in DB
  fs.unlink(req.file.path, () => {});
  res.json({ url: dataUrl });
});

// POST /api/posts/upload-clip — convert to base64 data URL for DB persistence
router.post('/upload-clip', requireAuth, clipUpload.single('clip'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No video provided' });
  const user = db.getUser(req.user.userId);
  const limits = getPlanLimits((user?.plan) || 'free');
  // Enforce plan-based file size limit
  if (req.file.size > limits.max_upload_bytes) {
    fs.unlink(req.file.path, () => {});
    const maxMB = Math.round(limits.max_upload_bytes / (1024 * 1024));
    return res.status(413).json({ error: `File too large. Max ${maxMB}MB for your plan.` });
  }
  const maxSec = limits.max_clip_seconds || 60;
  const data = fs.readFileSync(req.file.path);
  const base64 = data.toString('base64');
  const mimeType = req.file.mimetype || 'video/mp4';
  const dataUrl = `data:${mimeType};base64,${base64}`;
  fs.unlink(req.file.path, () => {});
  res.json({ url: dataUrl, max_clip_seconds: maxSec });
});

// POST /api/posts/batch-views — increment view counts for multiple posts
router.post('/batch-views', optionalAuth, (req, res) => {
  const { postIds } = req.body;
  if (!Array.isArray(postIds)) return res.status(400).json({ error: 'postIds required' });
  const userId = req.user?.userId;
  postIds.forEach(id => {
    const p = db.getPost(id);
    if (p) db.updatePost(id, { views: (p.views || 0) + 1 });
  });
  res.json({ success: true });
});

module.exports = router;
