const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');
const EVENTS = require('../../shared/events');

router.get('/notifications/count', requireAuth, (req, res) => res.json({ notifications: db.unreadNotifCount(req.user.userId), messages: db.unreadMsgCount(req.user.userId) }));
router.get('/conversations', requireAuth, (req, res) => res.json(db.getConversations(req.user.userId)));
router.get('/:userId', requireAuth, (req, res) => { db.markRead(req.params.userId, req.user.userId); res.json(db.getMessages(req.user.userId, req.params.userId)); });
router.post('/:userId', requireAuth, (req, res) => {
  const { text } = req.body;
  if (!text?.trim()) return res.status(400).json({ error: 'text required' });
  const receiver = db.getUser(req.params.userId);
  if (!receiver) return res.status(404).json({ error: 'User not found' });
  // Check if blocked
  if (db.isBlocked(+req.params.userId, req.user.userId)) {
    return res.status(403).json({ error: 'You cannot message this user' });
  }
  if (db.isBlocked(req.user.userId, +req.params.userId)) {
    return res.status(403).json({ error: 'You have blocked this user. Unblock to send messages.' });
  }
  const msg = db.sendMessage(req.user.userId, req.params.userId, text.trim());
  const me = db.getUser(req.user.userId);
  const payload = { ...msg, mine: true, username: me.username, avatar: me.avatar, gradient: me.gradient, time: 'just now' };
  const onlineUsers = req.app.get('onlineUsers');
  const rid = onlineUsers?.get(+req.params.userId);
  if (rid) req.app.get('io')?.to(rid).emit(EVENTS.MESSAGE_RECEIVE, { ...payload, mine: false });
  res.status(201).json(payload);
});

// POST /api/messages/:userId/block — toggle block user
router.post('/:userId/block', requireAuth, (req, res) => {
  const target = db.getUser(req.params.userId);
  if (!target) return res.status(404).json({ error: 'User not found' });
  const action = db.toggleBlock(req.user.userId, +req.params.userId);
  res.json({ action });
});

// POST /api/messages/:userId/mute — toggle mute conversation
router.post('/:userId/mute', requireAuth, (req, res) => {
  const action = db.toggleMute(req.user.userId, +req.params.userId);
  res.json({ action });
});

// POST /api/messages/:userId/pin — toggle pin conversation
router.post('/:userId/pin', requireAuth, (req, res) => {
  const action = db.togglePin(req.user.userId, +req.params.userId);
  res.json({ action });
});

// GET /api/messages/:userId/status — get block/mute/pin status
router.get('/:userId/status', requireAuth, (req, res) => {
  res.json({
    blocked: db.isBlocked(req.user.userId, +req.params.userId),
    muted: db.isMuted(req.user.userId, +req.params.userId),
    pinned: db.isPinned(req.user.userId, +req.params.userId),
  });
});

// DELETE /api/messages/:userId — delete conversation
router.delete('/:userId', requireAuth, (req, res) => {
  const uid = req.user.userId;
  const otherId = +req.params.userId;
  db.T.messages.delete(m =>
    (m.sender_id === uid && m.receiver_id === otherId) ||
    (m.sender_id === otherId && m.receiver_id === uid)
  );
  res.json({ success: true });
});

module.exports = router;
