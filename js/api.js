/* ================================================================
   DXED — API Client + Auth + Socket.io
   ================================================================ */

const API_BASE = '/api';

// ================================================================
// AUTH STATE
// ================================================================
const Auth = {
  getToken: () => localStorage.getItem('nx_token'),
  setToken: (t) => localStorage.setItem('nx_token', t),
  getUser: () => { try { return JSON.parse(localStorage.getItem('nx_user')); } catch { return null; } },
  setUser: (u) => localStorage.setItem('nx_user', JSON.stringify(u)),
  logout: () => {
    localStorage.removeItem('nx_token');
    localStorage.removeItem('nx_user');
    if (window.SOCKET) window.SOCKET.disconnect();
    window.location.reload();
  },
  isLoggedIn: () => !!localStorage.getItem('nx_token'),
};

// ================================================================
// JWT EXPIRY CHECK
// ================================================================
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 < Date.now();
  } catch { return true; }
}

// ================================================================
// HTTP HELPERS
// ================================================================

// fetchWithAuth: wraps fetch for FormData/file uploads with auth + 401 handling
async function fetchWithAuth(url, opts = {}) {
  const token = Auth.getToken();
  if (!opts.headers) opts.headers = {};
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(url, opts);
  if (res.status === 401) { Auth.logout(); throw new Error('Session expired'); }
  return res;
}

async function apiRequest(method, path, body) {
  // Check token expiry before making request
  const token = Auth.getToken();
  if (token && isTokenExpired(token)) { Auth.logout(); throw new Error('Session expired'); }

  const opts = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (token) opts.headers['Authorization'] = 'Bearer ' + token;
  if (body) opts.body = JSON.stringify(body);

  const res = await fetch(API_BASE + path, opts);

  // Global 401 handling
  if (res.status === 401) { Auth.logout(); throw new Error('Session expired'); }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`);
  return data;
}

const api = {
  get:    (path)         => apiRequest('GET', path),
  post:   (path, body)   => apiRequest('POST', path, body),
  patch:  (path, body)   => apiRequest('PATCH', path, body),
  delete: (path)         => apiRequest('DELETE', path),

  // Auth
  login:    (email, password)  => api.post('/auth/login', { email, password }),
  register: (data)             => api.post('/auth/register', data),
  me:       ()                 => api.get('/auth/me'),

  // Posts
  getFeed:     (tab, game)      => api.get(`/posts?tab=${tab}${game?'&game='+encodeURIComponent(game):''}`),
  getUserPosts:(id)             => api.get(`/posts/user/${id}`),
  createPost:  (data)          => api.post('/posts', data),
  deletePost:  (id)            => api.delete(`/posts/${id}`),
  reactToPost: (id, type)      => api.post(`/posts/${id}/react`, { type }),
  repostPost:  (id)            => api.post(`/posts/${id}/repost`),
  getComments:    (id)              => api.get(`/posts/${id}/comments`),
  addComment:     (id, body, parentId) => api.post(`/posts/${id}/comments`, { body, parent_id: parentId||null }),
  askAIInsight:   (id)              => api.post(`/posts/${id}/ask-claude`),

  // Users
  getUsers:          (search)  => api.get(`/users${search?'?search='+encodeURIComponent(search):''}`),
  getUser:           (id)      => api.get(`/users/${id}`),
  getUserByHandle:   (handle)  => api.get(`/users/by-handle/${encodeURIComponent(handle)}`),
  getOnline:         ()        => api.get('/users/online'),
  updateMe:          (data)    => api.patch('/users/me', data),
  upgradePlan:       (plan)    => api.patch('/users/me/plan', { plan }),
  changePassword:    (data)    => api.post('/users/me/password', data),
  deleteAccount:     ()        => apiRequest('DELETE', '/users/me'),
  followUser:        (id)      => api.post(`/users/${id}/follow`),
  followGame:        (game)    => api.post('/users/game/follow', { game }),
  myGameFollows:     ()        => api.get('/users/game-follows/mine'),
  getFollowers:      (id)      => api.get(`/users/${id}/followers`),
  getFollowing:      (id)      => api.get(`/users/${id}/following`),
  getUserGameFollows:(id)      => api.get(`/users/${id}/game-follows`),
  getUserComments:   (id)      => api.get(`/users/${id}/comments`),
  trackProfileView:  (id)      => api.post(`/users/${id}/profile-view`).catch(() => {}),
  getAnalytics:      (id)      => api.get(`/users/${id}/analytics`),
  uploadAvatar:      (file)    => {
    const form = new FormData();
    form.append('avatar', file);
    return fetchWithAuth(API_BASE + '/users/me/avatar', {
      method: 'POST',
      body: form,
    }).then(r => r.json().then(d => { if (!r.ok) throw new Error(d.error || 'Upload failed'); return d; }));
  },

  // LFG
  getLFG:   (game, region)     => api.get(`/lfg${game?'?game='+encodeURIComponent(game):''}${region?'&region='+region:''}`),
  createLFG:(data)             => api.post('/lfg', data),
  joinLFG:  (id)               => api.post(`/lfg/${id}/join`),
  deleteLFG:(id)               => api.delete(`/lfg/${id}`),

  // Messages
  getConversations: ()         => api.get('/messages/conversations'),
  getMessages: (userId)        => api.get(`/messages/${userId}`),
  sendMessage: (userId, text)  => api.post(`/messages/${userId}`, { text }),
  unreadCounts:()              => api.get('/messages/notifications/count'),

  // Notifications
  getNotifications:()          => api.get('/notifications'),
  readAll:         ()          => api.post('/notifications/read-all'),
  readOne:         (id)        => api.patch(`/notifications/${id}/read`),

  // Leaderboard
  getLeaderboard:(game)        => api.get(`/leaderboard${game?'?game='+encodeURIComponent(game):''}`),

  // Games (live IGDB/Twitch data)
  getTrendingGames:(limit)     => api.get(`/games/trending${limit?'?limit='+limit:''}`),
  searchGamesApi: (q)          => api.get(`/games/search?q=${encodeURIComponent(q)}`),

  // Stories
  getStories: ()               => api.get('/stories'),
  createStory: (file, caption) => {
    const form = new FormData();
    form.append('media', file);
    if (caption) form.append('caption', caption);
    return fetchWithAuth(API_BASE + '/stories', {
      method: 'POST',
      body: form,
    }).then(r => r.json().then(d => { if (!r.ok) throw new Error(d.error || 'Upload failed'); return d; }));
  },
  deleteStory:       (id)      => api.delete(`/stories/${id}`),
  viewStory:         (id)      => api.post(`/stories/${id}/view`),
  getStoryViewCount: (id)      => api.get(`/stories/${id}/views`),

  // Bookmarks
  toggleBookmark: (postId) => apiRequest('POST', `/posts/${postId}/bookmark`),
  getBookmarks: () => apiRequest('GET', '/posts/bookmarks/mine'),

  // Polls
  votePoll: (postId, optionId) => apiRequest('POST', `/posts/${postId}/vote`, { option_id: optionId }),

  // Search
  search: (q, type='all') => apiRequest('GET', `/search?q=${encodeURIComponent(q)}&type=${type}`),

  // Hashtags
  getTrendingHashtags: () => apiRequest('GET', '/hashtags/trending'),
  getPostsByHashtag: (tag) => apiRequest('GET', `/hashtags/posts/${encodeURIComponent(tag)}`),

  // Clans
  getClans: (q='') => apiRequest('GET', `/clans?q=${encodeURIComponent(q)}`),
  getMyClans: () => apiRequest('GET', '/clans/mine'),
  getClan: (id) => apiRequest('GET', `/clans/${id}`),
  getClanMembers: (id) => apiRequest('GET', `/clans/${id}/members`),
  getClanFeed: (id) => apiRequest('GET', `/clans/${id}/feed`),
  createClan: (data) => apiRequest('POST', '/clans', data),
  joinClan: (id) => apiRequest('POST', `/clans/${id}/join`),
  leaveClan: (id) => apiRequest('DELETE', `/clans/${id}/leave`),
  deleteClan: (id) => apiRequest('DELETE', `/clans/${id}`),

  // Challenges
  getChallenges: () => apiRequest('GET', '/users/challenges'),
  claimChallenge: (id) => apiRequest('POST', `/users/challenges/${id}/claim`),

  // Banner
  uploadBanner: (file) => { const fd = new FormData(); fd.append('banner', file); return fetchWithAuth('/api/users/me/banner', { method:'POST', body:fd }).then(r=>r.json()); },

  // Clip upload
  uploadClip: (file) => { const fd = new FormData(); fd.append('clip', file); return fetchWithAuth('/api/posts/upload-clip', { method:'POST', body:fd }).then(r=>r.json()); },
};

// ================================================================
// SOCKET.IO CLIENT
// ================================================================
function initSocket(token) {
  if (typeof io === 'undefined') return;

  // Prevent duplicate socket connections
  if (window.SOCKET) {
    window.SOCKET.disconnect();
    window.SOCKET = null;
  }

  const socket = io({ auth: { token } });
  window.SOCKET = socket;

  const banner = document.getElementById('reconnecting-banner');

  socket.on('connect', () => {
    console.log('🔌 Socket connected');
    if (banner) banner.style.display = 'none';
    if (typeof loadWidgets === 'function') loadWidgets();
  });

  socket.on('disconnect', () => {
    console.log('🔌 Socket disconnected');
    if (banner) banner.style.display = '';
  });

  socket.on('connect_error', (err) => {
    console.warn('🔌 Socket connect error:', err.message);
    if (banner) banner.style.display = '';
    // If auth error, log out
    if (err.message === 'auth_error') {
      Auth.logout();
      return;
    }
  });

  // New post from someone else
  socket.on(EVENTS.POST_NEW, (post) => {
    if (post.user?.id === Auth.getUser()?.id) return;
    if (window.STATE?.currentSection === 'home') {
      const container = document.getElementById('feed-container');
      if (container) {
        const el = document.createElement('div');
        el.innerHTML = window.renderPost ? window.renderPost(post) : '';
        if (el.firstChild) container.prepend(el.firstChild);
      }
    }
    showToast(`${post.user?.username} just posted!`, 'info', '🎮');
  });

  // Real-time comment (e.g. Claude bot reply)
  socket.on(EVENTS.POST_COMMENT, ({ postId, comment }) => {
    // Skip if it's the current user's own comment — already inserted locally by submitComment
    const myId = window.Auth?.getUser()?.id || window.CURRENT_USER?.id;
    if (myId && comment.user_id === +myId) return;

    const list = document.getElementById(`comments-list-${postId}`);
    if (list && typeof window.renderComment === 'function') {
      const empty = list.querySelector('.empty-comments');
      if (empty) empty.remove();
      list.insertAdjacentHTML('beforeend', `<div class="comment-thread-item" id="ci-${comment.id}">${window.renderComment(comment)}</div>`);
      list.scrollTop = list.scrollHeight;
    }
    // Update comment count on post card
    const countSpan = document.getElementById(`comment-count-${postId}`);
    if (countSpan) countSpan.textContent = (+countSpan.textContent||0) + 1;
    if (comment.user_id === 999) showToast('Claude replied!', 'info', '🤖');
  });

  // Real-time message
  socket.on(EVENTS.MESSAGE_RECEIVE, (msg) => {
    if (window.STATE?.currentSection === 'messages' && window.STATE?.currentConversation === msg.sender_id) {
      appendChatMessage(msg, false);
    }
    updateConvPreview(msg.sender_id, msg.text);
    showToast(`💬 ${msg.username}: ${msg.text.slice(0,40)}`, 'info', '💬');
    updateBadge('msg');
  });

  socket.on(EVENTS.MESSAGE_SENT, (msg) => {
    appendChatMessage(msg, true);
  });

  // Typing indicator
  socket.on(EVENTS.TYPING_START, ({ userId }) => {
    const indicator = document.getElementById('typing-indicator');
    if (indicator && window.STATE?.currentConversation === userId) indicator.style.display = 'flex';
  });
  socket.on(EVENTS.TYPING_STOP, ({ userId }) => {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.style.display = 'none';
  });

  // Online/offline
  socket.on(EVENTS.USER_ONLINE, ({ userId }) => {
    document.querySelectorAll(`.conv-avatar[data-uid="${userId}"] .conv-online-dot`).forEach(d => d.style.background = 'var(--accent-green)');
    if (typeof loadWidgets === 'function') loadWidgets();
  });
  socket.on(EVENTS.USER_OFFLINE, ({ userId }) => {
    document.querySelectorAll(`.conv-avatar[data-uid="${userId}"] .conv-online-dot`).forEach(d => d.style.background = 'var(--text-muted)');
    if (typeof loadWidgets === 'function') loadWidgets();
  });

  // User status update (now playing)
  socket.on(EVENTS.USER_STATUS, ({ userId, nowPlaying }) => {
    const el = document.querySelector(`.friend-game[data-uid="${userId}"]`);
    if (el) el.textContent = nowPlaying ? '🎮 ' + nowPlaying : 'In lobby';
  });

  // LFG update
  socket.on(EVENTS.LFG_NEW, () => {
    if (window.STATE?.currentSection === 'lfg') window.loadLFG?.();
  });

  return socket;
}

function appendChatMessage(msg, mine) {
  const chatEl = document.getElementById('chat-messages');
  if (!chatEl) return;
  const me = Auth.getUser();
  const sender = mine ? me : { avatar: msg.avatar, gradient: msg.gradient };
  const div = document.createElement('div');
  div.className = `chat-msg ${mine ? 'mine' : ''}`;
  div.innerHTML = `
    <div class="chat-msg-avatar" style="background:${sender?.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}">${sender?.avatar||'?'}</div>
    <div>
      <div class="chat-msg-bubble">${escapeHtml(msg.text)}</div>
      <div class="chat-msg-time">${msg.time||'just now'}</div>
    </div>`;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function updateConvPreview(userId, text) {
  const convItems = document.querySelectorAll('.conv-item');
  convItems.forEach(item => {
    if (+item.dataset.uid === userId) {
      const lastMsg = item.querySelector('.conv-last-msg');
      if (lastMsg) lastMsg.textContent = text;
    }
  });
}

function updateBadge(type) {
  if (type === 'notif') {
    const badge = document.querySelector('.notif-badge');
    if (badge) { const c = (+badge.textContent||0)+1; badge.textContent = c; badge.style.display = ''; }
  } else if (type === 'msg') {
    const badge = document.querySelectorAll('.nav-badge')[1]; // messages badge
    if (badge) { const c = (+badge.textContent||0)+1; badge.textContent = c; badge.style.display = ''; }
  }
}

function escapeHtml(text) {
  return text.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ================================================================
// AUTH MODAL — uses static HTML from index.html
// ================================================================
function showAuthModal(tab) {
  const modal = document.getElementById('auth-modal');
  if (!modal) return;
  modal.style.display = 'flex';
  switchAuthTab(tab || 'login');
}

function hideAuthModal() {
  const modal = document.getElementById('auth-modal');
  if (modal) modal.style.display = 'none';
}

function switchAuthTab(tab) {
  const loginForm    = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  const tabLogin     = document.getElementById('tab-login');
  const tabRegister  = document.getElementById('tab-register');
  if (!loginForm || !registerForm) return;

  if (tab === 'register') {
    loginForm.style.display    = 'none';
    registerForm.style.display = 'flex';
    tabLogin.classList.remove('active');
    tabRegister.classList.add('active');
  } else {
    loginForm.style.display    = 'flex';
    registerForm.style.display = 'none';
    tabLogin.classList.add('active');
    tabRegister.classList.remove('active');
  }
}

function showAuthError(formId, msg) {
  const el = document.getElementById(formId + '-error');
  if (el) { el.textContent = msg; el.style.display = 'block'; }
}

function hideAuthErrors() {
  ['login-error','register-error'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  });
}

// Wire up auth modal events — called once DOM is ready
function initAuthModal() {
  const tabLoginBtn    = document.getElementById('tab-login');
  const tabRegisterBtn = document.getElementById('tab-register');
  const loginForm      = document.getElementById('login-form');
  const registerForm   = document.getElementById('register-form');

  if (tabLoginBtn)    tabLoginBtn.addEventListener('click',    () => switchAuthTab('login'));
  if (tabRegisterBtn) tabRegisterBtn.addEventListener('click', () => switchAuthTab('register'));

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAuthErrors();
      const btn = document.getElementById('login-btn');
      btn.textContent = 'Signing in…'; btn.disabled = true;
      try {
        const email    = document.getElementById('login-email').value.trim();
        const password = document.getElementById('login-password').value;
        const { token, user } = await api.login(email, password);
        Auth.setToken(token);
        Auth.setUser(user);
        hideAuthModal();
        bootApp(user, token);
        if (typeof showToast === 'function') showToast('Welcome back, ' + user.username + '! 🎮', 'success', '👋');
      } catch (err) {
        showAuthError('login', err.message || 'Login failed');
        btn.textContent = 'Sign In'; btn.disabled = false;
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      hideAuthErrors();
      const btn = document.getElementById('register-btn');
      btn.textContent = 'Creating…'; btn.disabled = true;
      try {
        const { token, user } = await api.register({
          username: document.getElementById('reg-username').value.trim(),
          email:    document.getElementById('reg-email').value.trim(),
          password: document.getElementById('reg-password').value,
          bio:      document.getElementById('reg-bio').value.trim(),
          platform: document.getElementById('reg-platform').value,
          region:   document.getElementById('reg-region').value,
        });
        Auth.setToken(token);
        Auth.setUser(user);
        hideAuthModal();
        bootApp(user, token);
        if (typeof showToast === 'function') showToast('Welcome to DXED, ' + user.username + '! 🚀', 'success', '🎮');
      } catch (err) {
        showAuthError('register', err.message || 'Registration failed');
        btn.textContent = 'Create Account'; btn.disabled = false;
      }
    });
  }
}

// ================================================================
// BOOT
// ================================================================
async function bootWithAuth() {
  initAuthModal();

  const token = Auth.getToken();
  if (!token || isTokenExpired(token)) {
    if (token) Auth.logout(); // clear expired token
    // Auth modal is visible by default in HTML; just make sure correct tab shows
    switchAuthTab('login');
    return;
  }

  try {
    const { user } = await api.me();
    Auth.setUser(user);
    hideAuthModal();
    bootApp(user, token);
  } catch {
    Auth.logout();
  }
}

function bootApp(user, token) {
  if (window.CURRENT_USER !== undefined) {
    Object.assign(window.CURRENT_USER, user, {
      id: user.id,
      name: user.username,
      handle: '@' + user.handle,
      avatar: user.avatar,
      gradient: user.gradient,
    });
  }
  initSocket(token);
  if (typeof window.init === 'function') window.init(user);
}

// ================================================================
// OAUTH POPUP FLOW
// ================================================================
function oauthLogin(provider) {
  const width = 500, height = 650;
  const left = window.screenX + (window.outerWidth - width) / 2;
  const top = window.screenY + (window.outerHeight - height) / 2;
  const popup = window.open(
    `/api/oauth/${provider}`,
    `oauth_${provider}`,
    `width=${width},height=${height},left=${left},top=${top},toolbar=no,menubar=no`
  );
  if (!popup) {
    showAuthError('login', 'Popup blocked. Please allow popups for this site.');
    return;
  }
}

// Listen for OAuth callback messages from popup
window.addEventListener('message', (e) => {
  if (e.origin !== window.location.origin) return;
  if (e.data?.type === 'oauth_success') {
    const { token, user } = e.data;
    Auth.setToken(token);
    Auth.setUser(user);
    hideAuthModal();
    bootApp(user, token);
    if (typeof showToast === 'function') showToast('Welcome, ' + user.username + '!', 'success', '👋');
  } else if (e.data?.type === 'oauth_error') {
    showAuthError('login', e.data.error || 'OAuth login failed');
  }
});

// Export
window.Auth = Auth;
window.api = api;
window.bootWithAuth = bootWithAuth;
window.showAuthModal = showAuthModal;
window.switchAuthTab = switchAuthTab;
window.initSocket = initSocket;
window.fetchWithAuth = fetchWithAuth;
window.oauthLogin = oauthLogin;
