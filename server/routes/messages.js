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
  const msg = db.sendMessage(req.user.userId, req.params.userId, text.trim());
  const me = db.getUser(req.user.userId);
  const payload = { ...msg, mine: true, username: me.username, avatar: me.avatar, gradient: me.gradient, time: 'just now' };
  const onlineUsers = req.app.get('onlineUsers');
  const rid = onlineUsers?.get(+req.params.userId);
  if (rid) req.app.get('io')?.to(rid).emit(EVENTS.MESSAGE_RECEIVE, { ...payload, mine: false });
  res.status(201).json(payload);
});
module.exports = router;
