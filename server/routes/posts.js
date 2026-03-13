const router = require('express').Router();
const db = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');

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
  const post = db.createPost({ user_id: req.user.userId, body: body.trim(), type: type||'post', game: game||null, platform: platform||null, clip_title: clip_title||null, clip_desc: clip_desc||null, achievement_title: achievement_title||null, achievement_game: achievement_game||null, achievement_icon: achievement_icon||null, reactions_gg:0,reactions_fire:0,reactions_rekt:0,reactions_king:0,reactions_epic:0,reactions_lul:0,comments_count:0,reposts_count:0,views:0 });
  req.app.get('io')?.emit('post:new', post);
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
  const { body } = req.body;
  if (!body?.trim()) return res.status(400).json({ error: 'body required' });
  const post = db.getPost(req.params.id);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  const comment = db.addComment({ post_id:+req.params.id, user_id: req.user.userId, body: body.trim() });
  if (post.user_id !== req.user.userId) {
    const me = db.getUser(req.user.userId);
    db.addNotif({ user_id: post.user_id, actor_id: req.user.userId, type:'mention', icon:'💬', text:`<strong>${me.username}</strong> commented on your post.`, read:0 });
  }
  req.app.get('io')?.emit('post:comment', { postId: req.params.id, comment });
  res.status(201).json(comment);
});

module.exports = router;
