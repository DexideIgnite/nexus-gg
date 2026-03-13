const router = require('express').Router();
const db = require('../db');
const { requireAuth, optionalAuth } = require('../middleware/auth');

router.get('/online', (req, res) => res.json(db.getOnlineUsers().map(u => ({ id:u.id, username:u.username, avatar:u.avatar, gradient:u.gradient, now_playing:u.now_playing, online:u.online }))));
router.get('/game-follows/mine', requireAuth, (req, res) => res.json(db.getGameFollows(req.user.userId)));
router.post('/game/follow', requireAuth, (req, res) => { const {game}=req.body; if(!game)return res.status(400).json({error:'game required'}); res.json({action:db.toggleGameFollow(req.user.userId,game)}); });
router.get('/', optionalAuth, (req, res) => res.json(db.getAllUsers(req.query.search).slice(0,20).map(u=>db.safeUser(u,req.user?.userId))));
router.patch('/me', requireAuth, (req, res) => { const {bio,rank,platform,region,now_playing}=req.body; const changes={}; if(bio!==undefined)changes.bio=bio; if(rank!==undefined)changes.rank=rank; if(platform!==undefined)changes.platform=platform; if(region!==undefined)changes.region=region; if(now_playing!==undefined)changes.now_playing=now_playing; const user=db.updateUser(req.user.userId,changes); res.json(db.safeUser(user,req.user.userId)); });
router.get('/:id', optionalAuth, (req, res) => { const user=db.getUser(req.params.id); if(!user)return res.status(404).json({error:'Not found'}); res.json(db.safeUser(user,req.user?.userId)); });
router.post('/:id/follow', requireAuth, (req, res) => { const tid=+req.params.id; if(tid===req.user.userId)return res.status(400).json({error:'Cannot follow yourself'}); const target=db.getUser(tid); if(!target)return res.status(404).json({error:'Not found'}); const result=db.follow(req.user.userId,tid); if(result.action==='followed'){const me=db.getUser(req.user.userId);db.addNotif({user_id:tid,type:'follow',icon:'👤',text:`<strong>${me.username}</strong> started following you.`,read:0});} res.json(result); });

module.exports = router;
