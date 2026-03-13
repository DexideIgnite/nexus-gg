const router = require('express').Router();
const db = require('../db');
const { optionalAuth } = require('../middleware/auth');

router.get('/trending', (req, res) => res.json(db.getTrendingHashtags()));
router.get('/posts/:tag', optionalAuth, (req, res) => res.json(db.getPostsByHashtag(req.params.tag, req.user?.userId)));

module.exports = router;
