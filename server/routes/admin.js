const router = require('express').Router();
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

// ── Owner-only middleware (first registered user = platform owner) ──
function requireOwner(req, res, next) {
  const user = db.getUser(req.user.userId);
  if (!user || user.badge_type !== 'ownership') return res.status(403).json({ error: 'Owner access only' });
  next();
}

// ── Dashboard stats ──
router.get('/stats', requireAuth, requireOwner, (req, res) => {
  const users = db.T.users.findAll();
  const posts = db.T.posts.findAll();
  const comments = db.T.comments.findAll();
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const week = 7 * day;

  const usersToday = users.filter(u => now - new Date(u.created_at).getTime() < day).length;
  const usersThisWeek = users.filter(u => now - new Date(u.created_at).getTime() < week).length;
  const postsToday = posts.filter(p => now - new Date(p.created_at).getTime() < day).length;
  const postsThisWeek = posts.filter(p => now - new Date(p.created_at).getTime() < week).length;
  const commentsToday = comments.filter(c => now - new Date(c.created_at).getTime() < day).length;

  const onlineCount = users.filter(u => u.online).length;
  const totalReactions = posts.reduce((s, p) =>
    s + (p.reactions_gg || 0) + (p.reactions_fire || 0) + (p.reactions_rekt || 0) +
    (p.reactions_king || 0) + (p.reactions_epic || 0) + (p.reactions_lul || 0), 0);

  const planCounts = { free: 0, plus: 0, pro: 0 };
  users.forEach(u => { planCounts[u.plan || 'free'] = (planCounts[u.plan || 'free'] || 0) + 1; });

  const lfgPosts = db.T.lfg_posts.findAll().length;
  const clans = db.T.clans.findAll().length;
  const messages = db.T.messages.findAll().length;

  // Growth: users per day for last 14 days
  const growth = [];
  for (let i = 13; i >= 0; i--) {
    const dayStart = now - (i + 1) * day;
    const dayEnd = now - i * day;
    const count = users.filter(u => {
      const t = new Date(u.created_at).getTime();
      return t >= dayStart && t < dayEnd;
    }).length;
    const date = new Date(dayEnd);
    growth.push({ day: `${date.getMonth() + 1}/${date.getDate()}`, users: count });
  }

  // Top posters
  const postsByUser = {};
  posts.forEach(p => { postsByUser[p.user_id] = (postsByUser[p.user_id] || 0) + 1; });
  const topPosters = Object.entries(postsByUser)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([uid, count]) => {
      const u = db.getUser(uid);
      return { id: +uid, username: u?.username || 'Unknown', avatar: u?.avatar, avatar_url: u?.avatar_url, gradient: u?.gradient, count };
    });

  res.json({
    totalUsers: users.filter(u => !u.is_bot).length,
    totalPosts: posts.length,
    totalComments: comments.length,
    totalReactions,
    onlineCount,
    usersToday,
    usersThisWeek,
    postsToday,
    postsThisWeek,
    commentsToday,
    lfgPosts,
    clans,
    messages,
    planCounts,
    growth,
    topPosters,
  });
});

// ── User management ──
router.get('/users', requireAuth, requireOwner, (req, res) => {
  const search = req.query.search || '';
  const page = Math.max(1, +(req.query.page || 1));
  const limit = 20;
  let users = db.T.users.findAll(u => !u.is_bot);
  if (search) {
    const q = search.toLowerCase();
    users = users.filter(u =>
      (u.username || '').toLowerCase().includes(q) ||
      (u.handle || '').toLowerCase().includes(q) ||
      (u.email || '').toLowerCase().includes(q)
    );
  }
  users.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  const total = users.length;
  const paged = users.slice((page - 1) * limit, page * limit);
  res.json({
    users: paged.map(u => db.safeUser(u, 1)),
    total,
    page,
    pages: Math.ceil(total / limit),
  });
});

// ── Update user (ban, verify, badge, plan, etc.) ──
router.patch('/users/:id', requireAuth, requireOwner, (req, res) => {
  const userId = +req.params.id;
  const target = db.getUser(userId);
  if (target && target.badge_type === 'ownership') return res.status(400).json({ error: 'Cannot modify owner account via admin' });
  const user = db.getUser(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const allowed = ['verified', 'badge_type', 'plan', 'banned', 'ban_reason'];
  const changes = {};
  allowed.forEach(key => {
    if (req.body[key] !== undefined) changes[key] = req.body[key];
  });
  if (changes.badge_type) changes.verified = true;
  if (changes.badge_type === '') changes.verified = false;

  db.updateUser(userId, changes);
  res.json({ success: true, user: db.safeUser(db.getUser(userId), 1) });
});

// ── Delete user ──
router.delete('/users/:id', requireAuth, requireOwner, (req, res) => {
  const userId = +req.params.id;
  const user = db.getUser(userId);
  if (!user) return res.status(404).json({ error: 'User not found' });
  if (user.badge_type === 'ownership') return res.status(400).json({ error: 'Cannot delete owner' });
  if (user.is_bot) return res.status(400).json({ error: 'Cannot delete bot' });

  // Clean up user data
  db.T.post_reactions.delete(r => r.user_id === userId);
  db.T.post_reposts.delete(r => r.user_id === userId);
  db.T.comments.delete(c => c.user_id === userId);
  db.T.bookmarks.delete(b => b.user_id === userId);
  db.T.poll_votes.delete(v => v.user_id === userId);
  db.T.follows.delete(f => f.follower_id === userId || f.following_id === userId);
  db.T.notifications.delete(n => n.user_id === userId || n.actor_id === userId);
  db.T.messages.delete(m => m.sender_id === userId || m.receiver_id === userId);
  db.T.game_follows.delete(f => f.user_id === userId);
  db.T.lfg_members.delete(m => m.user_id === userId);
  db.T.lfg_posts.delete(p => p.user_id === userId);
  db.T.stories.delete(s => s.user_id === userId);
  db.T.story_views.delete(v => v.viewer_id === userId);
  db.T.clan_members.delete(m => m.user_id === userId);
  db.T.user_challenges.delete(uc => uc.user_id === userId);
  db.T.posts.delete(p => p.user_id === userId);
  db.T.users.delete(u => u.id === userId);
  res.json({ success: true });
});

// ── Delete any post ──
router.delete('/posts/:id', requireAuth, requireOwner, (req, res) => {
  const postId = +req.params.id;
  const post = db.getPost(postId);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  db.T.post_reactions.delete(r => r.post_id === postId);
  db.T.post_reposts.delete(r => r.post_id === postId);
  db.T.comments.delete(c => c.post_id === postId);
  db.T.bookmarks.delete(b => b.post_id === postId);
  db.T.poll_votes.delete(v => v.post_id === postId);
  db.T.posts.delete(p => p.id === postId);
  res.json({ success: true });
});

// ── Reported / flagged content (future use) ──
router.get('/reported', requireAuth, requireOwner, (req, res) => {
  // Placeholder – returns recent posts with high engagement for manual review
  const posts = db.T.posts.findAll()
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 20)
    .map(p => db.formatPost(p, 1));
  res.json({ posts });
});

module.exports = router;
