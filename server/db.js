/**
 * DXED — Pure JavaScript JSON Database
 * No native compilation required. Works on any Node.js version.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ================================================================
// WRITE-LOCK QUEUE — serializes async writes per file to prevent corruption
// ================================================================
const writeQueues = new Map();

function enqueueWrite(filePath, fn) {
  const prev = writeQueues.get(filePath) || Promise.resolve();
  const next = prev.then(fn, fn); // always run even if previous failed
  writeQueues.set(filePath, next);
  return next;
}

// ================================================================
// JSON FILE STORE — synchronous + async, like SQLite but pure JS
// ================================================================

class Table {
  constructor(name) {
    this.file = path.join(DATA_DIR, `${name}.json`);
    this.data = this._load();
  }
  _load() { try { return JSON.parse(fs.readFileSync(this.file, 'utf8')); } catch { return []; } }
  _save() { fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2)); }
  _saveAsync() { return enqueueWrite(this.file, () => fs.promises.writeFile(this.file, JSON.stringify(this.data, null, 2))); }
  nextId() { return this.data.length ? Math.max(...this.data.map(r => r.id || 0)) + 1 : 1; }
  insert(record) { const row = { id: this.nextId(), created_at: new Date().toISOString(), ...record }; this.data.push(row); this._save(); return row; }
  insertAsync(record) { const row = { id: this.nextId(), created_at: new Date().toISOString(), ...record }; this.data.push(row); return this._saveAsync().then(() => row); }
  findAll(predicate) { return predicate ? this.data.filter(predicate) : [...this.data]; }
  findOne(predicate) { return this.data.find(predicate) || null; }
  update(predicate, changes) { let n=0; this.data=this.data.map(r=>{if(predicate(r)){n++;return{...r,...changes};}return r;}); this._save(); return n; }
  updateAsync(predicate, changes) { let n=0; this.data=this.data.map(r=>{if(predicate(r)){n++;return{...r,...changes};}return r;}); return this._saveAsync().then(() => n); }
  delete(predicate) { const b=this.data.length; this.data=this.data.filter(r=>!predicate(r)); this._save(); return b-this.data.length; }
  deleteAsync(predicate) { const b=this.data.length; this.data=this.data.filter(r=>!predicate(r)); return this._saveAsync().then(() => b-this.data.length); }
  count(predicate) { return predicate ? this.data.filter(predicate).length : this.data.length; }
}

// ================================================================
// TABLES
// ================================================================
const T = {
  users:          new Table('users'),
  follows:        new Table('follows'),
  posts:          new Table('posts'),
  post_reactions: new Table('post_reactions'),
  post_reposts:   new Table('post_reposts'),
  comments:       new Table('comments'),
  messages:       new Table('messages'),
  lfg_posts:      new Table('lfg_posts'),
  lfg_members:    new Table('lfg_members'),
  notifications:  new Table('notifications'),
  game_follows:   new Table('game_follows'),
  stories:        new Table('stories'),
  story_views:    new Table('story_views'),
  games:          new Table('games'),
  bookmarks:      new Table('bookmarks'),
  poll_options:   new Table('poll_options'),
  poll_votes:     new Table('poll_votes'),
  clans:          new Table('clans'),
  clan_members:   new Table('clan_members'),
  user_challenges: new Table('user_challenges'),
  profile_views:  new Table('profile_views'),
};

// ================================================================
// SYNC: fix comments_count from actual comment data
// ================================================================
(function syncCommentCounts() {
  const posts = T.posts.findAll();
  posts.forEach(p => {
    const actual = T.comments.findAll(c => c.post_id === p.id && !c.parent_id).length;
    if ((p.comments_count || 0) !== actual) {
      T.posts.update(x => x.id === p.id, { comments_count: actual });
    }
  });
})();

// ================================================================
// DB API
// ================================================================
function timeAgo(d){const diff=Date.now()-new Date(d).getTime(),s=Math.floor(diff/1000),m=Math.floor(s/60),h=Math.floor(m/60),dy=Math.floor(h/24);if(dy>0)return dy+'d ago';if(h>0)return h+'h ago';if(m>0)return m+'m ago';return'just now';}
function safeUser(u,viewerId){if(!u)return null;const{password_hash,...s}=u;s.followers=T.follows.count(f=>f.following_id===u.id);s.following=T.follows.count(f=>f.follower_id===u.id);s.posts_count=T.posts.count(p=>p.user_id===u.id);s.isFollowing=viewerId?!!T.follows.findOne(f=>f.follower_id===+viewerId&&f.following_id===u.id):false;s.verified=!!u.verified;s.plan=u.plan||'free';s.xp=u.xp||0;s.clan_tag=(()=>{const m=T.clan_members.findOne(cm=>cm.user_id===u.id);return m?(T.clans.findOne(c=>c.id===m.clan_id)?.tag||null):null;})();return s;}
function formatPost(p,viewerId){if(typeof p==='number'||typeof p==='string'){const found=T.posts.findOne(x=>x.id===+p);if(!found)return null;p=found;}if(!p)return null;const user=safeUser(T.users.findOne(u=>u.id===p.user_id),viewerId);const myReaction=viewerId?T.post_reactions.findOne(r=>r.user_id===+viewerId&&r.post_id===p.id):null;const reposted=viewerId?!!T.post_reposts.findOne(r=>r.user_id===+viewerId&&r.post_id===p.id):false;let quotedPost=null;if(p.quoted_post_id){if(p.quoted_snapshot){const snap=p.quoted_snapshot;quotedPost={id:+p.quoted_post_id,body:snap.body,user:{username:snap.username,handle:snap.handle,avatar:snap.avatar,gradient:snap.gradient},time:timeAgo(snap.created_at)};}else{const qp=T.posts.findOne(x=>x.id===+p.quoted_post_id);if(qp){const qu=safeUser(T.users.findOne(u=>u.id===qp.user_id),viewerId);quotedPost={id:qp.id,body:qp.body,user:qu,time:timeAgo(qp.created_at)};}}}const bookmarked=viewerId?!!T.bookmarks.findOne(b=>b.user_id===+viewerId&&b.post_id===p.id):false;const poll=p.has_poll?(()=>{const opts=T.poll_options.findAll(o=>o.post_id===p.id);if(!opts.length)return null;const total=opts.reduce((s,o)=>s+(o.votes||0),0);const uv=viewerId?T.poll_votes.findOne(v=>v.post_id===p.id&&v.user_id===+viewerId):null;return{options:opts.map(o=>({...o,pct:total?Math.round((o.votes/total)*100):0})),totalVotes:total,userVoteId:uv?.option_id||null};})():null;return{...p,user,myReaction:myReaction?.reaction_type||null,reposted,reactions:{gg:p.reactions_gg||0,fire:p.reactions_fire||0,rekt:p.reactions_rekt||0,king:p.reactions_king||0,epic:p.reactions_epic||0,lul:p.reactions_lul||0},achievement:p.achievement_title?{title:p.achievement_title,game:p.achievement_game,icon:p.achievement_icon}:null,clip:p.clip_title?{title:p.clip_title,desc:p.clip_desc}:null,quotedPost,bookmarked,poll,time:timeAgo(p.created_at),views:p.views?String(p.views):'0'};}
function formatLFG(l,viewerId){const user=safeUser(T.users.findOne(u=>u.id===l.user_id),viewerId);const members=T.lfg_members.findAll(m=>m.lfg_id===l.id).map(m=>safeUser(T.users.findOne(u=>u.id===m.user_id),viewerId)).filter(Boolean);const filled=members.length+1;const isMember=viewerId?!!T.lfg_members.findOne(m=>m.lfg_id===l.id&&m.user_id===+viewerId):false;const isHost=viewerId&&l.user_id===+viewerId;let status='open';if(filled>=l.slots)status='full';else if(filled>=l.slots-1)status='filling';return{...l,user,members,filled,status,isMember,isHost,time:timeAgo(l.created_at)};}

const db = {
  T, safeUser, formatPost, formatLFG, timeAgo,
  // Users
  getUser:(id)=>T.users.findOne(u=>u.id===+id),
  getUserByLogin:(login)=>T.users.findOne(u=>u.email===login||u.username===login),
  createUser:(data)=>T.users.insert(data),
  updateUser:(id,changes)=>{T.users.update(u=>u.id===+id,changes);return T.users.findOne(u=>u.id===+id);},
  getOnlineUsers:()=>T.users.findAll(u=>u.online),
  getAllUsers:(search)=>search?T.users.findAll(u=>!u.is_bot&&u.username.toLowerCase().includes(search.toLowerCase())):T.users.findAll(u=>!u.is_bot),
  // Posts
  getPosts:(tab,userId,game)=>{
    if(tab==='following'&&userId){
      const ids=T.follows.findAll(f=>f.follower_id===+userId).map(f=>f.following_id);
      const p=T.posts.findAll(x=>ids.includes(x.user_id)).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,30);
      return p.map(x=>formatPost(x,userId));
    }
    if(tab==='hot'){
      const hotScore=x=>((x.reactions_gg||0)+(x.reactions_fire||0)+(x.reactions_epic||0)+(x.reactions_king||0)+(x.comments_count||0)*2+(x.reposts_count||0)*2)||0;
      const p=T.posts.findAll().sort((a,b)=>hotScore(b)-hotScore(a)).slice(0,30);
      return p.map(x=>formatPost(x,userId));
    }
    if(game){
      const p=T.posts.findAll(x=>x.game===game).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,30);
      return p.map(x=>formatPost(x,userId));
    }
    // For-you: scored feed — following boost + recency + engagement
    const followedIds=userId?T.follows.findAll(f=>f.follower_id===+userId).map(f=>f.following_id):[];
    const now=Date.now();
    const scored=T.posts.findAll().map(p=>{
      const rawHours=(now-new Date(p.created_at).getTime())/(1000*60*60);
      const hoursOld=Number.isFinite(rawHours)?Math.max(0,rawHours):72;
      const recency=Math.max(0,72-hoursOld)/72*50;
      const engagement=((p.reactions_gg||0)+(p.reactions_fire||0)+(p.reactions_rekt||0)+(p.reactions_king||0)+(p.reactions_epic||0)+(p.reactions_lul||0)+(p.comments_count||0)*2+(p.reposts_count||0)*2)*0.5;
      const followBoost=followedIds.includes(p.user_id)?30:0;
      const score=recency+engagement+followBoost;
      return{post:p,score:Number.isFinite(score)?score:0};
    });
    return scored.sort((a,b)=>b.score-a.score).slice(0,30).map(x=>formatPost(x.post,userId));
  },
  getUserPosts:(uid,viewerId)=>T.posts.findAll(p=>p.user_id===+uid).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).map(p=>formatPost(p,viewerId)),
  getPost:(id)=>T.posts.findOne(p=>p.id===+id),
  createPost:(data)=>{const p=T.posts.insert({...data,has_poll:data.has_poll||false});return formatPost(p,data.user_id);},
  deletePost:(id)=>T.posts.delete(p=>p.id===+id),
  updatePost:(id,changes)=>{T.posts.update(p=>p.id===+id,changes);return T.posts.findOne(p=>p.id===+id);},
  // Reactions
  react:(userId,postId,type)=>{const existing=T.post_reactions.findOne(r=>r.user_id===+userId&&r.post_id===+postId);if(existing&&existing.reaction_type===type){T.post_reactions.delete(r=>r.user_id===+userId&&r.post_id===+postId);const col='reactions_'+type;const p=T.posts.findOne(x=>x.id===+postId);if(p)T.posts.update(x=>x.id===+postId,{[col]:Math.max(0,(p[col]||0)-1)});return'removed';}if(existing){const col='reactions_'+existing.reaction_type;const p=T.posts.findOne(x=>x.id===+postId);if(p)T.posts.update(x=>x.id===+postId,{[col]:Math.max(0,(p[col]||0)-1)});T.post_reactions.delete(r=>r.user_id===+userId&&r.post_id===+postId);}T.post_reactions.insert({user_id:+userId,post_id:+postId,reaction_type:type});const col2='reactions_'+type;const p2=T.posts.findOne(x=>x.id===+postId);if(p2)T.posts.update(x=>x.id===+postId,{[col2]:(p2[col2]||0)+1});return'added';},
  // Reposts
  repost:(userId,postId)=>{const ex=T.post_reposts.findOne(r=>r.user_id===+userId&&r.post_id===+postId);const p=T.posts.findOne(x=>x.id===+postId);if(ex){T.post_reposts.delete(r=>r.user_id===+userId&&r.post_id===+postId);if(p)T.posts.update(x=>x.id===+postId,{reposts_count:Math.max(0,(p.reposts_count||0)-1)});return{action:'removed',reposts:(p?.reposts_count||1)-1};}T.post_reposts.insert({user_id:+userId,post_id:+postId});if(p)T.posts.update(x=>x.id===+postId,{reposts_count:(p.reposts_count||0)+1});return{action:'added',reposts:(p?.reposts_count||0)+1};},
  // Comments
  getComments:(postId)=>T.comments.findAll(c=>c.post_id===+postId).sort((a,b)=>new Date(a.created_at)-new Date(b.created_at)).map(c=>{const u=T.users.findOne(x=>x.id===c.user_id);return{...c,username:u?.username,handle:u?.handle||u?.username,avatar:u?.avatar,gradient:u?.gradient,rank:u?.rank,verified:u?.verified||false,plan:u?.plan||'free',time:timeAgo(c.created_at),likes:c.likes||0,aiHighlighted:c.user_id===999};}),
  addComment:(data)=>{const c=T.comments.insert(data);if(!data.parent_id){const post=T.posts.findOne(p=>p.id===+data.post_id);if(post)T.posts.update(p=>p.id===+data.post_id,{comments_count:(post.comments_count||0)+1});}const u=T.users.findOne(x=>x.id===c.user_id);return{...c,username:u?.username,handle:u?.handle||u?.username,avatar:u?.avatar,gradient:u?.gradient,rank:u?.rank,verified:u?.verified||false,plan:u?.plan||'free',time:'just now',likes:0,aiHighlighted:c.user_id===999};},
  getUserComments:(userId)=>{const commenter=T.users.findOne(u=>u.id===+userId);return T.comments.findAll(c=>c.user_id===+userId).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,50).map(c=>{const p=T.posts.findOne(x=>x.id===c.post_id);const author=p?T.users.findOne(x=>x.id===p.user_id):null;return{...c,username:commenter?.username,handle:commenter?.handle||commenter?.username,avatar:commenter?.avatar,avatar_url:commenter?.avatar_url,gradient:commenter?.gradient,plan:commenter?.plan||'free',time:timeAgo(c.created_at),post_body:p?.body||'',post_author:author?.username||'Unknown'};});},
  // Follows
  follow:(ferId,ingId)=>{if(T.follows.findOne(f=>f.follower_id===+ferId&&f.following_id===+ingId)){T.follows.delete(f=>f.follower_id===+ferId&&f.following_id===+ingId);return{action:'unfollowed',followers:T.follows.count(f=>f.following_id===+ingId)};}T.follows.insert({follower_id:+ferId,following_id:+ingId});return{action:'followed',followers:T.follows.count(f=>f.following_id===+ingId)};},
  // Messages
  getConversations:(userId)=>{const msgs=T.messages.findAll(m=>m.sender_id===+userId||m.receiver_id===+userId);const ids=[...new Set(msgs.map(m=>m.sender_id===+userId?m.receiver_id:m.sender_id))];return ids.map(oid=>{const thread=msgs.filter(m=>(m.sender_id===+userId&&m.receiver_id===oid)||(m.sender_id===oid&&m.receiver_id===+userId));const last=thread.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))[0];const unread=thread.filter(m=>m.sender_id===oid&&m.receiver_id===+userId&&!m.read).length;const user=safeUser(T.users.findOne(u=>u.id===oid),userId);return{other_id:oid,last_msg:last?.text||'',last_time:last?.created_at||'',unread,user,time:timeAgo(last?.created_at||new Date())};}).sort((a,b)=>new Date(b.last_time)-new Date(a.last_time));},
  getMessages:(uid1,uid2)=>T.messages.findAll(m=>(m.sender_id===+uid1&&m.receiver_id===+uid2)||(m.sender_id===+uid2&&m.receiver_id===+uid1)).sort((a,b)=>new Date(a.created_at)-new Date(b.created_at)).map(m=>{const u=T.users.findOne(x=>x.id===m.sender_id);return{...m,mine:m.sender_id===+uid1,username:u?.username,avatar:u?.avatar,gradient:u?.gradient,time:timeAgo(m.created_at)};}),
  sendMessage:(sid,rid,text)=>T.messages.insert({sender_id:+sid,receiver_id:+rid,text,read:0}),
  markRead:(sid,rid)=>T.messages.update(m=>m.sender_id===+sid&&m.receiver_id===+rid,{read:1}),
  unreadMsgCount:(uid)=>T.messages.count(m=>m.receiver_id===+uid&&!m.read),
  // LFG
  getLFG:(game,region)=>{const planRank={pro:2,plus:1,free:0};let p=T.lfg_posts.findAll();if(game)p=p.filter(x=>x.game===game);if(region)p=p.filter(x=>x.region===region);p.sort((a,b)=>{const ua=T.users.findOne(u=>u.id===a.user_id);const ub=T.users.findOne(u=>u.id===b.user_id);const ra=planRank[(ua?.plan)||'free']||0;const rb=planRank[(ub?.plan)||'free']||0;if(rb!==ra)return rb-ra;return new Date(b.created_at)-new Date(a.created_at);});return p;},
  createLFG:(data)=>T.lfg_posts.insert(data),
  getLFGPost:(id)=>T.lfg_posts.findOne(p=>p.id===+id),
  joinLFG:(lfgId,userId)=>{if(T.lfg_members.findOne(m=>m.lfg_id===+lfgId&&m.user_id===+userId)){T.lfg_members.delete(m=>m.lfg_id===+lfgId&&m.user_id===+userId);return'left';}T.lfg_members.insert({lfg_id:+lfgId,user_id:+userId});return'joined';},
  // Notifications
  getNotifs:(uid)=>T.notifications.findAll(n=>n.user_id===+uid).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,50).map(n=>({...n,unread:!n.read,time:timeAgo(n.created_at)})),
  addNotif:(data)=>T.notifications.insert(data),
  readAllNotifs:(uid)=>T.notifications.update(n=>n.user_id===+uid,{read:1}),
  readNotif:(id)=>T.notifications.update(n=>n.id===+id,{read:1}),
  unreadNotifCount:(uid)=>T.notifications.count(n=>n.user_id===+uid&&!n.read),
  // Game follows
  getGameFollows:(uid)=>T.game_follows.findAll(f=>f.user_id===+uid).map(f=>f.game_name),
  toggleGameFollow:(uid,game)=>{if(T.game_follows.findOne(f=>f.user_id===+uid&&f.game_name===game)){T.game_follows.delete(f=>f.user_id===+uid&&f.game_name===game);return'unfollowed';}T.game_follows.insert({user_id:+uid,game_name:game});return'followed';},
  // Stories (24h expiry)
  createStory:(data)=>{const expires=new Date(Date.now()+24*60*60*1000).toISOString();return T.stories.insert({...data,expires_at:expires});},
  getStoriesGrouped:(viewerId)=>{
    const now=new Date().toISOString();
    T.stories.delete(s=>s.expires_at<now);
    const stories=T.stories.findAll().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));
    // Only show stories from followed users + own stories
    const followedIds=viewerId?T.follows.findAll(f=>f.follower_id===+viewerId).map(f=>f.following_id):[];
    const byUser={};
    stories.forEach(s=>{
      const isOwn=viewerId&&s.user_id===+viewerId;
      const isFollowed=followedIds.includes(s.user_id);
      if(!isOwn&&!isFollowed)return;
      if(!byUser[s.user_id])byUser[s.user_id]={user:safeUser(T.users.findOne(u=>u.id===s.user_id),viewerId),stories:[]};
      const viewed=viewerId?!!T.story_views.findOne(v=>v.story_id===s.id&&v.viewer_id===+viewerId):false;
      byUser[s.user_id].stories.push({...s,viewed});
    });
    const groups=Object.values(byUser).filter(g=>g.user);
    // Order: own first, then unwatched, then watched
    const me=+viewerId;
    groups.sort((a,b)=>{
      if(a.user.id===me)return-1;if(b.user.id===me)return 1;
      const aUnwatched=a.stories.some(s=>!s.viewed);
      const bUnwatched=b.stories.some(s=>!s.viewed);
      if(aUnwatched&&!bUnwatched)return-1;if(!aUnwatched&&bUnwatched)return 1;
      return 0;
    });
    return groups;
  },
  getStories:()=>{const now=new Date().toISOString();T.stories.delete(s=>s.expires_at<now);return T.stories.findAll().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));},
  getUserStories:(uid)=>{const now=new Date().toISOString();return T.stories.findAll(s=>s.user_id===+uid&&s.expires_at>now).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));},
  deleteStory:(id,uid)=>T.stories.delete(s=>s.id===+id&&s.user_id===+uid),
  addStoryView:(storyId,viewerId)=>{if(!T.story_views.findOne(v=>v.story_id===+storyId&&v.viewer_id===+viewerId)){T.story_views.insert({story_id:+storyId,viewer_id:+viewerId});}},
  getStoryViewCount:(storyId)=>T.story_views.count(v=>v.story_id===+storyId),
  // Games (IGDB/Twitch live data)
  upsertGame:(data)=>{const ex=T.games.findOne(g=>g.igdb_id===data.igdb_id);if(ex){T.games.update(g=>g.igdb_id===data.igdb_id,{...data,updated_at:new Date().toISOString()});return T.games.findOne(g=>g.igdb_id===data.igdb_id);}return T.games.insert({...data,updated_at:new Date().toISOString()});},
  getTrendingGames:(limit=20)=>T.games.findAll().sort((a,b)=>(b.trending_score||0)-(a.trending_score||0)).slice(0,limit),
  searchGames:(q)=>{const lq=q.toLowerCase();return T.games.findAll(g=>g.name.toLowerCase().includes(lq)).slice(0,10);},
  getGame:(igdbId)=>T.games.findOne(g=>g.igdb_id===+igdbId||g.id===+igdbId),
  clearGames:()=>{T.games.data=[];T.games._save();},
  // Leaderboard
  getLeaderboard:()=>T.users.findAll(u=>!u.is_bot).map(u=>{const posts=T.posts.findAll(p=>p.user_id===u.id);const reactions=posts.reduce((s,p)=>s+(p.reactions_gg||0)+(p.reactions_fire||0)+(p.reactions_epic||0)+(p.reactions_king||0)+(p.reactions_rekt||0)+(p.reactions_lul||0),0);const views=posts.reduce((s,p)=>s+(p.views||0),0);const score=reactions+Math.floor(views/10);return{...u,post_count:posts.length,score,total_reactions:reactions,total_views:views};}).sort((a,b)=>b.score-a.score).slice(0,20).map((u,i)=>{const{password_hash,...s}=u;return{...s,rank_position:i+1};}),
  // Bookmarks
  toggleBookmark(userId, postId) {
    const existing = T.bookmarks.findOne(b => b.user_id === +userId && b.post_id === +postId);
    if (existing) { T.bookmarks.delete(b => b.id === existing.id); return 'removed'; }
    T.bookmarks.insert({ user_id: +userId, post_id: +postId, created_at: new Date().toISOString() });
    return 'added';
  },
  getBookmarks(userId) {
    const bms = T.bookmarks.findAll(b => b.user_id === +userId).sort((a,b) => b.id - a.id);
    return bms.map(b => this.formatPost(b.post_id, +userId)).filter(Boolean);
  },
  isBookmarked(userId, postId) {
    return !!T.bookmarks.findOne(b => b.user_id === +userId && b.post_id === +postId);
  },
  // Polls
  createPollOptions(postId, options) {
    return options.map(text => T.poll_options.insert({ post_id: +postId, text, votes: 0 }));
  },
  getPollData(postId, userId) {
    const options = T.poll_options.findAll(o => o.post_id === +postId);
    if (!options.length) return null;
    const totalVotes = options.reduce((s, o) => s + (o.votes || 0), 0);
    const userVote = userId ? T.poll_votes.findOne(v => v.post_id === +postId && v.user_id === +userId) : null;
    return { options: options.map(o => ({ ...o, pct: totalVotes ? Math.round((o.votes/totalVotes)*100) : 0 })), totalVotes, userVoteId: userVote?.option_id || null };
  },
  votePoll(postId, userId, optionId) {
    const existing = T.poll_votes.findOne(v => v.post_id === +postId && v.user_id === +userId);
    if (existing) return { error: 'Already voted' };
    const option = T.poll_options.findOne(o => o.id === +optionId && o.post_id === +postId);
    if (!option) return { error: 'Invalid option' };
    T.poll_votes.insert({ post_id: +postId, user_id: +userId, option_id: +optionId });
    T.poll_options.update(o => o.id === +optionId, { votes: (option.votes || 0) + 1 });
    return this.getPollData(postId, userId);
  },
  // Clans
  createClan({ owner_id, name, tag, description, game, banner_color }) {
    const exists = T.clans.findOne(c => c.tag.toLowerCase() === tag.toLowerCase());
    if (exists) return { error: 'Tag taken' };
    const clan = T.clans.insert({ owner_id: +owner_id, name, tag: tag.toUpperCase().slice(0,4), description: description||'', game: game||null, banner_color: banner_color||'#6c63ff', member_count: 1, created_at: new Date().toISOString() });
    T.clan_members.insert({ clan_id: clan.id, user_id: +owner_id, role: 'owner', joined_at: new Date().toISOString() });
    return clan;
  },
  getClan(id) {
    return T.clans.findOne(c => c.id === +id);
  },
  getClanByTag(tag) {
    return T.clans.findOne(c => c.tag.toLowerCase() === tag.toLowerCase());
  },
  getUserClans(userId) {
    const memberships = T.clan_members.findAll(m => m.user_id === +userId);
    return memberships.map(m => ({ ...T.clans.findOne(c => c.id === m.clan_id), role: m.role })).filter(c => c.id);
  },
  getClanMembers(clanId) {
    const members = T.clan_members.findAll(m => m.clan_id === +clanId);
    return members.map(m => { const u = this.safeUser(T.users.findOne(u => u.id === m.user_id)); return u ? { ...u, role: m.role, joined_at: m.joined_at } : null; }).filter(Boolean);
  },
  isClanMember(clanId, userId) {
    return !!T.clan_members.findOne(m => m.clan_id === +clanId && m.user_id === +userId);
  },
  joinClanById(clanId, userId) {
    if (this.isClanMember(clanId, userId)) return { error: 'Already a member' };
    T.clan_members.insert({ clan_id: +clanId, user_id: +userId, role: 'member', joined_at: new Date().toISOString() });
    const clan = T.clans.findOne(c => c.id === +clanId);
    if (clan) T.clans.update(c => c.id === +clanId, { member_count: (clan.member_count || 0) + 1 });
    return { success: true };
  },
  leaveClan(clanId, userId) {
    const clan = T.clans.findOne(c => c.id === +clanId);
    if (!clan) return { error: 'Not found' };
    if (clan.owner_id === +userId) return { error: 'Owner cannot leave, delete instead' };
    T.clan_members.delete(m => m.clan_id === +clanId && m.user_id === +userId);
    T.clans.update(c => c.id === +clanId, { member_count: Math.max(0, (clan.member_count || 1) - 1) });
    return { success: true };
  },
  deleteClan(clanId, userId) {
    const clan = T.clans.findOne(c => c.id === +clanId);
    if (!clan) return { error: 'Not found' };
    if (clan.owner_id !== +userId) return { error: 'Not owner' };
    T.clan_members.delete(m => m.clan_id === +clanId);
    T.clans.delete(c => c.id === +clanId);
    return { success: true };
  },
  searchClans(query) {
    const q = (query||'').toLowerCase();
    if (!q) return T.clans.findAll(() => true).slice(0, 20);
    return T.clans.findAll(c => c.name.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q) || (c.game||'').toLowerCase().includes(q)).slice(0, 20);
  },
  getClanFeed(clanId, viewerId) {
    const members = T.clan_members.findAll(m => m.clan_id === +clanId).map(m => m.user_id);
    const posts = T.posts.findAll(p => members.includes(p.user_id)).sort((a,b) => b.id - a.id).slice(0, 30);
    return posts.map(p => this.formatPost(p.id, viewerId)).filter(Boolean);
  },
  // Trending Hashtags + Search
  getTrendingHashtags() {
    const recent = T.posts.findAll(() => true).sort((a,b) => b.id - a.id).slice(0, 200);
    const counts = {};
    recent.forEach(p => { const tags = (p.body||'').match(/#(\w+)/g) || []; tags.forEach(t => { const key = t.toLowerCase(); counts[key] = (counts[key]||0) + 1; }); });
    return Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,15).map(([tag, count]) => ({ tag, count }));
  },
  getPostsByHashtag(hashtag, viewerId) {
    const tag = hashtag.startsWith('#') ? hashtag : '#'+hashtag;
    const re = new RegExp(tag.replace('#','#')+'\\b', 'i');
    const posts = T.posts.findAll(p => re.test(p.body||'')).sort((a,b) => b.id - a.id).slice(0,30);
    return posts.map(p => this.formatPost(p.id, viewerId)).filter(Boolean);
  },
  fullSearch(query, viewerId) {
    if (!query) return { posts: [], users: [], games: [] };
    const q = query.toLowerCase();
    const posts = T.posts.findAll(p => (p.body||'').toLowerCase().includes(q)).sort((a,b) => b.id-a.id).slice(0,10).map(p => this.formatPost(p.id, viewerId)).filter(Boolean);
    const users = T.users.findAll(u => !u.is_bot && ((u.username||'').toLowerCase().includes(q) || (u.handle||'').toLowerCase().includes(q))).slice(0,10).map(u => this.safeUser(u));
    const games = T.games ? T.games.findAll(g => (g.name||'').toLowerCase().includes(q)).slice(0,10) : [];
    return { posts, users, games };
  },
  // Daily Challenges
  getDailyChallenges(userId) {
    const allChallenges = [
      { id: 1, type: 'post', title: 'Make a Post', desc: 'Share something with the community', xp: 50, target: 1, icon: '📝' },
      { id: 2, type: 'react', title: 'React to 5 Posts', desc: 'Spread the love with reactions', xp: 30, target: 5, icon: '🎮' },
      { id: 3, type: 'comment', title: 'Comment on 3 Posts', desc: 'Join the conversation', xp: 40, target: 3, icon: '💬' },
      { id: 4, type: 'follow', title: 'Follow a Gamer', desc: 'Grow your network', xp: 20, target: 1, icon: '👥' },
      { id: 5, type: 'post', title: 'Post a Clip', desc: 'Share your best gameplay moment', xp: 75, target: 1, icon: '🎬' },
      { id: 6, type: 'react', title: 'React to 10 Posts', desc: 'Be the hype squad', xp: 60, target: 10, icon: '🔥' },
      { id: 7, type: 'comment', title: 'Comment on 5 Posts', desc: 'Be a community pillar', xp: 75, target: 5, icon: '🏆' },
      { id: 8, type: 'post', title: 'Post 3 Times', desc: 'Stay active today', xp: 100, target: 3, icon: '⚡' },
      { id: 9, type: 'follow', title: 'Follow 3 Gamers', desc: 'Expand your crew', xp: 50, target: 3, icon: '🎯' },
      { id: 10, type: 'react', title: 'Try All Reactions', desc: 'Use every reaction type', xp: 80, target: 6, icon: '👑' },
    ];
    const today = new Date().toISOString().slice(0,10);
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(),0,0)) / 86400000);
    const selected = [allChallenges[dayOfYear % 10], allChallenges[(dayOfYear+3) % 10], allChallenges[(dayOfYear+7) % 10]];
    return selected.map(ch => {
      const prog = userId ? T.user_challenges.findOne(uc => uc.user_id === +userId && uc.challenge_id === ch.id && uc.date === today) : null;
      return { ...ch, progress: prog?.progress || 0, completed: prog?.completed || false, claimed: prog?.claimed || false };
    });
  },
  updateChallengeProgress(userId, type) {
    if (!userId) return;
    const today = new Date().toISOString().slice(0,10);
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(),0,0)) / 86400000);
    const allChallenges = [
      { id: 1, type: 'post', target: 1 }, { id: 2, type: 'react', target: 5 }, { id: 3, type: 'comment', target: 3 },
      { id: 4, type: 'follow', target: 1 }, { id: 5, type: 'post', target: 1 }, { id: 6, type: 'react', target: 10 },
      { id: 7, type: 'comment', target: 5 }, { id: 8, type: 'post', target: 3 }, { id: 9, type: 'follow', target: 3 },
      { id: 10, type: 'react', target: 6 },
    ];
    const todayChallenges = [allChallenges[dayOfYear % 10], allChallenges[(dayOfYear+3) % 10], allChallenges[(dayOfYear+7) % 10]];
    todayChallenges.filter(ch => ch.type === type).forEach(ch => {
      const existing = T.user_challenges.findOne(uc => uc.user_id === +userId && uc.challenge_id === ch.id && uc.date === today);
      if (existing && existing.completed) return;
      if (existing) {
        const newProg = (existing.progress || 0) + 1;
        T.user_challenges.update(uc => uc.id === existing.id, { progress: newProg, completed: newProg >= ch.target });
      } else {
        T.user_challenges.insert({ user_id: +userId, challenge_id: ch.id, date: today, progress: 1, completed: 1 >= ch.target, claimed: false });
      }
    });
  },
  claimChallengeXP(userId, challengeId) {
    const today = new Date().toISOString().slice(0,10);
    const rec = T.user_challenges.findOne(uc => uc.user_id === +userId && uc.challenge_id === +challengeId && uc.date === today);
    if (!rec || !rec.completed || rec.claimed) return { error: 'Cannot claim' };
    const allChallenges = [
      { id: 1, xp: 50 }, { id: 2, xp: 30 }, { id: 3, xp: 40 }, { id: 4, xp: 20 }, { id: 5, xp: 75 },
      { id: 6, xp: 60 }, { id: 7, xp: 75 }, { id: 8, xp: 100 }, { id: 9, xp: 50 }, { id: 10, xp: 80 },
    ];
    const ch = allChallenges.find(c => c.id === +challengeId);
    const xp = ch?.xp || 0;
    T.user_challenges.update(uc => uc.id === rec.id, { claimed: true });
    const user = T.users.findOne(u => u.id === +userId);
    T.users.update(u => u.id === +userId, { xp: (user?.xp || 0) + xp });
    return { xp, totalXp: (user?.xp || 0) + xp };
  },
};

module.exports = db;
