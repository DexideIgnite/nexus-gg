const router = require('express').Router();
const db = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { hasFeature } = require('../../shared/features');

router.get('/', optionalAuth, (req, res) => res.json(db.searchClans(req.query.q)));
router.get('/mine', requireAuth, (req, res) => res.json(db.getUserClans(req.user.userId)));
router.post('/', requireAuth, (req, res) => {
  // Pro-only gate: clan creation
  const user = db.getUser(req.user.userId);
  if (!hasFeature(user, 'clan_create')) {
    return res.status(403).json({ error: 'Clan creation requires NEXUS Pro', upgrade: true });
  }
  const { name, tag, description, game, banner_color } = req.body;
  if (!name?.trim() || !tag?.trim()) return res.status(400).json({ error: 'Name and tag required' });
  if (tag.length > 4) return res.status(400).json({ error: 'Tag max 4 chars' });
  const result = db.createClan({ owner_id: req.user.userId, name: name.trim(), tag, description, game, banner_color });
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result);
});
router.get('/:id', optionalAuth, (req, res) => {
  const clan = db.getClan(req.params.id);
  if (!clan) return res.status(404).json({ error: 'Not found' });
  res.json({ ...clan, isMember: req.user ? db.isClanMember(req.params.id, req.user.userId) : false });
});
router.get('/:id/members', (req, res) => res.json(db.getClanMembers(req.params.id)));
router.get('/:id/feed', optionalAuth, (req, res) => res.json(db.getClanFeed(req.params.id, req.user?.userId)));
router.post('/:id/join', requireAuth, (req, res) => {
  const result = db.joinClanById(req.params.id, req.user.userId);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});
router.delete('/:id/leave', requireAuth, (req, res) => {
  const result = db.leaveClan(req.params.id, req.user.userId);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});
router.delete('/:id', requireAuth, (req, res) => {
  const result = db.deleteClan(req.params.id, req.user.userId);
  if (result.error) return res.status(400).json(result);
  res.json(result);
});

module.exports = router;
