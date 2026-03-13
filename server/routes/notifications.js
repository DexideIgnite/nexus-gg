const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

router.get('/', requireAuth, (req, res) => res.json(db.getNotifs(req.user.userId)));
router.post('/read-all', requireAuth, (req, res) => { db.readAllNotifs(req.user.userId); res.json({ success: true }); });
router.patch('/:id/read', requireAuth, (req, res) => { db.readNotif(req.params.id); res.json({ success: true }); });
module.exports = router;
