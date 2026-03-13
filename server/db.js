/**
 * NEXUS GG — Pure JavaScript JSON Database
 * No native compilation required. Works on any Node.js version.
 */

const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

// ================================================================
// JSON FILE STORE — synchronous, like SQLite but pure JS
// ================================================================

class Table {
  constructor(name) {
    this.file = path.join(DATA_DIR, `${name}.json`);
    this.data = this._load();
  }
  _load() { try { return JSON.parse(fs.readFileSync(this.file, 'utf8')); } catch { return []; } }
  _save() { fs.writeFileSync(this.file, JSON.stringify(this.data, null, 2)); }
  nextId() { return this.data.length ? Math.max(...this.data.map(r => r.id || 0)) + 1 : 1; }
  insert(record) { const row = { id: this.nextId(), created_at: new Date().toISOString(), ...record }; this.data.push(row); this._save(); return row; }
  findAll(predicate) { return predicate ? this.data.filter(predicate) : [...this.data]; }
  findOne(predicate) { return this.data.find(predicate) || null; }
  update(predicate, changes) { let n=0; this.data=this.data.map(r=>{if(predicate(r)){n++;return{...r,...changes};}return r;}); this._save(); return n; }
  delete(predicate) { const b=this.data.length; this.data=this.data.filter(r=>!predicate(r)); this._save(); return b-this.data.length; }
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
};

// ================================================================
// SEED DATA
// ================================================================

// ================================================================
// DB API
// ================================================================
function timeAgo(d){const diff=Date.now()-new Date(d).getTime(),s=Math.floor(diff/1000),m=Math.floor(s/60),h=Math.floor(m/60),dy=Math.floor(h/24);if(dy>0)return dy+'d ago';if(h>0)return h+'h ago';if(m>0)return m+'m ago';return'just now';}
function safeUser(u,viewerId){if(!u)return null;const{password_hash,...s}=u;s.followers=T.follows.count(f=>f.following_id===u.id);s.following=T.follows.count(f=>f.follower_id===u.id);s.posts_count=T.posts.count(p=>p.user_id===u.id);s.isFollowing=viewerId?!!T.follows.findOne(f=>f.follower_id===+viewerId&&f.following_id===u.id):false;s.verified=!!u.verified;return s;}
function formatPost(p,viewerId){const user=safeUser(T.users.findOne(u=>u.id===p.user_id),viewerId);const myReaction=viewerId?T.post_reactions.findOne(r=>r.user_id===+viewerId&&r.post_id===p.id):null;const reposted=viewerId?!!T.post_reposts.findOne(r=>r.user_id===+viewerId&&r.post_id===p.id):false;let quotedPost=null;if(p.quoted_post_id){const qp=T.posts.findOne(x=>x.id===+p.quoted_post_id);if(qp){const qu=safeUser(T.users.findOne(u=>u.id===qp.user_id),viewerId);quotedPost={id:qp.id,body:qp.body,user:qu,time:timeAgo(qp.created_at)};}}return{...p,user,myReaction:myReaction?.reaction_type||null,reposted,reactions:{gg:p.reactions_gg||0,fire:p.reactions_fire||0,rekt:p.reactions_rekt||0,king:p.reactions_king||0,epic:p.reactions_epic||0,lul:p.reactions_lul||0},achievement:p.achievement_title?{title:p.achievement_title,game:p.achievement_game,icon:p.achievement_icon}:null,clip:p.clip_title?{title:p.clip_title,desc:p.clip_desc}:null,quotedPost,time:timeAgo(p.created_at),views:p.views?String(p.views):'0'};}
function formatLFG(l,viewerId){const user=safeUser(T.users.findOne(u=>u.id===l.user_id),viewerId);const members=T.lfg_members.findAll(m=>m.lfg_id===l.id).map(m=>safeUser(T.users.findOne(u=>u.id===m.user_id),viewerId)).filter(Boolean);const filled=members.length+1;const isMember=viewerId?!!T.lfg_members.findOne(m=>m.lfg_id===l.id&&m.user_id===+viewerId):false;const isHost=viewerId&&l.user_id===+viewerId;let status='open';if(filled>=l.slots)status='full';else if(filled>=l.slots-1)status='filling';return{...l,user,members,filled,status,isMember,isHost,time:timeAgo(l.created_at)};}

const db = {
  T, safeUser, formatPost, formatLFG, timeAgo,
  // Users
  getUser:(id)=>T.users.findOne(u=>u.id===+id),
  getUserByLogin:(login)=>T.users.findOne(u=>u.email===login||u.username===login),
  createUser:(data)=>T.users.insert(data),
  updateUser:(id,changes)=>{T.users.update(u=>u.id===+id,changes);return T.users.findOne(u=>u.id===+id);},
  getOnlineUsers:()=>T.users.findAll(u=>u.online),
  getAllUsers:(search)=>search?T.users.findAll(u=>u.username.toLowerCase().includes(search.toLowerCase())):T.users.findAll(),
  // Posts
  getPosts:(tab,userId,game)=>{let p;if(tab==='following'&&userId){const ids=T.follows.findAll(f=>f.follower_id===+userId).map(f=>f.following_id);p=T.posts.findAll(x=>ids.includes(x.user_id));}else if(tab==='hot'){p=T.posts.findAll().sort((a,b)=>(b.reactions_gg+b.reactions_fire+b.reactions_epic+b.reactions_king)-(a.reactions_gg+a.reactions_fire+a.reactions_epic+a.reactions_king)).slice(0,30);return p.map(x=>formatPost(x,userId));}else if(game){p=T.posts.findAll(x=>x.game===game);}else{p=T.posts.findAll();}return p.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).slice(0,30).map(x=>formatPost(x,userId));},
  getUserPosts:(uid,viewerId)=>T.posts.findAll(p=>p.user_id===+uid).sort((a,b)=>new Date(b.created_at)-new Date(a.created_at)).map(p=>formatPost(p,viewerId)),
  getPost:(id)=>T.posts.findOne(p=>p.id===+id),
  createPost:(data)=>{const p=T.posts.insert(data);return formatPost(p,data.user_id);},
  deletePost:(id)=>T.posts.delete(p=>p.id===+id),
  updatePost:(id,changes)=>{T.posts.update(p=>p.id===+id,changes);return T.posts.findOne(p=>p.id===+id);},
  // Reactions
  react:(userId,postId,type)=>{const existing=T.post_reactions.findOne(r=>r.user_id===+userId&&r.post_id===+postId);if(existing&&existing.reaction_type===type){T.post_reactions.delete(r=>r.user_id===+userId&&r.post_id===+postId);const col='reactions_'+type;const p=T.posts.findOne(x=>x.id===+postId);if(p)T.posts.update(x=>x.id===+postId,{[col]:Math.max(0,(p[col]||0)-1)});return'removed';}if(existing){const col='reactions_'+existing.reaction_type;const p=T.posts.findOne(x=>x.id===+postId);if(p)T.posts.update(x=>x.id===+postId,{[col]:Math.max(0,(p[col]||0)-1)});T.post_reactions.delete(r=>r.user_id===+userId&&r.post_id===+postId);}T.post_reactions.insert({user_id:+userId,post_id:+postId,reaction_type:type});const col2='reactions_'+type;const p2=T.posts.findOne(x=>x.id===+postId);if(p2)T.posts.update(x=>x.id===+postId,{[col2]:(p2[col2]||0)+1});return'added';},
  // Reposts
  repost:(userId,postId)=>{const ex=T.post_reposts.findOne(r=>r.user_id===+userId&&r.post_id===+postId);const p=T.posts.findOne(x=>x.id===+postId);if(ex){T.post_reposts.delete(r=>r.user_id===+userId&&r.post_id===+postId);if(p)T.posts.update(x=>x.id===+postId,{reposts_count:Math.max(0,(p.reposts_count||0)-1)});return{action:'removed',reposts:(p?.reposts_count||1)-1};}T.post_reposts.insert({user_id:+userId,post_id:+postId});if(p)T.posts.update(x=>x.id===+postId,{reposts_count:(p.reposts_count||0)+1});return{action:'added',reposts:(p?.reposts_count||0)+1};},
  // Comments
  getComments:(postId)=>T.comments.findAll(c=>c.post_id===+postId).sort((a,b)=>new Date(a.created_at)-new Date(b.created_at)).map(c=>{const u=T.users.findOne(x=>x.id===c.user_id);return{...c,username:u?.username,avatar:u?.avatar,gradient:u?.gradient,rank:u?.rank,time:timeAgo(c.created_at)};}),
  addComment:(data)=>{const c=T.comments.insert(data);T.posts.update(p=>p.id===+data.post_id,p=>{return{...p,comments_count:(p.comments_count||0)+1};});const u=T.users.findOne(x=>x.id===c.user_id);return{...c,username:u?.username,avatar:u?.avatar,gradient:u?.gradient,rank:u?.rank,time:'just now'};},
  // Follows
  follow:(ferId,ingId)=>{if(T.follows.findOne(f=>f.follower_id===+ferId&&f.following_id===+ingId)){T.follows.delete(f=>f.follower_id===+ferId&&f.following_id===+ingId);return{action:'unfollowed',followers:T.follows.count(f=>f.following_id===+ingId)};}T.follows.insert({follower_id:+ferId,following_id:+ingId});return{action:'followed',followers:T.follows.count(f=>f.following_id===+ingId)};},
  // Messages
  getConversations:(userId)=>{const msgs=T.messages.findAll(m=>m.sender_id===+userId||m.receiver_id===+userId);const ids=[...new Set(msgs.map(m=>m.sender_id===+userId?m.receiver_id:m.sender_id))];return ids.map(oid=>{const thread=msgs.filter(m=>(m.sender_id===+userId&&m.receiver_id===oid)||(m.sender_id===oid&&m.receiver_id===+userId));const last=thread.sort((a,b)=>new Date(b.created_at)-new Date(a.created_at))[0];const unread=thread.filter(m=>m.sender_id===oid&&m.receiver_id===+userId&&!m.read).length;const user=safeUser(T.users.findOne(u=>u.id===oid),userId);return{other_id:oid,last_msg:last?.text||'',last_time:last?.created_at||'',unread,user,time:timeAgo(last?.created_at||new Date())};}).sort((a,b)=>new Date(b.last_time)-new Date(a.last_time));},
  getMessages:(uid1,uid2)=>T.messages.findAll(m=>(m.sender_id===+uid1&&m.receiver_id===+uid2)||(m.sender_id===+uid2&&m.receiver_id===+uid1)).sort((a,b)=>new Date(a.created_at)-new Date(b.created_at)).map(m=>{const u=T.users.findOne(x=>x.id===m.sender_id);return{...m,mine:m.sender_id===+uid1,username:u?.username,avatar:u?.avatar,gradient:u?.gradient,time:timeAgo(m.created_at)};}),
  sendMessage:(sid,rid,text)=>T.messages.insert({sender_id:+sid,receiver_id:+rid,text,read:0}),
  markRead:(sid,rid)=>T.messages.update(m=>m.sender_id===+sid&&m.receiver_id===+rid,{read:1}),
  unreadMsgCount:(uid)=>T.messages.count(m=>m.receiver_id===+uid&&!m.read),
  // LFG
  getLFG:(game,region)=>{let p=T.lfg_posts.findAll().sort((a,b)=>new Date(b.created_at)-new Date(a.created_at));if(game)p=p.filter(x=>x.game===game);if(region)p=p.filter(x=>x.region===region);return p;},
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
    const byUser={};
    stories.forEach(s=>{
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
  getLeaderboard:()=>T.users.findAll().map(u=>{const posts=T.posts.findAll(p=>p.user_id===u.id);const reactions=posts.reduce((s,p)=>s+(p.reactions_gg||0)+(p.reactions_fire||0)+(p.reactions_epic||0)+(p.reactions_king||0)+(p.reactions_rekt||0)+(p.reactions_lul||0),0);const views=posts.reduce((s,p)=>s+(p.views||0),0);const score=reactions+Math.floor(views/10);return{...u,post_count:posts.length,score,total_reactions:reactions,total_views:views};}).sort((a,b)=>b.score-a.score).slice(0,20).map((u,i)=>{const{password_hash,...s}=u;return{...s,rank_position:i+1};}),
};

module.exports = db;
