const router = require('express').Router();
const db = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.get('/', optionalAuth, (req, res) => {
  const posts = db.getLFG(req.query.game, req.query.region);
  res.json(posts.map(p => db.formatLFG(p, req.user?.userId)));
});
router.post('/', requireAuth, (req, res) => {
  const { game, mode, rank_req, region, slots, description } = req.body;
  if (!game) return res.status(400).json({ error: 'game required' });
  const p = db.createLFG({ user_id: req.user.userId, game, mode: mode||'Ranked', rank_req: rank_req||'Any', region: region||'NA', slots: slots||5, description: description||'' });
  const formatted = db.formatLFG(p, req.user.userId);
  req.app.get('io')?.emit('lfg:new', formatted);
  res.status(201).json(formatted);
});
router.post('/:id/join', requireAuth, (req, res) => {
  const post = db.getLFGPost(req.params.id);
  if (!post) return res.status(404).json({ error: 'Not found' });
  if (post.user_id === req.user.userId) return res.status(400).json({ error: 'You are the host' });
  const formatted = db.formatLFG(post, req.user.userId);
  if (formatted.status === 'full' && !formatted.isMember) return res.status(400).json({ error: 'Party is full' });
  const action = db.joinLFG(req.params.id, req.user.userId);
  if (action === 'joined') {
    const me = db.getUser(req.user.userId);
    db.addNotif({ user_id: post.user_id, type:'system', icon:'👥', text:`<strong>${me.username}</strong> joined your LFG for ${post.game}!`, read:0 });
  }
  const updated = db.formatLFG(db.getLFGPost(req.params.id), req.user.userId);
  req.app.get('io')?.emit('lfg:update', updated);
  res.json({ action, ...updated });
});
router.delete('/:id', requireAuth, (req, res) => {
  const p = db.getLFGPost(req.params.id);
  if (!p) return res.status(404).json({ error: 'Not found' });
  if (p.user_id !== req.user.userId) return res.status(403).json({ error: 'Not your post' });
  db.T.lfg_posts.delete(x => x.id === +req.params.id);
  res.json({ success: true });
});
module.exports = router;
