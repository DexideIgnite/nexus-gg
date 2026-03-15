/* ================================================================
   DXED — Full Interactive Gaming Social Platform
   ================================================================ */

'use strict';

// Will be populated from real API on boot
window.CURRENT_USER = {
  id: 0, name: 'Loading...', handle: '@...', avatar: '?',
  rank: 'Bronze', bio: '', games: [], followers: 0, following: 0,
  posts: 0, platform: 'PC', region: 'NA', achievements: 0,
  gradient: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
};

// ================================================================
// STATIC CATALOG DATA (not user-generated)
// ================================================================

const GAMES = [
  { id:1,  name:'Valorant',          genre:'fps',          icon:'🎯', players:'14.2M', rating:'4.7', color:'#ff4655', category:'Tactical FPS' },
  { id:2,  name:'League of Legends', genre:'moba',         icon:'⚔️', players:'11.5M', rating:'4.5', color:'#c89b3c', category:'MOBA' },
  { id:3,  name:'CS2',               genre:'fps',          icon:'💣', players:'10.1M', rating:'4.6', color:'#f0a500', category:'Tactical FPS' },
  { id:4,  name:'Fortnite',          genre:'battle-royale',icon:'🏗️', players:'13.8M', rating:'4.3', color:'#00c2ff', category:'Battle Royale' },
  { id:5,  name:'Marvel Rivals',     genre:'fps',          icon:'🦸', players:'9.3M',  rating:'4.5', color:'#e23636', category:'Hero Shooter' },
  { id:6,  name:'Black Ops 6',       genre:'fps',          icon:'💥', players:'8.8M',  rating:'4.2', color:'#1a1a2e', category:'FPS' },
  { id:7,  name:'Minecraft',         genre:'sandbox',      icon:'⛏️', players:'17.3M', rating:'4.8', color:'#5b8a32', category:'Sandbox' },
  { id:8,  name:'Apex Legends',      genre:'battle-royale',icon:'🦅', players:'8.2M',  rating:'4.4', color:'#cd4118', category:'Battle Royale' },
  { id:9,  name:'Elden Ring',        genre:'rpg',          icon:'⚱️', players:'4.1M',  rating:'4.9', color:'#ffd700', category:'Action RPG' },
  { id:10, name:'Path of Exile 2',   genre:'rpg',          icon:'⚡', players:'3.8M',  rating:'4.6', color:'#7c3aed', category:'Action RPG' },
  { id:11, name:'Dota 2',            genre:'moba',         icon:'🌀', players:'6.4M',  rating:'4.5', color:'#d52b1e', category:'MOBA' },
  { id:12, name:'GTA V',             genre:'rpg',          icon:'🚗', players:'7.2M',  rating:'4.6', color:'#00b3ff', category:'Open World' },
  { id:13, name:'Warzone',           genre:'battle-royale',icon:'🎖️', players:'6.5M',  rating:'4.1', color:'#5f8a00', category:'Battle Royale' },
  { id:14, name:'Rocket League',     genre:'strategy',     icon:'🚀', players:'5.1M',  rating:'4.7', color:'#1d69d8', category:'Sports' },
  { id:15, name:'Overwatch 2',       genre:'fps',          icon:'🛡️', players:'4.8M',  rating:'3.9', color:'#f57d26', category:'Hero Shooter' },
  { id:16, name:'Palworld',          genre:'sandbox',      icon:'🐾', players:'4.2M',  rating:'4.3', color:'#4caf50', category:'Survival' },
  { id:17, name:'Baldur\'s Gate 3',  genre:'rpg',          icon:'🐉', players:'3.2M',  rating:'4.9', color:'#9b4dca', category:'RPG' },
  { id:18, name:'Roblox',            genre:'sandbox',      icon:'🧱', players:'22.4M', rating:'4.1', color:'#ff5252', category:'Sandbox' },
  { id:19, name:'Helldivers 2',      genre:'strategy',     icon:'🪖', players:'3.5M',  rating:'4.6', color:'#ff6b35', category:'Shooter' },
  { id:20, name:'Delta Force',       genre:'fps',          icon:'🔫', players:'2.9M',  rating:'4.3', color:'#2d6a4f', category:'Tactical FPS' },
];

const TOURNAMENTS = [
  { id:1, name:'DXED Open — Valorant', game:'Valorant', icon:'🎯', prize:'$5,000', teams:'128 Teams', format:'Single Elimination', status:'live',     start:'Now', banner:'linear-gradient(135deg,#1a0520,#2d0b4e)' },
  { id:2, name:'League of Legends Clash',  game:'League',   icon:'⚔️', prize:'$2,500', teams:'64 Teams',  format:'Double Elimination', status:'live',     start:'Now', banner:'linear-gradient(135deg,#1a1200,#3d2e00)' },
  { id:3, name:'CS2 Pro Series Season 12', game:'CS2',      icon:'💣', prize:'$10,000',teams:'32 Teams',  format:'GSL Groups',         status:'upcoming', start:'In 2h',banner:'linear-gradient(135deg,#001a10,#003320)' },
  { id:4, name:'Rocket League Grand Prix', game:'RL',       icon:'🚀', prize:'$3,000', teams:'16 Teams',  format:'Round Robin',        status:'upcoming', start:'Tomorrow', banner:'linear-gradient(135deg,#001020,#001a40)' },
  { id:5, name:'Apex Legends Ranked Cup',  game:'Apex',     icon:'🦅', prize:'$1,500', teams:'60 Teams',  format:'Point System',       status:'upcoming', start:'Sat',   banner:'linear-gradient(135deg,#1a0800,#3d1500)' },
];

const ACHIEVEMENTS = [
  { icon:'🏆', name:'First Blood',    desc:'Win your first ranked match',         unlocked:true,  progress:100 },
  { icon:'💎', name:'Diamond Grind',  desc:'Reach Diamond rank in any game',      unlocked:true,  progress:100 },
  { icon:'🔥', name:'On Fire',        desc:'Post 10 clips in one week',           unlocked:true,  progress:100 },
  { icon:'👑', name:'King of the Lobby', desc:'Top player 50 consecutive games',  unlocked:true,  progress:100 },
  { icon:'🎬', name:'Clip Artist',    desc:'Get 1000 views on a clip',            unlocked:true,  progress:100 },
  { icon:'🤝', name:'Squad Goals',    desc:'Join 10 LFG parties',                 unlocked:false, progress:60 },
  { icon:'📢', name:'Influencer',     desc:'Reach 1,000 followers',               unlocked:true,  progress:100 },
  { icon:'⚡', name:'Speed Demon',    desc:'Complete a game in record time',      unlocked:false, progress:35 },
  { icon:'🌍', name:'World Traveler', desc:'Play with people from 5 regions',     unlocked:false, progress:80 },
  { icon:'🕹️', name:'Multiverse',    desc:'Play 10 different games',             unlocked:false, progress:70 },
  { icon:'💀', name:'Rekt',           desc:'Win 100 competitive matches',         unlocked:true,  progress:100 },
  { icon:'🌟', name:'Legendary',      desc:'Reach Challenger/GM in any game',     unlocked:false, progress:20 },
];

const TRENDING_GAMES = [
  { name:'Minecraft',    icon:'⛏️', players:'17.3M', rank:1 },
  { name:'Roblox',       icon:'🧱', players:'22.4M', rank:2 },
  { name:'Valorant',     icon:'🎯', players:'14.2M', rank:3 },
  { name:'Fortnite',     icon:'🏗️', players:'13.8M', rank:4 },
  { name:'Marvel Rivals',icon:'🦸', players:'9.3M',  rank:5 },
];

const HOT_TAGS = ['#Valorant','#GG','#ClipOfTheDay','#Ranked','#LFG','#Minecraft','#EldenRing','#Warzone','#Speedrun','#LeagueOfLegends','#Gaming','#ProPlay'];

// ================================================================
// STATE
// ================================================================

const state = {
  posts: [],
  currentSection: 'home',
  currentConversation: null,
  followedGames: JSON.parse(localStorage.getItem('nx_followed_games') || '[]'),
  feedTab: 'for-you',
  exploreTab: 'trending',
  gamesFilter: 'all',
  notifs: [],
};

function saveState() {
  localStorage.setItem('nx_followed_games', JSON.stringify(state.followedGames));
}

// ================================================================
// HELPERS
// ================================================================

function rankBadgeClass(rank) {
  const map = { Iron:'iron', Bronze:'bronze', Silver:'silver', Gold:'gold', Platinum:'platinum', Diamond:'diamond', Master:'master', Grandmaster:'master', Challenger:'challenger' };
  return 'rank-badge rank-' + (map[rank] || 'gold');
}

// Badge type config: label, color, title
const BADGE_TYPES = {
  official:  { label: 'Official',  color: '#1D9BF0', title: 'Official Account' },
  verified:  { label: 'Verified',  color: '#7C3AED', title: 'Verified' },
  trusted:   { label: 'Trusted',   color: '#059669', title: 'Trusted Member' },
  gold:      { label: 'Gold',      color: '#D97706', title: 'Gold Verified' },
  premium:   { label: 'Premium',   color: '#DC2626', title: 'Premium' },
  creator:   { label: 'Creator',   color: '#DB2777', title: 'Creator' },
  partner:   { label: 'Partner',   color: '#0891B2', title: 'Partner' },
  staff:     { label: 'Staff',     color: '#65A30D', title: 'Staff' },
  admin:     { label: 'Admin',     color: '#9333EA', title: 'Admin' },
  legend:    { label: 'Legend',    color: '#F59E0B', title: 'Legend' },
  newcomer:  { label: 'New',       color: '#14B8A6', title: 'New Member' },
  elite:     { label: 'Elite',     color: '#6366F1', title: 'Elite' },
  ownership: { label: 'Owner',     color: '#FFD700', title: 'Platform Owner' },
};

function verifiedBadge(user, large) {
  if (!user) return '';
  // Support both badge_type and legacy boolean verified
  const type = user.badge_type || (user.verified ? 'official' : '');
  if (!type || !BADGE_TYPES[type]) return '';
  const b = BADGE_TYPES[type];
  const sz = large ? 22 : 16;
  const icsz = large ? 13 : 10;
  return `<span class="vb vb-${type}${large ? ' vb-lg' : ''}" title="${b.title}"><svg class="vb-svg" viewBox="0 0 64 64" width="${sz}" height="${sz}"><path d="M32 4L54 14Q56 15 56 18L56 34Q56 50 32 60Q8 50 8 34L8 18Q8 15 10 14Z" fill="currentColor"/><path d="M32 10L50 18.5Q51.5 19.2 51.5 21L51.5 34Q51.5 47 32 56Q12.5 47 12.5 34L12.5 21Q12.5 19.2 14 18.5Z" fill="white" opacity="0.15"/><g transform="translate(14,16)"><polyline points="26 8 14 22 8 16" stroke="white" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" opacity="0.25" fill="none"/><polyline points="26 8 14 22 8 16" stroke="white" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g><ellipse cx="26" cy="18" rx="7" ry="3.5" fill="white" opacity="0.18" transform="rotate(-20 26 18)"/></svg></span>`;
}

function formatNum(n) {
  if (n >= 1000000) return (n/1000000).toFixed(1) + 'M';
  if (n >= 1000) return (n/1000).toFixed(1) + 'K';
  return (n || 0).toString();
}

function parseBody(text) {
  if (!text) return '';
  return escapeHtml(text)
    .replace(/#(\w+)/g, '<span class="post-hashtag" onclick="searchHashtag(\'$1\')">#$1</span>')
    .replace(/@(\w+)/g, '<span class="post-mention" onclick="searchUser(\'$1\')">@$1</span>');
}

function avatarEl(user, cls='post-avatar') {
  const name = user.name || user.username || '?';
  const av = user.avatar || name[0].toUpperCase();
  let inner;
  if (user.avatar_url) {
    inner = `<div class="${cls}" style="background:${user.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};background-image:url('${user.avatar_url}');background-size:cover;background-position:center" onclick="openUserProfile(${user.id})"></div>`;
  } else {
    inner = `<div class="${cls}" style="background:${user.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}" onclick="openUserProfile(${user.id})">${av}</div>`;
  }
  // Animated frame for plus/pro users
  const plan = user.plan || 'free';
  if (plan === 'pro') {
    return `<div class="avatar-frame-animated frame-pro">${inner}</div>`;
  } else if (plan === 'plus') {
    return `<div class="avatar-frame-animated">${inner}</div>`;
  }
  return inner;
}

function userName(user) { return user.name || user.username || 'Unknown'; }
function cleanHandle(raw) { return (raw || 'unknown').replace(/^@/, '').replace(/#\d+$/, ''); }
function userHandle(user) {
  return '@' + cleanHandle(user.handle || user.username);
}

function totalReactions(r) { return Object.values(r || {}).reduce((a,b)=>a+(b||0),0); }

function showToast(msg, type='info', emoji='🎮') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `<span>${emoji}</span><span>${msg}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideOut 0.3s ease forwards';
    setTimeout(() => toast.remove(), 300);
  }, 3200);
}

// Custom confirm dialog (replaces browser confirm())
function showConfirm(message, { confirmText = 'Delete', cancelText = 'Cancel', danger = true } = {}) {
  return new Promise(resolve => {
    const overlay = document.createElement('div');
    overlay.className = 'confirm-overlay';
    overlay.innerHTML = `
      <div class="confirm-box">
        <p class="confirm-message">${message}</p>
        <div class="confirm-actions">
          <button class="confirm-cancel-btn">${cancelText}</button>
          <button class="confirm-ok-btn${danger ? ' confirm-danger' : ''}">${confirmText}</button>
        </div>
      </div>`;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('visible'));
    const close = (result) => {
      overlay.classList.remove('visible');
      setTimeout(() => overlay.remove(), 200);
      resolve(result);
    };
    overlay.querySelector('.confirm-cancel-btn').onclick = () => close(false);
    overlay.querySelector('.confirm-ok-btn').onclick = () => close(true);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(false); });
  });
}

// ================================================================
// PLANS / SUBSCRIPTION
// ================================================================

function planBadge(plan) {
  if (plan === 'plus') return `<span class="plan-badge plan-badge-plus">DXED+</span>`;
  if (plan === 'pro') return `<span class="verified-badge verified-gold plan-badge-pro-glow" title="DXED Pro"><svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>`;
  return '';
}

function showUpgradePrompt(feature) {
  const existing = document.getElementById('upgrade-prompt-toast');
  if (existing) existing.remove();
  const el = document.createElement('div');
  el.id = 'upgrade-prompt-toast';
  el.className = 'upgrade-prompt-toast';
  el.innerHTML = `
    <div class="upgrade-prompt-inner">
      <div class="upgrade-prompt-icon">⚡</div>
      <div class="upgrade-prompt-text">
        <strong>DXED+ Required</strong>
        <span>${feature} requires a DXED+ plan</span>
      </div>
      <button class="upgrade-prompt-btn" onclick="navigate('plans');this.closest('#upgrade-prompt-toast').remove()">Upgrade</button>
      <button class="upgrade-prompt-close" onclick="this.closest('#upgrade-prompt-toast').remove()">✕</button>
    </div>`;
  document.body.appendChild(el);
  setTimeout(() => { if (el.parentNode) el.style.animation = 'slideOut 0.3s ease forwards'; setTimeout(() => el.remove(), 300); }, 6000);
}

function updatePlanUI() {
  const u = window.CURRENT_USER;
  const plan = u?.plan || 'free';
  // Sidebar badge
  const sidebarBadge = document.getElementById('sidebar-plan-badge');
  if (sidebarBadge) {
    sidebarBadge.innerHTML = planBadge(plan);
    sidebarBadge.style.display = plan === 'free' ? 'none' : '';
  }
  // Nav DXED+ item badge
  const navBadge = document.getElementById('nav-plans-badge');
  if (navBadge) {
    if (plan === 'free') { navBadge.textContent = 'Upgrade'; navBadge.style.display = ''; }
    else { navBadge.style.display = 'none'; }
  }
  // Nav item glow for non-free
  const navPlans = document.querySelector('.nav-item-plans');
  if (navPlans) navPlans.classList.toggle('nav-plans-active', plan !== 'free');
}

async function upgradePlan(plan) {
  const currentPlan = window.CURRENT_USER?.plan || 'free';
  const planOrder = { free: 0, plus: 1, pro: 2 };
  const isDowngrade = (planOrder[plan] || 0) < (planOrder[currentPlan] || 0);
  if (isDowngrade) {
    const names = { free: 'Free', plus: 'DXED+', pro: 'DXED Pro' };
    if (!await showConfirm(`Downgrade from ${names[currentPlan]} to ${names[plan]}? You'll lose access to premium features immediately.`, { confirmText: 'Downgrade', danger: true })) return;
  }
  const btn = document.getElementById(`plan-btn-${plan}`);
  if (btn) { btn.disabled = true; btn.textContent = 'Processing...'; }
  try {
    const user = await api.upgradePlan(plan);
    window.CURRENT_USER.plan = user.plan;
    Auth.setUser({ ...Auth.getUser(), plan: user.plan });
    updatePlanUI();
    loadPlans();
    // Re-fetch user data to refresh all gated UI
    try { const me = await api.me(); Object.assign(window.CURRENT_USER, me); Auth.setUser(me); } catch {}
    const names = { free: 'Free', plus: 'DXED+', pro: 'DXED Pro' };
    showToast(`Switched to ${names[plan] || plan}!`, 'success', plan === 'free' ? '🔄' : '⚡');
  } catch (err) {
    showToast(err.message || 'Failed to update plan', 'error', '⚠️');
    if (btn) { btn.disabled = false; btn.textContent = 'Select Plan'; }
  }
}

function loadPlans() {
  const container = document.getElementById('plans-container');
  if (!container) return;
  const currentPlan = window.CURRENT_USER?.plan || 'free';

  const plans = [
    {
      id: 'free',
      name: 'Free',
      price: '$0',
      period: '/month',
      badge: '',
      color: 'var(--text-muted)',
      gradient: 'linear-gradient(135deg,#1a1a2e,#16213e)',
      features: [
        { ok: true,  text: 'Up to 100 posts stored' },
        { ok: true,  text: '60s clip uploads' },
        { ok: true,  text: 'Join LFG parties' },
        { ok: true,  text: 'Follow gamers & games' },
        { ok: true,  text: 'Direct messages' },
        { ok: false, text: '@Claude AI assistant' },
        { ok: false, text: 'Animated avatar frame' },
        { ok: false, text: 'Premium accent colors' },
        { ok: false, text: 'Clan creation & analytics' },
      ],
      cta: currentPlan === 'free' ? 'Current Plan' : 'Downgrade',
      disabled: currentPlan === 'free',
    },
    {
      id: 'plus',
      name: 'DXED+',
      price: '$4.99',
      period: '/month',
      badge: 'POPULAR',
      color: '#8b5cf6',
      gradient: 'linear-gradient(135deg,#1a0a3a,#3b1a6e)',
      features: [
        { ok: true,  text: 'Everything in Free' },
        { ok: true,  text: '@Claude AI assistant' },
        { ok: true,  text: 'Up to 500 posts stored' },
        { ok: true,  text: 'Animated avatar frame' },
        { ok: true,  text: 'Premium accent colors (12)' },
        { ok: true,  text: 'Priority LFG matchmaking' },
        { ok: true,  text: 'DXED+ profile badge' },
        { ok: false, text: 'Clan creation & analytics' },
      ],
      cta: currentPlan === 'plus' ? 'Current Plan' : currentPlan === 'pro' ? 'Downgrade' : 'Upgrade to DXED+',
      disabled: currentPlan === 'plus',
    },
    {
      id: 'pro',
      name: 'DXED Pro',
      price: '$9.99',
      period: '/month',
      badge: 'BEST VALUE',
      color: '#f59e0b',
      gradient: 'linear-gradient(135deg,#1a0a00,#3d2000)',
      features: [
        { ok: true,  text: 'Everything in DXED+' },
        { ok: true,  text: 'Unlimited post storage' },
        { ok: true,  text: '10 min clip uploads' },
        { ok: true,  text: 'Verified Pro badge ✓ with glow' },
        { ok: true,  text: 'Create & lead clans' },
        { ok: true,  text: 'Host tournaments (coming soon)' },
        { ok: true,  text: 'Profile analytics dashboard' },
        { ok: true,  text: 'Gold animated avatar frame' },
      ],
      cta: currentPlan === 'pro' ? 'Current Plan' : 'Upgrade to Pro',
      disabled: currentPlan === 'pro',
    },
  ];

  container.innerHTML = `
    <div class="plans-hero">
      <div class="plans-hero-icon">⚡</div>
      <h2 class="plans-hero-title">Level Up Your Gaming Experience</h2>
      <p class="plans-hero-sub">Unlock AI-powered features, exclusive badges, and more with DXED+ plans</p>
      ${currentPlan !== 'free' ? `<div class="plans-current-banner">You're on <strong>${currentPlan === 'plus' ? 'DXED+' : 'DXED Pro'}</strong> ${planBadge(currentPlan)}</div>` : ''}
    </div>
    <div class="plans-grid">
      ${plans.map(p => `
        <div class="plan-card ${currentPlan === p.id ? 'plan-card-current' : ''} ${p.id === 'plus' ? 'plan-card-featured' : ''}" style="--plan-color:${p.color};--plan-gradient:${p.gradient}">
          ${p.badge ? `<div class="plan-badge-top" style="background:${p.color}">${p.badge}</div>` : ''}
          <div class="plan-card-header">
            <div class="plan-name">${p.name}</div>
            <div class="plan-price">${p.price}<span class="plan-period">${p.period}</span></div>
          </div>
          <ul class="plan-features">
            ${p.features.map(f => `
              <li class="plan-feature ${f.ok ? 'feature-ok' : 'feature-no'}">
                <span class="feature-icon">${f.ok ? '✓' : '✕'}</span>
                <span>${f.text}</span>
              </li>`).join('')}
          </ul>
          <button class="plan-cta-btn ${p.disabled ? 'plan-cta-current' : p.id === 'free' ? 'plan-cta-downgrade' : 'plan-cta-upgrade'}" id="plan-btn-${p.id}" ${p.disabled ? 'disabled' : ''} onclick="upgradePlan('${p.id}')">
            ${p.cta}
          </button>
        </div>`).join('')}
    </div>
    <div class="plans-footer">
      <p>All plans include access to the DXED platform. Plans can be changed or cancelled anytime.</p>
      <p style="color:var(--text-muted);font-size:12px;margin-top:8px">This is a demo platform. No real payments are processed.</p>
    </div>`;
}

// ================================================================
// NAVIGATION
// ================================================================

function navigate(section, skipHash) {
  // Close any open game community page when leaving games section
  if (section !== 'games') closeCommunity();

  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

  const el = document.getElementById(section + '-section');
  if (el) el.classList.add('active');

  const navEl = document.querySelector(`.nav-item[data-section="${section}"]`);
  if (navEl) navEl.classList.add('active');

  // Update mobile bottom nav
  document.querySelectorAll('.mobile-nav-item').forEach(n => n.classList.remove('active'));
  const mobileNavEl = document.querySelector(`.mobile-nav-item[data-section="${section}"]`);
  if (mobileNavEl) mobileNavEl.classList.add('active');

  state.currentSection = section;

  // Update URL hash (skip for user-profile since openUserProfile handles that)
  if (!skipHash && section !== 'user-profile') {
    const hashName = section === 'home' ? '' : section;
    const newHash = hashName ? '#' + hashName : '';
    if (window.location.hash !== newHash) {
      history.pushState(null, '', newHash || window.location.pathname);
    }
  }

  const loaders = {
    home: loadHome,
    explore: loadExplore,
    games: loadGames,
    lfg: loadLFG,
    tournaments: loadTournaments,
    messages: loadMessages,
    notifications: loadNotifications,
    leaderboard: loadLeaderboard,
    profile: loadProfile,
    people: loadPeople,
    plans: loadPlans,
    settings: loadSettings,
    'user-profile': loadUserProfile,
    bookmarks: loadBookmarks,
    clans: loadClans,
    clips: loadClips,
    search: loadSearch,
    admin: loadAdmin,
  };
  if (loaders[section]) loaders[section]();
}

// ================================================================
// HOME FEED
// ================================================================

function loadHome() {
  initStoryObserver();
  renderFeed();
  updateSidebarUser();
}

function updateSidebarUser() {
  const u = window.CURRENT_USER;
  const sidebarAv = document.getElementById('sidebar-avatar');
  if (sidebarAv) {
    sidebarAv.style.background = u.gradient || '';
    if (u.avatar_url) {
      sidebarAv.style.backgroundImage = `url('${u.avatar_url}')`;
      sidebarAv.style.backgroundSize = 'cover';
      sidebarAv.style.backgroundPosition = 'center';
      sidebarAv.textContent = '';
    } else {
      sidebarAv.style.backgroundImage = '';
      sidebarAv.textContent = u.avatar || '?';
    }
  }
  document.getElementById('sidebar-username').textContent = u.name || u.username || 'Player';
  // Show clean handle: strip #discriminator, keep @ prefix
  const cleanHandle = (u.handle || '@player').replace(/#\d+$/, '');
  document.getElementById('sidebar-tag').textContent = cleanHandle;
  document.getElementById('compose-avatar').textContent = u.avatar_url ? '' : u.avatar;
  document.getElementById('compose-avatar').style.background = u.gradient || '';
  if (u.avatar_url) document.getElementById('compose-avatar').style.backgroundImage = `url('${u.avatar_url}')`;
  document.getElementById('modal-avatar').textContent = u.avatar_url ? '' : u.avatar;
  document.getElementById('modal-avatar').style.background = u.gradient || '';
  if (u.avatar_url) document.getElementById('modal-avatar').style.backgroundImage = `url('${u.avatar_url}')`;
  updatePlanUI();
}

// ================================================================
// STORY BUBBLES
// ================================================================
let _storyGroups = [];
let _storyObserver = null;

function initStoryObserver() {
  if (_storyObserver) return;
  const container = document.getElementById('stories-container');
  if (!container || !window.IntersectionObserver) { loadStories(); return; }
  _storyObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) loadStories();
  }, { threshold: 0.1 });
  _storyObserver.observe(container);
}

async function loadStories() {
  const scroll = document.getElementById('stories-scroll');
  if (!scroll) return;
  const me = Auth.getUser();
  try {
    const groups = await api.getStories();
    const now = Date.now();
    _storyGroups = groups.filter(g => g.stories.some(s => new Date(s.expires_at).getTime() > now));
  } catch {}

  const myGroup = _storyGroups.find(g => g.user?.id === me?.id);
  const myHasStory = !!(myGroup && myGroup.stories?.length);
  const myAllViewed = myHasStory && myGroup.stories.every(s => s.viewed);

  // Own story ring — click opens story creator; long-press / secondary click views own story
  let html = `<div class="story-item add-story" onclick="${myHasStory ? 'openOwnStoryViewer()' : 'openStoryCreator()'}">
    <div class="story-ring own${myHasStory ? (myAllViewed ? ' watched' : '') : ''}">
      <div class="story-avatar-inner add-avatar${myHasStory ? ' has-story' : ''}">
        ${myHasStory
          ? `<div style="background:${me?.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};width:100%;height:100%;display:flex;align-items:center;justify-content:center;border-radius:50%;font-size:18px">${me?.avatar||'?'}</div>`
          : '+'}
      </div>
    </div>
    <span>${myHasStory ? 'Your Story' : 'Add Story'}</span>
  </div>`;

  const others = _storyGroups.filter(g => g.user?.id !== me?.id);
  others.forEach((group, idx) => {
    const u = group.user;
    const allViewed = group.stories.every(s => s.viewed);
    const shortName = (u.username || '?').slice(0, 8);
    html += `<div class="story-item" onclick="openStoryViewer(${idx})">
      <div class="story-ring${allViewed ? ' watched' : ''}">
        <div class="story-avatar-inner" style="background:${u.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}">${escapeHtml(u.avatar||'?')}</div>
      </div>
      <span>${escapeHtml(shortName)}</span>
    </div>`;
  });
  scroll.innerHTML = html;
}

// ================================================================
// STORY CREATOR
// ================================================================
let _storyFile = null;
let _storyThumbBlob = null;
let _storyDuration = null;
let _storyCameraStream = null;
let _storyCameraCapture = null;
let _storyCreatorTab = 'gallery';

function openStoryCreator() {
  if (!Auth.isLoggedIn()) { showAuthModal('login'); return; }
  document.getElementById('story-creator').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
}

function closeStoryCreator() {
  document.getElementById('story-creator').classList.add('hidden');
  document.body.style.overflow = '';
  _stopCamera();
  clearStoryMedia();
  _storyFile = null; _storyThumbBlob = null; _storyDuration = null;
  _storyCameraCapture = null;
  document.getElementById('story-caption').value = '';
  document.getElementById('story-text-overlay').value = '';
  document.getElementById('story-upload-progress-wrap').style.display = 'none';
  document.getElementById('story-upload-progress-fill').style.width = '0%';
}

function switchStoryTab(tab) {
  _storyCreatorTab = tab;
  document.getElementById('tab-gallery').classList.toggle('active', tab === 'gallery');
  document.getElementById('tab-camera').classList.toggle('active', tab === 'camera');
  document.getElementById('story-gallery-panel').style.display = tab === 'gallery' ? 'block' : 'none';
  document.getElementById('story-camera-panel').style.display = tab === 'camera' ? 'block' : 'none';
  if (tab === 'camera') _startCamera();
  else _stopCamera();
}

// ── Gallery tab ──────────────────────────────────────────────────
async function onStoryFileSelected(e) {
  const file = e.target.files[0];
  if (!file) return;
  const isVideo = file.type.startsWith('video/');

  if (isVideo) {
    // Validate 60s limit
    const dur = await _getVideoDuration(file);
    if (dur > 60) {
      showToast('Video must be 60 seconds or less', 'error', '⏱️');
      e.target.value = '';
      return;
    }
    _storyDuration = Math.round(dur);
    _storyThumbBlob = await _grabVideoThumbnail(file);
    _storyFile = file;
    _showPreview(null, file);
  } else {
    // Compress image
    let compressed = file;
    if (window.imageCompression) {
      try {
        compressed = await imageCompression(file, { maxSizeMB: 1, maxWidthOrHeight: 1080, useWebWorker: true });
      } catch {}
    }
    _storyFile = compressed;
    _storyDuration = null;
    _storyThumbBlob = null;
    _showPreview(compressed, null);
  }
}

function _showPreview(imgFile, vidFile) {
  document.getElementById('story-upload-placeholder').style.display = 'none';
  document.getElementById('story-preview-wrap').style.display = 'flex';
  const img = document.getElementById('story-img-preview');
  const vid = document.getElementById('story-vid-preview');
  if (vidFile) {
    img.style.display = 'none';
    vid.style.display = 'block';
    vid.src = URL.createObjectURL(vidFile);
  } else {
    vid.style.display = 'none';
    img.style.display = 'block';
    img.src = URL.createObjectURL(imgFile);
  }
}

function clearStoryMedia(e) {
  if (e) e.stopPropagation();
  _storyFile = null; _storyThumbBlob = null;
  document.getElementById('story-upload-placeholder').style.display = 'flex';
  document.getElementById('story-preview-wrap').style.display = 'none';
  const img = document.getElementById('story-img-preview');
  const vid = document.getElementById('story-vid-preview');
  if (img.src) { URL.revokeObjectURL(img.src); img.src = ''; }
  if (vid.src) { URL.revokeObjectURL(vid.src); vid.src = ''; vid.style.display = 'none'; }
  document.getElementById('story-file-input').value = '';
}

// ── Camera tab ───────────────────────────────────────────────────
async function _startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' }, audio: false });
    _storyCameraStream = stream;
    const feed = document.getElementById('story-camera-feed');
    feed.srcObject = stream;
    feed.style.display = 'block';
    document.getElementById('story-camera-captured').style.display = 'none';
    document.getElementById('story-snap-btn').style.display = '';
    document.getElementById('story-retake-btn').style.display = 'none';
  } catch {
    showToast('Camera not available', 'error', '📷');
  }
}

function _stopCamera() {
  if (_storyCameraStream) {
    _storyCameraStream.getTracks().forEach(t => t.stop());
    _storyCameraStream = null;
  }
  const feed = document.getElementById('story-camera-feed');
  if (feed) { feed.srcObject = null; }
}

async function snapPhoto() {
  const feed = document.getElementById('story-camera-feed');
  const canvas = document.createElement('canvas');
  canvas.width = feed.videoWidth || 640;
  canvas.height = feed.videoHeight || 480;
  canvas.getContext('2d').drawImage(feed, 0, 0);
  canvas.toBlob(async blob => {
    _storyCameraCapture = blob;
    _storyFile = blob;
    _storyDuration = null;
    _storyThumbBlob = null;
    const url = URL.createObjectURL(blob);
    feed.style.display = 'none';
    const captured = document.getElementById('story-camera-captured');
    captured.style.display = 'block';
    document.getElementById('story-camera-img').src = url;
    document.getElementById('story-snap-btn').style.display = 'none';
    document.getElementById('story-retake-btn').style.display = '';
    _stopCamera();
  }, 'image/jpeg', 0.85);
}

function retakePhoto() {
  _storyCameraCapture = null; _storyFile = null;
  document.getElementById('story-camera-captured').style.display = 'none';
  _startCamera();
}

// ── Helpers ──────────────────────────────────────────────────────
function _getVideoDuration(file) {
  return new Promise(resolve => {
    const v = document.createElement('video');
    v.preload = 'metadata';
    v.onloadedmetadata = () => { resolve(v.duration); URL.revokeObjectURL(v.src); };
    v.src = URL.createObjectURL(file);
  });
}

function _grabVideoThumbnail(file) {
  return new Promise(resolve => {
    const v = document.createElement('video');
    v.preload = 'metadata'; v.muted = true;
    v.onloadeddata = () => { v.currentTime = Math.min(0.5, v.duration * 0.1); };
    v.onseeked = () => {
      const c = document.createElement('canvas');
      c.width = v.videoWidth; c.height = v.videoHeight;
      c.getContext('2d').drawImage(v, 0, 0);
      c.toBlob(blob => { URL.revokeObjectURL(v.src); resolve(blob); }, 'image/jpeg', 0.7);
    };
    v.onerror = () => resolve(null);
    v.src = URL.createObjectURL(file);
  });
}

// ── Submit via XHR (tracks upload progress) ──────────────────────
async function submitStory() {
  const file = _storyCreatorTab === 'camera' ? _storyCameraCapture : _storyFile;
  if (!file) { showToast('Pick a photo or video first!', 'error', '⚠️'); return; }

  const btn = document.getElementById('story-post-btn');
  btn.disabled = true; btn.textContent = 'Uploading...';
  document.getElementById('story-upload-progress-wrap').style.display = 'block';

  try {
    const caption = document.getElementById('story-caption').value.trim();
    const textOverlay = _storyCreatorTab === 'camera'
      ? (document.getElementById('story-camera-text-overlay')?.value?.trim() || '')
      : (document.getElementById('story-text-overlay')?.value?.trim() || '');

    const form = new FormData();
    const ext = file.type.includes('video') ? '.mp4' : '.jpg';
    form.append('media', file, `story${ext}`);
    if (_storyThumbBlob) form.append('thumbnail', _storyThumbBlob, 'thumb.jpg');
    if (caption) form.append('caption', caption);
    if (textOverlay) form.append('text_overlay', textOverlay);
    if (_storyDuration) form.append('duration', String(_storyDuration));

    await _xhrUploadStory(form);
    closeStoryCreator();
    showToast('Story posted! 🔥', 'success', '✅');
    loadStories();
  } catch (err) {
    showToast(err.message || 'Upload failed', 'error', '⚠️');
    document.getElementById('story-upload-progress-wrap').style.display = 'none';
  } finally {
    btn.disabled = false; btn.textContent = 'Share Story 🔥';
  }
}

function _xhrUploadStory(formData) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = e => {
      if (e.lengthComputable) {
        const pct = Math.round((e.loaded / e.total) * 100);
        document.getElementById('story-upload-progress-fill').style.width = pct + '%';
        document.getElementById('story-upload-pct').textContent = pct + '%';
      }
    };
    xhr.onload = () => {
      try {
        const d = JSON.parse(xhr.responseText);
        if (xhr.status >= 200 && xhr.status < 300) resolve(d);
        else reject(new Error(d.error || 'Upload failed'));
      } catch { reject(new Error('Upload failed')); }
    };
    xhr.onerror = () => reject(new Error('Network error'));
    xhr.open('POST', '/api/stories');
    xhr.setRequestHeader('Authorization', 'Bearer ' + Auth.getToken());
    xhr.send(formData);
  });
}

// ================================================================
// STORY VIEWER — setInterval-driven progress (pauseable)
// ================================================================
const SV = {
  groups: [], gIdx: 0, sIdx: 0,
  progress: 0, isPaused: false,
  ticker: null, muted: true,
};

function openStoryViewer(groupIdx) {
  const me = Auth.getUser();
  SV.groups = _storyGroups.filter(g => g.user?.id !== me?.id);
  SV.gIdx = Math.max(0, Math.min(groupIdx, SV.groups.length - 1));
  SV.sIdx = 0; SV.progress = 0; SV.isPaused = false;
  document.getElementById('story-viewer').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  _svRender();
}

function openOwnStoryViewer() {
  const me = Auth.getUser();
  const myGroup = _storyGroups.find(g => g.user?.id === me?.id);
  if (!myGroup) { openStoryCreator(); return; }
  SV.groups = [myGroup];
  SV.gIdx = 0; SV.sIdx = 0; SV.progress = 0; SV.isPaused = false;
  document.getElementById('story-viewer').classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  _svRender();
}

function closeStoryViewer() {
  _svStopTicker();
  document.getElementById('story-viewer').classList.add('hidden');
  document.body.style.overflow = '';
  const vid = document.getElementById('sv-vid');
  vid.pause(); vid.src = ''; vid.style.display = 'none';
  document.getElementById('sv-img').src = '';
  loadStories(); // refresh viewed rings
}

function _svRender() {
  _svStopTicker();
  SV.progress = 0;

  const group = SV.groups[SV.gIdx];
  if (!group) { closeStoryViewer(); return; }
  const story = group.stories[SV.sIdx];
  if (!story) { closeStoryViewer(); return; }
  const u = group.user;
  const me = Auth.getUser();

  // Header
  const avatarEl = document.getElementById('sv-avatar');
  avatarEl.textContent = u.avatar || '?';
  avatarEl.style.background = u.gradient || 'linear-gradient(135deg,#8b5cf6,#3b82f6)';
  document.getElementById('sv-name').textContent = u.username;
  document.getElementById('sv-time').textContent = story.created_at ? timeAgoClient(story.created_at) : 'now';
  document.getElementById('sv-caption').textContent = story.caption || '';
  // Text overlay
  const overlayEl = document.getElementById('sv-text-overlay');
  overlayEl.textContent = story.text_overlay || '';
  overlayEl.style.display = story.text_overlay ? 'block' : 'none';

  // View count + delete button (own stories only)
  const vcEl = document.getElementById('sv-view-count');
  const isOwn = story.user_id === me?.id || u.id === me?.id;
  let delBtn = document.getElementById('sv-delete-btn');
  if (isOwn) {
    vcEl.classList.remove('hidden');
    api.getStoryViewCount(story.id).then(({ count }) => { vcEl.textContent = count + ' views'; }).catch(() => {});
    if (!delBtn) {
      delBtn = document.createElement('button');
      delBtn.id = 'sv-delete-btn';
      delBtn.className = 'sv-delete-btn';
      delBtn.textContent = 'Delete';
      vcEl.parentElement.insertBefore(delBtn, vcEl);
    }
    delBtn.style.display = '';
    delBtn.onclick = async () => {
      if (!await showConfirm('Delete this story?')) return;
      try {
        await api.deleteStory(story.id);
        group.stories.splice(SV.sIdx, 1);
        if (!group.stories.length) { closeStoryViewer(); loadStories(); return; }
        if (SV.sIdx >= group.stories.length) SV.sIdx = group.stories.length - 1;
        _svRender();
        loadStories();
      } catch { showToast('Failed to delete story', 'error'); }
    };
  } else {
    vcEl.classList.add('hidden');
    if (delBtn) delBtn.style.display = 'none';
  }

  // Progress bars
  const barsEl = document.getElementById('story-progress-bars');
  barsEl.innerHTML = group.stories.map((_, i) =>
    `<div class="story-prog-bar"><div class="story-prog-fill" id="spf-${i}" style="width:${i < SV.sIdx ? '100%' : '0%'}"></div></div>`
  ).join('');

  // Media
  const img = document.getElementById('sv-img');
  const vid = document.getElementById('sv-vid');
  vid.onended = null;

  if (story.media_type === 'video') {
    img.style.display = 'none';
    vid.style.display = 'block';
    vid.muted = SV.muted;
    vid.src = story.media_url;
    vid.play().catch(() => {});
    // Duration from DB or wait for metadata
    const useDur = story.duration || null;
    if (useDur) {
      _svStartTicker(useDur * 1000);
    } else {
      vid.onloadedmetadata = () => _svStartTicker((vid.duration || 5) * 1000);
    }
    vid.onended = svNext;
  } else {
    vid.pause(); vid.src = ''; vid.style.display = 'none';
    img.src = story.media_url;
    img.style.display = 'block';
    _svStartTicker(5000);
  }

  // Unmute button
  document.getElementById('sv-unmute-btn').textContent = SV.muted ? '🔇' : '🔊';

  // Mark viewed
  api.viewStory(story.id).catch(() => {});

  // Preload next
  _svPreloadNext();
}

function _svStartTicker(durationMs) {
  _svStopTicker();
  const tickInterval = 100;
  SV.ticker = setInterval(() => {
    if (SV.isPaused) return;
    SV.progress += (tickInterval / durationMs) * 100;
    if (SV.progress >= 100) { SV.progress = 100; _svStopTicker(); svNext(); return; }
    const fill = document.getElementById('spf-' + SV.sIdx);
    if (fill) fill.style.width = SV.progress + '%';
  }, tickInterval);
}

function _svStopTicker() {
  if (SV.ticker) { clearInterval(SV.ticker); SV.ticker = null; }
}

function svPauseHold() {
  SV.isPaused = true;
  const vid = document.getElementById('sv-vid');
  if (vid.src) vid.pause();
}

function svResumeHold() {
  SV.isPaused = false;
  const vid = document.getElementById('sv-vid');
  if (vid.src) vid.play().catch(() => {});
}

function svToggleMute(e) {
  e.stopPropagation();
  SV.muted = !SV.muted;
  const vid = document.getElementById('sv-vid');
  vid.muted = SV.muted;
  document.getElementById('sv-unmute-btn').textContent = SV.muted ? '🔇' : '🔊';
}

function svNext(e) {
  if (e) e.stopPropagation();
  const group = SV.groups[SV.gIdx];
  if (group && SV.sIdx < group.stories.length - 1) {
    SV.sIdx++;
    _svRender();
  } else if (SV.gIdx < SV.groups.length - 1) {
    SV.gIdx++; SV.sIdx = 0;
    _svRender();
  } else {
    closeStoryViewer();
  }
}

function svPrev(e) {
  if (e) e.stopPropagation();
  if (SV.sIdx > 0) { SV.sIdx--; _svRender(); }
  else if (SV.gIdx > 0) { SV.gIdx--; SV.sIdx = 0; _svRender(); }
}

function _svPreloadNext() {
  const group = SV.groups[SV.gIdx];
  if (!group) return;
  const next = group.stories[SV.sIdx + 1] || SV.groups[SV.gIdx + 1]?.stories[0];
  if (!next?.media_url) return;
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = next.media_type === 'video' ? 'video' : 'image';
  link.href = next.media_url;
  document.head.appendChild(link);
}

function timeAgoClient(d) {
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000), h = Math.floor(m / 60);
  if (h > 0) return h + 'h ago';
  if (m > 0) return m + 'm ago';
  return 'just now';
}

async function renderFeed() {
  const container = document.getElementById('feed-container');
  container.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading feed...</div>`;
  try {
    const tabMap = { 'for-you': 'for-you', 'following': 'following', 'gaming': 'hot' };
    const posts = await api.getFeed(tabMap[state.feedTab] || 'for-you');
    const normalized = posts.map(normalizePost);
    state.posts = normalized;
    if (!normalized.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">📭</div><p>No posts yet</p><span>Be the first to post!</span></div>`;
      return;
    }
    container.innerHTML = normalized.map(renderPost).join('');
    observePostViews(container);
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load feed</p><span>Make sure the server is running</span></div>`;
  }
}

// ================================================================
// VIEW COUNTING — IntersectionObserver + batching
// ================================================================
const _viewState = { pending: new Set(), timers: {}, sent: new Set(), flushTimer: null };

const _viewObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const postId = +entry.target.dataset.postId;
    if (!postId) return;
    if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
      if (_viewState.sent.has(postId)) return;
      _viewState.timers[postId] = setTimeout(() => {
        _viewState.pending.add(postId);
        _viewState.sent.add(postId);
        if (!_viewState.flushTimer) {
          _viewState.flushTimer = setTimeout(flushViews, 3000);
        }
      }, 300);
    } else {
      clearTimeout(_viewState.timers[postId]);
      delete _viewState.timers[postId];
    }
  });
}, { threshold: 0.5 });

function flushViews() {
  _viewState.flushTimer = null;
  if (!_viewState.pending.size) return;
  const ids = [..._viewState.pending];
  _viewState.pending.clear();
  apiRequest('POST', '/posts/batch-views', { postIds: ids }).catch(() => {});
  // Update displayed counts
  ids.forEach(id => {
    const el = document.querySelector(`#post-${id} .views-btn span`);
    if (el) el.textContent = +el.textContent + 1;
  });
}

function observePostViews(container) {
  if (!container) return;
  container.querySelectorAll('.post-card').forEach(card => {
    const id = card.id?.replace('post-', '');
    if (id) { card.dataset.postId = id; _viewObserver.observe(card); }
  });
}

function normalizePost(p) {
  return {
    ...p,
    userId: p.user_id || p.userId,
    user: p.user,
    reactions: p.reactions || {
      gg: p.reactions_gg||0, fire: p.reactions_fire||0,
      rekt: p.reactions_rekt||0, king: p.reactions_king||0,
      epic: p.reactions_epic||0, lul: p.reactions_lul||0
    },
    comments: p.comments_count || p.comments || 0,
    reposts: p.reposts_count || p.reposts || 0,
    views: p.views ? formatNum(p.views) : '0',
  };
}

// Make renderPost accessible globally for socket updates
window.renderPost = renderPost;
window.renderComment = renderComment;

function renderPost(post) {
  const user = post.user || { id: post.user_id || post.userId, username: 'Player', avatar: '?', gradient: 'linear-gradient(135deg,#8b5cf6,#3b82f6)', rank: 'Bronze' };
  const liked = !!post.myReaction;
  const reposted = !!post.reposted;
  const reactions = post.reactions || {};
  const total = totalReactions(reactions);

  let extra = '';
  // Now playing badge
  const nowPlayingBadge = user.now_playing ? `<span class="now-playing-badge">Playing ${escapeHtml(user.now_playing)}</span>` : '';

  if (post.type === 'clip' && post.clip_url) {
    extra = `<div class="clip-video-wrapper" onclick="event.stopPropagation();openVideoPlayer(${post.id})">
      <video class="post-clip-video" preload="metadata" src="${post.clip_url}" muted></video>
      <div class="clip-video-play-overlay"><svg viewBox="0 0 24 24" width="48" height="48" fill="white" opacity="0.9"><polygon points="5,3 19,12 5,21"/></svg></div>
    </div>`;
  } else if (post.type === 'clip' && post.clip) {
    extra = `<div class="post-clip-preview">
      <div class="clip-icon"><svg viewBox="0 0 24 24"><polygon points="23,7 16,12 23,17"/><rect x="1" y="5" width="15" height="14" rx="3"/></svg></div>
      <div class="clip-info">
        <div class="clip-title">${post.clip.title}</div>
        <div class="clip-desc">${post.clip.desc}</div>
      </div>
      <button class="clip-play-btn" onclick="showToast('Playing clip!','success')">▶ Watch</button>
    </div>`;
  } else if (post.type === 'achievement' && post.achievement) {
    extra = `<div class="post-achievement">
      <div class="achievement-icon"><svg viewBox="0 0 24 24"><path d="M6 9H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h2"/><path d="M18 9h2a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2h-2"/><path d="M8 21h8M12 17v4M6 3h12v10a6 6 0 0 1-12 0V3Z"/></svg></div>
      <div class="achievement-info">
        <div class="ach-title">${post.achievement.title}</div>
        <div class="ach-game">${post.achievement.game}</div>
      </div>
    </div>`;
  }


  // Quoted post X/Twitter-style embedded card
  if (post.quotedPost) {
    const qp = post.quotedPost;
    const qu = qp.user || {};
    extra += `<div class="quoted-post-card" onclick="event.stopPropagation()">
      <div class="quoted-post-header">
        <div class="quoted-avatar-sm" style="background:${qu.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}">${qu.avatar||'?'}</div>
        <span class="quoted-username-sm">${qu.username||'Player'}</span>
        ${verifiedBadge(qu)}
        <span class="quoted-handle-sm">@${cleanHandle(qu.handle||qu.username)}</span>
        <span class="quoted-time-sm">${qp.time}</span>
      </div>
      <div class="quoted-body-sm">${qp.body||''}</div>
    </div>`;
  }

  return `<div class="post-card" id="post-${post.id}">
    <div class="post-header">
      ${avatarEl(user)}
      <div class="post-user-info">
        <div class="post-user-row">
          <span class="post-username" onclick="openUserProfile(${user.id})">${userName(user)}</span>
          ${verifiedBadge(user)}
          ${planBadge(user.plan)}
          <span class="${rankBadgeClass(user.rank)}">${user.rank||'Bronze'}</span>
          ${post.type !== 'post' ? `<span class="post-type-badge type-${post.type}">${post.type === 'clip' ? '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polygon points="23,7 16,12 23,17"/><rect x="1" y="5" width="15" height="14" rx="3"/></svg> Clip' : post.type === 'achievement' ? '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M8 21h8M12 17v4M6 3h12v10a6 6 0 0 1-12 0V3Z"/></svg> Achievement' : '<svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg> LFG'}</span>` : ''}
          ${post.game ? `<span class="post-game-tag" onclick="navigate('games')">${post.game}</span>` : ''}
          ${post.platform ? `<span class="post-platform-badge">${post.platform}</span>` : ''}
          ${nowPlayingBadge}
        </div>
        <span class="post-tag">${userHandle(user)}</span>
      </div>
      <span class="post-time">${post.time}</span>
      ${post.user_id === (window.Auth?.getUser()?.id || window.CURRENT_USER?.id) ? `<button class="post-delete-btn" title="Delete post" onclick="event.stopPropagation();deletePostReal(${post.id},this)"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6h12"/></svg></button>` : ''}
    </div>
    <div class="post-body">${parseBody(post.body)}</div>
    ${post.image_url ? `<div class="post-image-container"><img src="${post.image_url}" class="post-image" loading="lazy" onclick="openImageLightbox('${post.image_url}')"></div>` : ''}
    ${extra}
    ${post.poll ? renderPollCard(post.poll, post.id) : ''}
    <div class="post-actions">
      <button class="post-action-btn like-btn ${liked ? 'liked' : ''}" onclick="toggleLike(${post.id},this)">
        <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" ${liked?'fill="currentColor"':''}/></svg>
        <span id="like-count-${post.id}">${formatNum(total)}</span>
      </button>
      <button class="post-action-btn comment-btn" onclick="toggleComment(${post.id},this)">
        <svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg>
        <span id="comment-count-${post.id}">${post.comments}</span>
      </button>
      <div class="post-share-wrap">
        <button class="post-action-btn share-btn" onclick="toggleShareMenu(${post.id},this)">
          <svg viewBox="0 0 24 24"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          <span>${post.reposts || 0}</span>
        </button>
        <div class="share-dropdown hidden" id="share-menu-${post.id}">
          <div class="share-option" onclick="openQuoteModal(${post.id});closeAllShareMenus()"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"/></svg> Quote</div>
          <div class="share-option" onclick="boostPost(${post.id},this);closeAllShareMenus()"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 014-4h14M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 01-4 4H3"/></svg> Boost</div>
          <div class="share-option" onclick="copyPostLink(${post.id});closeAllShareMenus()"><svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg> Copy Link</div>
        </div>
      </div>
      <button class="post-action-btn views-btn">
        <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        <span>${post.views}</span>
      </button>
      <button class="post-action-btn bookmark-btn ${post.bookmarked ? 'active' : ''}" title="${post.bookmarked ? 'Remove bookmark' : 'Bookmark'}" onclick="toggleBookmark(${post.id},this)">
        <svg viewBox="0 0 24 24" fill="${post.bookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
      </button>
    </div>
  </div>`;
}

async function toggleLike(postId, btn) {
  try {
    const result = await api.reactToPost(postId, 'gg');
    const post = state.posts.find(p => p.id === postId);
    if (result.action === 'added') {
      btn.classList.add('liked');
      if (post) post.reactions.gg++;
    } else {
      btn.classList.remove('liked');
      if (post) post.reactions.gg = Math.max(0, (post.reactions.gg||0) - 1);
    }
    const span = document.getElementById(`like-count-${postId}`);
    if (span && post) span.textContent = formatNum(totalReactions(post.reactions));
  } catch {
    showToast('Failed to like', 'error', '⚠️');
  }
}

async function deletePostReal(postId, btn) {
  if (!await showConfirm('Delete this post?')) return;
  try {
    await api.deletePost(postId);
    const el = document.getElementById(`post-${postId}`);
    if (el) el.remove();
    state.posts = state.posts.filter(p => p.id !== postId);
    showToast('Post deleted', 'success');
  } catch (err) {
    showToast(err.message || 'Failed to delete', 'error');
  }
}

async function toggleAIBubble(postId, btn) {
  const bubble = document.getElementById(`ai-bubble-${postId}`);
  if (!bubble) return;
  if (!bubble.classList.contains('hidden')) { bubble.classList.add('hidden'); btn?.classList.remove('active'); return; }
  bubble.classList.remove('hidden');
  btn?.classList.add('active');
  if (bubble.dataset.loaded) return; // already fetched
  bubble.innerHTML = `<div class="ai-bubble-thinking"><span></span><span></span><span></span></div>`;
  try {
    const data = await api.askAIInsight(postId);
    const chips = (data.chips||[]).map(c => `<button class="ai-chip" onclick="injectAIChip(${postId},'${c.replace(/'/g,"\\'")}',this)">${c}</button>`).join('');
    bubble.innerHTML = `
      <div class="ai-bubble-header"><img src="/claude-avatar.svg" style="width:18px;height:18px;border-radius:50%"> <span>Claude's take</span></div>
      <div class="ai-bubble-text">${data.reply||'No insight available.'}</div>
      ${chips ? `<div class="ai-chips">${chips}</div>` : ''}`;
    bubble.dataset.loaded = '1';
  } catch {
    bubble.innerHTML = `<div class="ai-bubble-text" style="color:var(--text-muted)">Could not load AI insight.</div>`;
  }
}

function injectAIChip(postId, question, btn) {
  btn?.classList.add('used');
  // Open comment box and prefill with @Claude + the chip question
  const section = document.getElementById(`comments-${postId}`);
  if (!section || section.classList.contains('hidden')) toggleComment(postId, null);
  setTimeout(() => {
    const input = document.getElementById(`comment-input-${postId}`);
    if (input) { input.value = `@Claude ${question}`; input.focus(); }
  }, 200);
}

async function toggleComment(postId, btn) {
  // Use btn context to find the correct post card (avoids duplicate ID issues across sections)
  const postCard = btn ? btn.closest('.post-card') : document.getElementById(`post-${postId}`);
  if (!postCard) return;
  let section = postCard.querySelector('.comment-section');
  if (section) {
    section.classList.toggle('hidden');
    if (!section.classList.contains('hidden')) section.querySelector('.comment-input')?.focus();
    return;
  }
  section = document.createElement('div');
  section.className = 'comment-section';
  section.dataset.postId = postId;
  section.innerHTML = `<div style="padding:12px;text-align:center;color:var(--text-muted);font-size:13px">Loading...</div>`;
  postCard.appendChild(section);
  await loadCommentsInSection(postId, section);
}

async function loadComments(postId) {
  const section = document.getElementById(`comments-${postId}`);
  if (section) return loadCommentsInSection(postId, section);
  // fallback: find any comment section with this post ID
  const el = document.querySelector(`.comment-section[data-post-id="${postId}"]`);
  if (el) return loadCommentsInSection(postId, el);
}

async function loadCommentsInSection(postId, section) {
  if (!section) return;
  try {
    const comments = await api.getComments(postId);
    const me = window.Auth?.getUser() || window.CURRENT_USER;
    renderCommentSectionInEl(postId, comments, me, section);
    section.querySelector('.comment-input')?.focus();
  } catch {
    section.innerHTML = `<div style="padding:12px;text-align:center;color:var(--text-muted)">Could not load comments</div>`;
  }
}

const _commentSort = {};

function renderCommentSection(postId, comments, me) {
  const section = document.getElementById(`comments-${postId}`) || document.querySelector(`.comment-section[data-post-id="${postId}"]`);
  if (!section) return;
  renderCommentSectionInEl(postId, comments, me, section);
}

function renderCommentSectionInEl(postId, comments, me, section) {
  if (!section) return;
  const isLoggedIn = !!window.Auth?.getToken();
  section.innerHTML = `
    <div class="comments-list" id="comments-list-${postId}">
      ${renderSortedComments(postId, comments)}
    </div>
    ${isLoggedIn ? `<div class="comment-input-row">
      <div class="comment-avatar" style="background:${me.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};${me.avatar_url?`background-image:url('${me.avatar_url}');background-size:cover;background-position:center`:''}">${me.avatar_url?'':me.avatar||'?'}</div>
      <div class="comment-input-wrap">
        <input class="comment-input" data-post-id="${postId}" placeholder="${(window.CURRENT_USER?.plan==='plus'||window.CURRENT_USER?.plan==='pro')?'Comment… @Claude AI is active':'Comment… @Claude requires DXED+'}" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();submitComment(${postId},this)}">
        <button class="comment-submit-btn" onclick="submitComment(${postId},this)"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></button>
      </div>
    </div>` : ''}`;
  section.dataset.comments = JSON.stringify(comments);
  section.dataset.postId = postId;
}

function renderSortedComments(postId, comments) {
  let sorted = [...comments].sort((a,b) => new Date(a.created_at)-new Date(b.created_at));
  const roots = sorted.filter(c => !c.parent_id);
  const replies = sorted.filter(c => !!c.parent_id);
  if (!roots.length && !sorted.length) return '<div class="empty-comments">No comments yet — be first!</div>';
  if (!roots.length && sorted.length) return sorted.map(c => renderCommentNode(c, postId, 0, [])).join('');
  return roots.map(c => renderCommentNode(c, postId, 0, replies)).join('');
}

function renderCommentNode(c, postId, depth, allReplies) {
  const children = depth < 3 ? allReplies.filter(r => r.parent_id === c.id) : [];
  const childrenHtml = children.length
    ? `<div class="comment-thread-replies">${children.map(r => renderCommentNode(r, postId, depth+1, allReplies)).join('')}</div>`
    : '';
  return `<div class="comment-thread-item" id="ci-${c.id}">${renderCommentInner(c, postId, depth)}${childrenHtml}</div>`;
}

function setCommentSort(postId, sort) {
  _commentSort[postId] = sort;
  const section = document.getElementById(`comments-${postId}`) || document.querySelector(`.comment-section[data-post-id="${postId}"]`);
  const raw = section?.dataset.comments;
  if (!raw) return;
  const comments = JSON.parse(raw);
  const me = window.Auth?.getUser() || window.CURRENT_USER;
  renderCommentSectionInEl(postId, comments, me, section);
}

// legacy shim used by socket handler
function renderComment(c) { return renderCommentInner(c, c.post_id, 0); }

function renderCommentInner(c, postId, depth) {
  const isBot = c.user_id === 999;
  const avatarBg = `background:${c.gradient||'linear-gradient(135deg,#cc785c,#a85f45)'}`;
  const avatarContent = isBot
    ? `<img src="/claude-avatar.svg" style="width:100%;height:100%;object-fit:cover;border-radius:50%">`
    : (c.avatar||'?');
  const replyHandle = isBot ? 'Claude' : cleanHandle(c.handle||c.username||'Player');
  const threadLine = depth > 0 ? '' : ''; // thread line is handled by CSS on .comment-thread-replies
  return `
    <div class="comment-item${isBot?' comment-claude':''}${depth>0?' comment-nested':''}">
      <div class="comment-left">
        <div class="comment-avatar${isBot?' claude-comment-avatar':''}" style="${isBot?'background:transparent':avatarBg};padding:0;overflow:hidden" onclick="openUserProfile(${c.user_id})">${avatarContent}</div>
        <div class="comment-thread-line"></div>
      </div>
      <div class="comment-body">
        <div class="comment-meta">
          <span class="comment-author" onclick="openUserProfile(${c.user_id})">${c.username||'Player'}</span>
          ${isBot ? `<span class="claude-ai-badge">AI</span>` : verifiedBadge(c)}
          ${isBot ? '' : planBadge(c.plan)}
          <span class="comment-time">${c.time||'just now'}</span>
        </div>
        <div class="comment-text">${parseBody(c.body||'')}</div>
        <div class="comment-actions-micro">
          <button class="comment-reply-btn" onclick="openInlineReply(${postId},${c.id},'${replyHandle}')">Reply</button>
        </div>
        <div class="inline-reply-wrap" id="inline-reply-${c.id}"></div>
      </div>
    </div>`;
}

function openInlineReply(postId, commentId, handle) {
  const wrap = document.getElementById(`inline-reply-${commentId}`);
  if (!wrap) return;
  if (wrap.children.length) { wrap.innerHTML = ''; return; } // toggle off
  const me = window.Auth?.getUser() || window.CURRENT_USER;
  const avatarStyle = me.avatar_url
    ? `background-image:url('${me.avatar_url}');background-size:cover;background-position:center;background:${me.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}`
    : `background:${me.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}`;
  wrap.innerHTML = `
    <div class="comment-input-row inline-reply-row">
      <div class="comment-avatar" style="${avatarStyle}">${me.avatar_url?'':me.avatar||'?'}</div>
      <div class="comment-input-wrap">
        <input class="comment-input" id="inline-input-${commentId}" placeholder="Reply to @${handle}…"
          onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();submitInlineReply(${postId},${commentId},this)}"
          value="@${handle} ">
        <button class="comment-submit-btn" onclick="submitInlineReply(${postId},${commentId},document.getElementById('inline-input-${commentId}'))"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg></button>
      </div>
    </div>`;
  const input = wrap.querySelector('input');
  input?.focus();
  input?.setSelectionRange(input.value.length, input.value.length);
}

async function submitInlineReply(postId, parentId, inputEl) {
  const body = inputEl?.value?.trim();
  if (!body) return;
  inputEl.disabled = true;
  try {
    const comment = await api.addComment(postId, body, parentId);
    // inject after the parent comment node
    const parentNode = document.getElementById(`ci-${parentId}`);
    if (parentNode) {
      let repliesDiv = parentNode.querySelector('.comment-thread-replies');
      if (!repliesDiv) {
        repliesDiv = document.createElement('div');
        repliesDiv.className = 'comment-thread-replies';
        parentNode.appendChild(repliesDiv);
      }
      repliesDiv.insertAdjacentHTML('beforeend', `<div class="comment-thread-item" id="ci-${comment.id}">${renderCommentInner(comment, postId, 1)}</div>`);
    }
    // close inline composer
    document.getElementById(`inline-reply-${parentId}`)?.remove();
    if (comment._claudeGated) setTimeout(() => showUpgradePrompt('Reply with @Claude AI'), 600);
  } catch (err) {
    showToast(err.message||'Failed to reply','error','⚠️');
    inputEl.disabled = false;
  }
}

async function submitComment(postId, btnOrParentId) {
  // btnOrParentId can be a DOM element (button/input clicked) or a parentId number/null
  let section, input;
  if (btnOrParentId && typeof btnOrParentId === 'object' && btnOrParentId.nodeType) {
    section = btnOrParentId.closest('.comment-section');
    input = section?.querySelector('.comment-input[data-post-id]');
  } else {
    section = document.getElementById(`comments-${postId}`) || document.querySelector(`.comment-section[data-post-id="${postId}"]`);
    input = section?.querySelector('.comment-input[data-post-id]');
  }
  if (!input?.value.trim()) return;
  const body = input.value.trim();
  input.value = '';
  input.disabled = true;
  const parentId = (typeof btnOrParentId === 'number') ? btnOrParentId : null;
  try {
    const comment = await api.addComment(postId, body, parentId);
    const list = section?.querySelector('.comments-list');
    if (list) {
      const empty = list.querySelector('.empty-comments');
      if (empty) empty.remove();
      list.insertAdjacentHTML('beforeend', `<div class="comment-thread-item" id="ci-${comment.id}">${renderCommentInner(comment, postId, 0)}</div>`);
      list.scrollTop = list.scrollHeight;
    }
    if (comment._claudeGated) {
      setTimeout(() => showUpgradePrompt('Reply with @Claude AI in comments'), 600);
    }
    // Update all comment count spans for this post (may exist in multiple sections)
    document.querySelectorAll(`#comment-count-${postId}`).forEach(span => {
      span.textContent = (+span.textContent||0) + 1;
    });
    // update cached comments for sort
    if (section?.dataset.comments) {
      const arr = JSON.parse(section.dataset.comments);
      arr.push(comment);
      section.dataset.comments = JSON.stringify(arr);
    }
  } catch (err) {
    showToast(err.message||'Failed to comment','error','⚠️');
    input.value = body;
  } finally {
    input.disabled = false;
    input.focus();
  }
}

// ================================================================
// SHARE / BOOST / QUOTE
// ================================================================

function toggleShareMenu(postId, btn) {
  closeAllShareMenus();
  const menu = document.getElementById(`share-menu-${postId}`);
  if (menu) {
    menu.classList.toggle('hidden');
    // Position relative to button
    const rect = btn.getBoundingClientRect();
    menu.style.top = (btn.offsetTop - menu.offsetHeight - 4) + 'px';
  }
}

function closeAllShareMenus() {
  document.querySelectorAll('.share-dropdown').forEach(m => m.classList.add('hidden'));
}

document.addEventListener('click', (e) => {
  if (!e.target.closest('.post-share-wrap')) closeAllShareMenus();
  if (!e.target.closest('#sidebar-user-card') && !e.target.closest('#sidebar-user-menu')) closeSidebarMenu();
});

async function boostPost(postId) {
  try {
    const result = await api.repostPost(postId);
    showToast(result.action === 'added' ? '📢 Boosted!' : 'Boost removed', result.action === 'added' ? 'success' : 'info', '📢');
    // Update count in DOM
    const card = document.getElementById(`post-${postId}`);
    if (card) {
      const span = card.querySelector('.post-share-wrap .post-action-btn span');
      if (span) span.textContent = result.reposts || 0;
    }
  } catch { showToast('Failed to boost', 'error', '⚠️'); }
}

function copyPostLink(postId) {
  navigator.clipboard?.writeText(`${location.origin}/?post=${postId}`).catch(()=>{});
  showToast('Link copied!', 'success', '🔗');
}

// Quote Post
let _quotePostId = null;

function openQuoteModal(postId) {
  _quotePostId = postId;
  const post = state.posts.find(p => p.id === postId);
  const modal = document.getElementById('quote-modal');
  modal.classList.remove('hidden');
  const u = window.CURRENT_USER;
  document.getElementById('quote-modal-avatar').textContent = u.avatar;
  document.getElementById('quote-modal-avatar').style.background = u.gradient || '';
  document.getElementById('quote-post-text').value = '';
  document.getElementById('quote-char-count').textContent = '0';

  if (post) {
    const author = post.user || {};
    document.getElementById('quoted-post-preview').innerHTML = `
      <div class="quoted-inner">
        <div class="quoted-user">
          <div class="quoted-avatar" style="background:${author.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}">${author.avatar||'?'}</div>
          <strong>${author.username||'Player'}</strong>
          <span style="color:var(--text-muted);font-size:12px">${post.time||''}</span>
        </div>
        <div class="quoted-body">${post.body||''}</div>
      </div>`;
  }
}

function closeQuoteModal() {
  document.getElementById('quote-modal').classList.add('hidden');
  _quotePostId = null;
}

document.addEventListener('DOMContentLoaded', () => {
  const qta = document.getElementById('quote-post-text');
  if (qta) qta.addEventListener('input', () => {
    document.getElementById('quote-char-count').textContent = qta.value.length;
  });
  document.getElementById('quote-modal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('quote-modal')) closeQuoteModal();
  });
  document.getElementById('edit-profile-modal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('edit-profile-modal')) closeEditProfile();
  });
});

async function submitQuotePost() {
  const text = document.getElementById('quote-post-text').value.trim();
  if (!text) { showToast('Add your thoughts first!', 'error', '⚠️'); return; }
  const btn = document.getElementById('quote-submit-btn');
  btn.disabled = true; btn.textContent = 'Posting...';
  try {
    const quotedPost = state.posts.find(p => p.id === _quotePostId);
    await api.createPost({ body: text, type: 'post', game: quotedPost?.game || null, quoted_post_id: _quotePostId });
    closeQuoteModal();
    showToast('Post published! 🎮', 'success', '✅');
    if (state.currentSection === 'home') await renderFeed();
    else navigate('home');
  } catch (err) {
    showToast(err.message || 'Failed', 'error', '⚠️');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg> Quote Post';
  }
}

async function reactToPost(postId, reactionKey, el) {
  try {
    const result = await api.reactToPost(postId, reactionKey);
    const post = state.posts.find(p => p.id === postId);
    const span = el.querySelector('span:last-child');
    if (result.action === 'added') {
      el.classList.add('active');
      if (post) post.reactions[reactionKey]++;
      if (span && post) span.textContent = formatNum(post.reactions[reactionKey]);
      const labels = { gg:'🎮 GG!', fire:'🔥 Fire!', rekt:'💀 Rekt!', king:'👑 King!', epic:'⚡ Epic!', lul:'🤣 LUL!' };
      showToast(`Reacted: ${labels[reactionKey]}`, 'success', '🎮');
    } else {
      el.classList.remove('active');
      if (post) post.reactions[reactionKey] = Math.max(0, (post.reactions[reactionKey]||0)-1);
      if (span && post) span.textContent = formatNum(post.reactions[reactionKey]);
    }
  } catch { showToast('Failed to react', 'error', '⚠️'); }
}

function switchFeedTab(btn, tab) {
  document.querySelectorAll('#home-section .header-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.feedTab = tab;
  renderFeed();
}

// ================================================================
// POST MODAL
// ================================================================

// ================================================================
// INLINE COMPOSE BOX
// ================================================================

let _inlinePostType = 'post';

function expandComposeBox() {
  const footer = document.getElementById('compose-footer');
  const textarea = document.getElementById('compose-text');
  if (footer) footer.style.display = '';
  if (textarea) textarea.rows = 4;
}

function collapseComposeBox() {
  const footer = document.getElementById('compose-footer');
  const textarea = document.getElementById('compose-text');
  if (footer) footer.style.display = 'none';
  if (textarea) { textarea.rows = 1; textarea.value = ''; textarea.blur(); }
  const sel = document.getElementById('compose-game-tag');
  if (sel) sel.value = '';
  _inlinePostType = 'post';
  removeInlineVideo();
}

function setPostType(type) {
  _inlinePostType = type;
  showToast(`Post type: ${type}`, 'info', type === 'clip' ? '🎬' : '🏆');
}

async function submitInlinePost() {
  const textarea = document.getElementById('compose-text');
  const text = textarea?.value.trim();
  if (!text) { showToast('Write something first!', 'error', '⚠️'); return; }
  const btn = document.getElementById('compose-post-btn');
  if (btn) { btn.disabled = true; btn.textContent = 'Posting...'; }
  try {
    let image_url = null;
    let clip_url = null;
    const token = Auth.getToken();
    if (window._pendingInlineFile) {
      const form = new FormData();
      form.append('image', window._pendingInlineFile);
      const r = await fetch('/api/posts/upload-image', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: form,
      });
      const data = await r.json();
      if (data.url) image_url = data.url;
    }
    // Upload video clip if attached
    if (window._pendingInlineVideoFile) {
      btn.textContent = 'Uploading video...';
      const fd = new FormData();
      fd.append('clip', window._pendingInlineVideoFile);
      const uploadRes = await fetch('/api/posts/upload-clip', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: fd,
      });
      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err.error || 'Video upload failed');
      }
      const uploadData = await uploadRes.json();
      clip_url = uploadData.url;
    }
    const postType = window._pendingInlineVideoFile ? 'clip' : _inlinePostType;
    const newPost = await api.createPost({
      body: text,
      type: postType,
      game: document.getElementById('compose-game-tag')?.value || null,
      image_url,
      clip_url,
    });
    removeInlineVideo();
    collapseComposeBox();
    removeInlineImage();
    showToast(clip_url ? 'Clip posted! 🎬' : 'Post published! 🎮', 'success', clip_url ? '🎬' : '✅');
    if (newPost._claudeGated) setTimeout(() => showUpgradePrompt('Use @Claude AI in your posts'), 800);
    await renderFeed();
  } catch (err) {
    showToast(err.message || 'Failed to post', 'error', '⚠️');
  } finally {
    if (btn) { btn.disabled = false; btn.textContent = 'Post'; }
  }
}

function openPostModal() {
  document.getElementById('post-modal').classList.remove('hidden');
  document.getElementById('modal-post-text').focus();
}

function closePostModal() {
  document.getElementById('post-modal').classList.add('hidden');
  document.getElementById('modal-post-text').value = '';
  document.getElementById('modal-char-count').textContent = '0';
  document.getElementById('post-image-input').value = '';
  const preview = document.getElementById('post-image-preview');
  preview.innerHTML = ''; preview.classList.add('hidden');
  window._pendingPostImageUrl = null;
  removeModalVideo();
}

function handlePostImageSelect(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('post-image-preview');
    preview.classList.remove('hidden');
    preview.innerHTML = `<div class="post-img-wrap"><img src="${e.target.result}" class="post-img-thumb"><button class="post-img-remove" onclick="removePostImage()">✕</button></div>`;
    window._pendingPostFile = file;
  };
  reader.readAsDataURL(file);
}

function removePostImage() {
  document.getElementById('post-image-input').value = '';
  const preview = document.getElementById('post-image-preview');
  preview.innerHTML = ''; preview.classList.add('hidden');
  window._pendingPostFile = null;
}

function handleInlineImageSelect(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const preview = document.getElementById('inline-image-preview');
    preview.classList.remove('hidden');
    preview.innerHTML = `<div class="post-img-wrap"><img src="${e.target.result}" class="post-img-thumb"><button class="post-img-remove" onclick="removeInlineImage()">✕</button></div>`;
    window._pendingInlineFile = file;
  };
  reader.readAsDataURL(file);
}

function removeInlineImage() {
  document.getElementById('inline-image-input').value = '';
  const preview = document.getElementById('inline-image-preview');
  preview.innerHTML = ''; preview.classList.add('hidden');
  window._pendingInlineFile = null;
}

// Video clip handlers for compose areas
function handleModalVideoSelect(input) {
  const file = input.files[0];
  if (!file) return;
  if (!file.type.startsWith('video/')) {
    showToast('Only video files are allowed', 'error', '⚠️');
    input.value = '';
    return;
  }
  if (file.size > 100 * 1024 * 1024) {
    showToast('Video must be under 100MB', 'error', '⚠️');
    input.value = '';
    return;
  }
  // Remove any pending image since we're attaching video
  removePostImage();
  window._pendingModalVideoFile = file;
  const url = URL.createObjectURL(file);
  const preview = document.getElementById('modal-video-preview');
  const video = document.getElementById('modal-video-el');
  video.src = url;
  preview.classList.remove('hidden');
  // Auto-set post type to clip
  const typeSelect = document.getElementById('modal-post-type');
  if (typeSelect) typeSelect.value = 'clip';
  // Check duration
  video.onloadedmetadata = () => {
    if (video.duration > 60) {
      showToast('Clip must be 60 seconds or shorter', 'error', '⚠️');
      removeModalVideo();
    }
  };
  showToast('Video clip attached! 🎬', 'success', '🎬');
}

function removeModalVideo() {
  const input = document.getElementById('modal-video-input');
  if (input) input.value = '';
  const preview = document.getElementById('modal-video-preview');
  if (preview) { preview.classList.add('hidden'); }
  const video = document.getElementById('modal-video-el');
  if (video) video.src = '';
  window._pendingModalVideoFile = null;
}

function handleInlineVideoSelect(input) {
  const file = input.files[0];
  if (!file) return;
  if (!file.type.startsWith('video/')) {
    showToast('Only video files are allowed', 'error', '⚠️');
    input.value = '';
    return;
  }
  if (file.size > 100 * 1024 * 1024) {
    showToast('Video must be under 100MB', 'error', '⚠️');
    input.value = '';
    return;
  }
  // Remove any pending image since we're attaching video
  removeInlineImage();
  window._pendingInlineVideoFile = file;
  const url = URL.createObjectURL(file);
  const preview = document.getElementById('inline-video-preview');
  const video = document.getElementById('inline-video-el');
  video.src = url;
  preview.classList.remove('hidden');
  _inlinePostType = 'clip';
  // Check duration
  video.onloadedmetadata = () => {
    if (video.duration > 60) {
      showToast('Clip must be 60 seconds or shorter', 'error', '⚠️');
      removeInlineVideo();
    }
  };
  showToast('Video clip attached! 🎬', 'success', '🎬');
}

function removeInlineVideo() {
  const input = document.getElementById('inline-video-input');
  if (input) input.value = '';
  const preview = document.getElementById('inline-video-preview');
  if (preview) { preview.classList.add('hidden'); }
  const video = document.getElementById('inline-video-el');
  if (video) video.src = '';
  window._pendingInlineVideoFile = null;
  _inlinePostType = 'post';
}

document.addEventListener('DOMContentLoaded', () => {
  const textarea = document.getElementById('modal-post-text');
  if (textarea) {
    textarea.addEventListener('input', () => {
      document.getElementById('modal-char-count').textContent = textarea.value.length;
    });
  }
  document.getElementById('post-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('post-modal')) closePostModal();
  });
  document.getElementById('profile-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('profile-modal')) closeProfileModal();
  });
});

async function submitModalPost() {
  const text = document.getElementById('modal-post-text').value.trim();
  if (!text) { showToast('Write something first!', 'error', '⚠️'); return; }
  const btn = document.getElementById('modal-submit-btn');
  btn.disabled = true; btn.textContent = 'Posting...';

  try {
    let image_url = null;
    let clip_url = null;
    const token = Auth.getToken();
    if (window._pendingPostFile) {
      const form = new FormData();
      form.append('image', window._pendingPostFile);
      const r = await fetch('/api/posts/upload-image', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: form,
      });
      const data = await r.json();
      if (data.url) image_url = data.url;
    }
    // Upload video clip if attached
    if (window._pendingModalVideoFile) {
      btn.textContent = 'Uploading video...';
      const fd = new FormData();
      fd.append('clip', window._pendingModalVideoFile);
      const uploadRes = await fetch('/api/posts/upload-clip', {
        method: 'POST',
        headers: { 'Authorization': 'Bearer ' + token },
        body: fd,
      });
      if (!uploadRes.ok) {
        const err = await uploadRes.json().catch(() => ({}));
        throw new Error(err.error || 'Video upload failed');
      }
      const uploadData = await uploadRes.json();
      clip_url = uploadData.url;
    }
    const postType = window._pendingModalVideoFile ? 'clip' : document.getElementById('modal-post-type').value;
    const newPost = await api.createPost({
      body: text,
      type: postType,
      game: document.getElementById('modal-game-tag').value || null,
      platform: document.getElementById('modal-platform').value || null,
      image_url,
      clip_url,
    });
    removeModalVideo();
    closePostModal();
    showToast(clip_url ? 'Clip posted! 🎬' : 'Post published! 🎮', 'success', clip_url ? '🎬' : '✅');
    if (newPost._claudeGated) {
      setTimeout(() => showUpgradePrompt('Use @Claude AI in your posts'), 800);
    }
    // Stay on current section and refresh it
    if (state.currentSection === 'profile') {
      loadProfile();
    } else if (state.currentSection === 'home') {
      await renderFeed();
    } else {
      navigate('home');
    }
  } catch (err) {
    showToast(err.message || 'Failed to post', 'error', '⚠️');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg> Post';
  }
}

function openLFGModal() {
  if (!Auth.isLoggedIn()) { showAuthModal('login'); return; }
  const modal = document.getElementById('lfg-modal');
  if (!modal) return;
  // Populate game dropdown with live games
  _populateGameDropdowns();
  // Pre-fill region from user profile
  const region = document.getElementById('lfg-region');
  if (region && window.CURRENT_USER?.region) region.value = window.CURRENT_USER.region;
  document.getElementById('lfg-create-error').style.display = 'none';
  document.getElementById('lfg-submit-btn').textContent = 'Post LFG';
  document.getElementById('lfg-submit-btn').disabled = false;
  modal.classList.remove('hidden');
}

function closeLFGModal() {
  const modal = document.getElementById('lfg-modal');
  if (modal) modal.classList.add('hidden');
}

function initLFGModal() {
  const form = document.getElementById('lfg-create-form');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = document.getElementById('lfg-submit-btn');
    const errEl = document.getElementById('lfg-create-error');
    errEl.style.display = 'none';
    btn.textContent = 'Posting…'; btn.disabled = true;
    try {
      await api.createLFG({
        game:        document.getElementById('lfg-game').value,
        mode:        document.getElementById('lfg-mode').value,
        rank_req:    document.getElementById('lfg-rank-req').value,
        region:      document.getElementById('lfg-region').value,
        slots:       parseInt(document.getElementById('lfg-slots').value),
        description: document.getElementById('lfg-description').value.trim(),
      });
      closeLFGModal();
      form.reset();
      showToast('LFG posted! 🎮', 'success', '👥');
      if (state.currentSection === 'lfg') loadLFG();
    } catch (err) {
      errEl.textContent = err.message || 'Failed to post LFG';
      errEl.style.display = 'block';
      btn.textContent = 'Post LFG'; btn.disabled = false;
    }
  });
}

// ================================================================
// EXPLORE
// ================================================================

function loadExplore() {
  renderExploreContent('trending');
}

function switchExploreTab(btn, tab) {
  document.querySelectorAll('#explore-section .explore-tabs .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.exploreTab = tab;
  renderExploreContent(tab);
}

async function renderExploreContent(tab) {
  const container = document.getElementById('explore-content');
  if (tab === 'trending') {
    container.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading trending games...</div>`;
    let games = _liveGames.length ? _liveGames : [];
    if (!games.length) {
      try { games = await api.getTrendingGames(20); _liveGames = games; _populateGameDropdowns(); }
      catch { games = []; }
    }
    if (!games.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">📈</div><p>No trending data yet</p><span>Games load on first sync — check back soon!</span></div>`;
      return;
    }
    const top20 = games.slice(0, 20);
    container.innerHTML = `<div class="trending-section">
      ${top20.map((g, i) => {
        const viewers = g.twitch_viewers || 0;
        const viewersLabel = viewers > 0 ? `🔴 ${formatNum(viewers)} viewers live` : `${g.rating_count ? formatNum(g.rating_count) + ' ratings' : 'Trending'}`;
        const safeIdx = _liveGames.indexOf(g);
        return `
        <div class="trending-item" style="cursor:pointer" onclick="${safeIdx >= 0 ? `navigate('games');openGameCommunity(${safeIdx})` : `showToast('Exploring ${g.name.replace(/'/g,"\\'")}!','info','🎮')`}">
          <div class="trending-rank">${i+1}</div>
          ${g.cover_url
            ? `<img src="${g.cover_url.replace('t_cover_big','t_thumb')}" style="width:40px;height:40px;object-fit:cover;border-radius:8px;flex-shrink:0" alt="${g.name}">`
            : `<div class="trending-game-icon">🎮</div>`}
          <div class="trending-info">
            <div class="trending-name">${g.name}</div>
            <div class="trending-posts">${viewersLabel}</div>
          </div>
          <div class="trending-change up">↑</div>
        </div>`;
      }).join('')}
    </div>`;
  } else if (tab === 'clips') {
    container.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading clips...</div>`;
    try {
      const posts = await api.getFeed('for-you');
      const clips = posts.filter(p => p.type === 'clip').map(normalizePost);
      container.innerHTML = clips.length
        ? clips.map(renderPost).join('')
        : `<div class="empty-state"><div class="empty-icon">🎬</div><p>No clips yet</p><span>Be the first to post a clip!</span></div>`;
    } catch {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load clips</p></div>`;
    }
  } else if (tab === 'players') {
    container.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading players...</div>`;
    try {
      const users = await api.getUsers();
      container.innerHTML = `<div style="padding:16px 20px;display:flex;flex-direction:column;gap:10px;">
        ${users.map(u => `
          <div style="display:flex;align-items:center;gap:12px;padding:14px;background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:all .2s" onclick="openUserProfile(${u.id})" onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='var(--border)'">
            <div class="post-avatar" style="background:${u.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};width:50px;height:50px;font-size:18px">${u.avatar||'?'}</div>
            <div style="flex:1">
              <div style="font-weight:800;font-size:15px;display:flex;align-items:center;gap:6px">${u.username||'Player'} ${verifiedBadge(u)} ${planBadge(u.plan)}</div>
              <div style="font-size:13px;color:var(--text-muted)">@${cleanHandle(u.handle||u.username)} · ${formatNum(u.followers||0)} followers</div>
              <div style="font-size:12px;color:var(--text-secondary);margin-top:4px">${u.online ? '🟢 Online' : '⚫ Offline'}</div>
            </div>
            <span class="${rankBadgeClass(u.rank)}">${u.rank||'Bronze'}</span>
            <button class="btn-primary btn-sm" onclick="event.stopPropagation();toggleFollow(${u.id},this)">Follow</button>
          </div>`).join('')}
      </div>`;
    } catch {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load players</p></div>`;
    }
  } else {
    const news = [
      { title:'Valorant Episode 9 Act 2 launches with new Agent Thorn', desc:'Riot drops massive patch including map rework and new tactical ability system.', icon:'🎯', time:'1h ago' },
      { title:'Minecraft 1.21.5 drops with new cave biomes and mobs', desc:'The "Deep Darkness" update is finally here with 4 new biomes and 12 new mobs.', icon:'⛏️', time:'3h ago' },
      { title:'CS2 Major results: Team Vitality claim back-to-back trophies', desc:'Historic run ends in 2-0 sweep of NaVi in Copenhagen finals.', icon:'💣', time:'5h ago' },
      { title:'Elden Ring DLC "Shattered Realms" announced for Q3', desc:'FromSoftware teases a 30+ hour expansion with 8 new Legacy Dungeons.', icon:'⚱️', time:'8h ago' },
    ];
    container.innerHTML = `<div style="padding:16px 20px;display:flex;flex-direction:column;gap:12px;">
      ${news.map(n => `
        <div style="background:var(--bg-card);border:1px solid var(--border);border-radius:var(--radius);padding:16px;cursor:pointer;display:flex;gap:14px;transition:all .2s" onmouseenter="this.style.borderColor='var(--accent)'" onmouseleave="this.style.borderColor='var(--border)'">
          <div style="font-size:36px;flex-shrink:0">${n.icon}</div>
          <div>
            <div style="font-weight:800;font-size:14px;margin-bottom:6px">${n.title}</div>
            <div style="font-size:13px;color:var(--text-secondary);line-height:1.5">${n.desc}</div>
            <div style="font-size:12px;color:var(--text-muted);margin-top:8px">📰 ${n.time}</div>
          </div>
        </div>`).join('')}
    </div>`;
  }
}

async function searchExplore(val) {
  if (!val) { renderExploreContent(state.exploreTab); return; }
  const container = document.getElementById('explore-content');
  container.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Searching...</div>`;
  try {
    const posts = await api.getFeed('for-you');
    const v = val.toLowerCase();
    const results = posts.filter(p => p.body.toLowerCase().includes(v) || (p.game||'').toLowerCase().includes(v)).map(normalizePost);
    container.innerHTML = results.length
      ? results.map(renderPost).join('')
      : `<div class="empty-state"><div class="empty-icon">🔍</div><p>No results for "${val}"</p><span>Try a different search term</span></div>`;
  } catch {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Search failed</p></div>`;
  }
}

// ================================================================
// GAMES
// ================================================================

// Live games cache (updated on loadGames)
let _liveGames = [];

async function loadGames() {
  const grid = document.getElementById('games-grid');
  if (grid) grid.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading games...</div>`;
  try {
    const result = await api.getTrendingGames(500);
    if (result && result.length > 0) {
      _liveGames = result;
    } else {
      // API returned empty — use static catalog
      _liveGames = _staticFallbackGames();
    }
  } catch {
    // Network/API error — use static catalog
    _liveGames = _staticFallbackGames();
  }
  renderGamesGrid(state.gamesFilter);
  _populateGameDropdowns();
}

function _staticFallbackGames() {
  return GAMES.map(g => ({
    igdb_id: g.id, name: g.name, genres: g.category,
    cover_url: null, igdb_rating: Math.round(parseFloat(g.rating)*10),
    twitch_viewers: 0, trending_score: 0, _icon: g.icon, _color: g.color,
  }));
}

function _gameCard(g) {
  const name = g.name || '';
  const cover = g.cover_url;
  const icon = g._icon || '🎮';
  const genre = g.genres || g.category || '';
  const rating = g.igdb_rating ? (g.igdb_rating / 10).toFixed(1) : '—';
  const viewers = g.twitch_viewers > 0
    ? (g.twitch_viewers >= 1000 ? (g.twitch_viewers/1000).toFixed(1)+'K' : g.twitch_viewers) + ' watching'
    : '';
  const igdbId = g.igdb_id || g.id;
  const isFollowing = state.followedGames.includes(igdbId);
  const coverStyle = cover
    ? `background:url('${cover}') center/cover`
    : `background:linear-gradient(135deg,${g._color||'#8b5cf6'}22,${g._color||'#3b82f6'}44)`;

  const safeIdx = _liveGames.indexOf(g);

  return `
    <div class="game-card" onclick="openGameCommunity(${safeIdx})">
      <div class="game-cover" style="${coverStyle}">
        ${cover ? '' : `<span style="font-size:2.5rem">${icon}</span>`}
        <button class="game-follow-btn ${isFollowing?'following':''}"
          onclick="event.stopPropagation();toggleFollowGame(${igdbId},'${name.replace(/'/g,'&#39;')}',this)">
          ${isFollowing ? '✓ Following' : '+ Follow'}
        </button>
      </div>
      <div class="game-info">
        <div class="game-title">${name}</div>
        <div class="game-genre">${genre}</div>
        <div class="game-stats">
          ${viewers ? `<span class="game-players">🔴 ${viewers}</span>` : ''}
          ${rating !== '—' ? `<span class="game-rating">⭐ ${rating}</span>` : ''}
        </div>
      </div>
    </div>`;
}

function renderGamesGrid(filter) {
  const search = (document.getElementById('games-search')?.value || '').toLowerCase();
  let games = _liveGames.length ? _liveGames : GAMES.map(g => ({
    igdb_id: g.id, name: g.name, genres: g.category, _icon: g.icon, _color: g.color,
    igdb_rating: Math.round(parseFloat(g.rating)*10), twitch_viewers: 0,
  }));

  if (filter && filter !== 'all') {
    // Map filter button values → IGDB genre keywords
    const GENRE_MAP = {
      'fps':          ['shooter'],
      'moba':         ['real time strategy', 'moba'],
      'battle-royale':['shooter', 'battle'],
      'rpg':          ['role-playing', 'rpg'],
      'sandbox':      ['simulator', 'adventure', 'platform', 'sandbox'],
      'strategy':     ['strategy', 'turn-based', 'tactical'],
    };
    const keywords = GENRE_MAP[filter] || [filter.toLowerCase()];
    games = games.filter(g => {
      const genres = (g.genres || '').toLowerCase();
      return keywords.some(k => genres.includes(k));
    });
  }
  if (search) games = games.filter(g => g.name.toLowerCase().includes(search));

  const grid = document.getElementById('games-grid');
  if (grid) grid.innerHTML = games.length ? games.map(_gameCard).join('') :
    `<div style="padding:40px;text-align:center;color:var(--text-muted)">No games found</div>`;
}

function filterGames(btn, filter) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  state.gamesFilter = filter;
  renderGamesGrid(filter);
}

function searchGames(val) { renderGamesGrid(state.gamesFilter); }

function toggleFollowGame(id, name, btn) {
  const idx = state.followedGames.indexOf(id);
  if (idx === -1) {
    state.followedGames.push(id);
    if (btn) { btn.textContent = '✓ Following'; btn.classList.add('following'); }
    showToast(`Following ${name}!`, 'success', '🎮');
  } else {
    state.followedGames.splice(idx, 1);
    if (btn) { btn.textContent = '+ Follow'; btn.classList.remove('following'); }
  }
  saveState();
}

// ================================================================
// GAME COMMUNITY PAGES
// ================================================================

function openGameCommunity(idx) {
  const game = _liveGames[idx];
  if (!game) return;

  const listView = document.getElementById('games-list-view');
  const commView = document.getElementById('games-community-view');
  if (!listView || !commView) return;

  listView.style.display = 'none';
  commView.style.display = 'block';

  const igdbId = game.igdb_id || game.id;
  const isFollowing = state.followedGames.includes(igdbId);
  const viewers = game.twitch_viewers > 0
    ? (game.twitch_viewers >= 1000 ? (game.twitch_viewers / 1000).toFixed(1) + 'K' : game.twitch_viewers) + ' watching live'
    : null;
  const rating = game.igdb_rating ? (game.igdb_rating / 10).toFixed(1) : null;
  const safeName = game.name.replace(/'/g, '&#39;').replace(/"/g, '&quot;');

  commView.innerHTML = `
    <div class="gc-hero" style="${game.cover_url ? `background-image:url('${game.cover_url}')` : `background:linear-gradient(135deg,#0f0c29,#302b63,#24243e)`}">
      <div class="gc-hero-overlay"></div>
      <button class="gc-back-btn" onclick="closeCommunity()">← All Games</button>
      <div class="gc-hero-content">
        <div class="gc-hero-left">
          ${game.cover_url ? `<img class="gc-cover-thumb" src="${game.cover_url}" alt="${safeName}">` : `<div class="gc-cover-thumb gc-cover-placeholder">${game._icon||'🎮'}</div>`}
          <div class="gc-hero-info">
            <h1 class="gc-title">${game.name}</h1>
            <div class="gc-genres">${(game.genres||'').split(', ').map(g=>`<span class="gc-genre-chip">${g}</span>`).join('')}</div>
            ${viewers ? `<div class="gc-live-badge">🔴 ${viewers} on Twitch</div>` : ''}
            ${game.release_date ? `<div class="gc-release">📅 Released ${new Date(game.release_date).getFullYear()}</div>` : ''}
          </div>
        </div>
        <div class="gc-hero-right">
          ${rating ? `<div class="gc-rating-big">⭐ ${rating}<span>/10</span></div>` : ''}
          <button class="gc-follow-btn ${isFollowing ? 'following' : ''}"
            onclick="toggleFollowGame(${igdbId},'${safeName}',this)">
            ${isFollowing ? '✓ Following' : '+ Follow Community'}
          </button>
        </div>
      </div>
    </div>
    <div class="gc-tabs-bar">
      <button class="gc-tab active" onclick="switchGameTab(this,'feed')">📝 Community Feed</button>
      <button class="gc-tab" onclick="switchGameTab(this,'lfg')">🎮 Find Players</button>
      <button class="gc-tab" onclick="switchGameTab(this,'about')">ℹ️ About</button>
    </div>
    <div id="gc-content" class="gc-content"></div>
  `;

  // Store for tab switching
  commView._game = game;
  _loadGameTab('feed', game);
}

function closeCommunity() {
  const listView = document.getElementById('games-list-view');
  const commView = document.getElementById('games-community-view');
  if (listView) listView.style.display = '';
  if (commView) { commView.style.display = 'none'; commView.innerHTML = ''; }
}

function switchGameTab(btn, tab) {
  document.querySelectorAll('.gc-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const commView = document.getElementById('games-community-view');
  _loadGameTab(tab, commView?._game);
}

async function _loadGameTab(tab, game) {
  const content = document.getElementById('gc-content');
  if (!content || !game) return;

  if (tab === 'feed') {
    content.innerHTML = `<div class="gc-loading">Loading posts...</div>`;
    try {
      const posts = await api.getFeed('for-you', game.name);
      const normalized = (posts || []).map(normalizePost);
      content.innerHTML = normalized.length
        ? normalized.map(renderPost).join('')
        : `<div class="empty-state"><div class="empty-icon">📝</div><p>No posts for ${game.name} yet</p><span>Tag this game when you post to be the first!</span></div>`;
    } catch {
      content.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load posts</p></div>`;
    }

  } else if (tab === 'lfg') {
    content.innerHTML = `<div class="gc-loading">Loading parties...</div>`;
    try {
      const posts = await api.getLFG(game.name);
      if (!posts || !posts.length) {
        content.innerHTML = `<div class="empty-state"><div class="empty-icon">🎮</div><p>No LFG parties for ${game.name}</p><span>Head to the LFG section to create one!</span></div>`;
        return;
      }
      content.innerHTML = `<div class="lfg-grid">${posts.map(p => {
        const user = p.user || { username: 'Player', avatar: '?', gradient: 'linear-gradient(135deg,#8b5cf6,#3b82f6)', rank: 'Bronze' };
        const filled = p.filled || 1;
        const slots = p.slots || 5;
        const slotsHtml = Array.from({length: slots}, (_,i) => `<div class="slot-dot ${i < filled ? 'filled' : ''}"></div>`).join('');
        return `<div class="lfg-card">
          <div class="lfg-header">
            <div class="lfg-user-info">
              <div class="lfg-avatar" style="background:${user.gradient}">${user.avatar}</div>
              <div><div class="lfg-username">${user.username}</div><div class="lfg-rank-region">${user.rank} · ${p.region||'NA'}</div></div>
            </div>
            <div class="lfg-status lfg-${p.status||'open'}">${p.status==='full'?'Full':p.status==='filling'?'Filling':'Open'}</div>
          </div>
          <div class="lfg-game-row"><span class="lfg-game-name">${p.game}</span><span class="lfg-mode">· ${p.mode||'Ranked'}</span></div>
          <div class="lfg-description">${p.description||''}</div>
          <div class="lfg-footer">
            <div class="lfg-slots"><div class="slot-dots">${slotsHtml}</div><span style="font-size:12px;color:var(--text-muted)">${filled}/${slots} filled</span></div>
            <button class="lfg-join-btn" ${p.status==='full'?'disabled':''} onclick="joinLFGReal(${p.id},this)">
              ${p.isMember?'✓ Joined':p.status==='full'?'Full':'⚡ Join Party'}
            </button>
          </div>
        </div>`;
      }).join('')}</div>`;
    } catch {
      content.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load parties</p></div>`;
    }

  } else if (tab === 'about') {
    const year = game.release_date ? new Date(game.release_date).getFullYear() : null;
    content.innerHTML = `
      <div class="gc-about">
        <div class="gc-about-card">
          ${game.cover_url ? `<img class="gc-about-cover" src="${game.cover_url}" alt="${game.name}">` : ''}
          <div class="gc-about-details">
            <div class="gc-about-row"><span>Genre</span><strong>${game.genres || 'Unknown'}</strong></div>
            ${year ? `<div class="gc-about-row"><span>Released</span><strong>${year}</strong></div>` : ''}
            ${game.igdb_rating ? `<div class="gc-about-row"><span>IGDB Rating</span><strong>⭐ ${(game.igdb_rating/10).toFixed(1)} / 10</strong></div>` : ''}
            ${game.rating_count ? `<div class="gc-about-row"><span>Ratings</span><strong>${game.rating_count.toLocaleString()} reviews</strong></div>` : ''}
            ${game.twitch_viewers ? `<div class="gc-about-row"><span>Live Now</span><strong>🔴 ${game.twitch_viewers.toLocaleString()} viewers on Twitch</strong></div>` : ''}
          </div>
        </div>
        ${game.summary ? `<p class="gc-summary">${game.summary}</p>` : ''}
        ${game.steam_url ? `<a class="gc-steam-btn" href="${game.steam_url}" target="_blank" rel="noopener">🛒 Buy on Steam</a>` : ''}
      </div>`;
  }
}

function _populateGameDropdowns() {
  const names = _liveGames.length
    ? _liveGames.map(g => g.name)
    : GAMES.map(g => g.name);

  // Post composer dropdowns
  ['compose-game-tag', 'modal-game-tag'].forEach(id => {
    const sel = document.getElementById(id);
    if (!sel) return;
    const cur = sel.value;
    sel.innerHTML = `<option value="">Tag a game...</option>` +
      names.map(n => `<option value="${n}">${n}</option>`).join('');
    if (cur) sel.value = cur;
  });

  // LFG game filter (main section)
  const lfgFilter = document.getElementById('lfg-game-filter');
  if (lfgFilter) {
    const cur = lfgFilter.value;
    lfgFilter.innerHTML = `<option value="">All Games</option>` +
      names.map(n => `<option value="${n}">${n}</option>`).join('');
    if (cur) lfgFilter.value = cur;
  }

  // LFG create modal game select
  const lfgGame = document.getElementById('lfg-game');
  if (lfgGame) {
    const cur = lfgGame.value;
    lfgGame.innerHTML = `<option value="">Select Game</option>` +
      names.map(n => `<option value="${n}">${n}</option>`).join('');
    if (cur) lfgGame.value = cur;
  }
}

// ================================================================
// LFG
// ================================================================

async function loadLFG() {
  const container = document.getElementById('lfg-container');
  container.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading LFG posts...</div>`;
  try {
    const game = document.getElementById('lfg-game-filter')?.value || '';
    const posts = await api.getLFG(game);
    renderLFGCards(posts);
  } catch {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load LFG posts</p><span>Make sure the server is running</span></div>`;
  }
}

function renderLFG(gameFilter) { loadLFG(); }
function filterLFG(val) { loadLFG(); }

function renderLFGCards(posts) {
  const container = document.getElementById('lfg-container');
  if (!posts.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">👥</div><p>No LFG posts yet</p><span>Be the first to create one!</span></div>`;
    return;
  }
  container.innerHTML = posts.map(p => {
    const user = p.user || { username: 'Player', avatar: '?', gradient: 'linear-gradient(135deg,#8b5cf6,#3b82f6)', rank: 'Bronze' };
    const filled = p.filled || 1;
    const slots = p.slots || 5;
    const slotsHtml = Array.from({length:slots}, (_,i) =>
      `<div class="slot-dot ${i < filled ? 'filled' : ''}"></div>`
    ).join('');
    const userPlan = user.plan || 'free';
    const priorityStar = (userPlan === 'pro' || userPlan === 'plus') ? '<span class="lfg-priority-star" title="Priority listing">★</span>' : '';
    return `<div class="lfg-card">
      <div class="lfg-header">
        <div class="lfg-user-info">
          <div class="lfg-avatar" style="background:${user.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}">${user.avatar||'?'}</div>
          <div>
            <div class="lfg-username">${user.username||user.name||'Player'}${priorityStar} ${planBadge(userPlan)}</div>
            <div class="lfg-rank-region">${user.rank||'?'} · ${p.region||'NA'}</div>
          </div>
        </div>
        <div class="lfg-status lfg-${p.status||'open'}">${p.status==='full'?'Full':p.status==='filling'?'Filling':'Open'}</div>
      </div>
      <div class="lfg-game-row"><span class="lfg-game-name">${p.game}</span><span class="lfg-mode">· ${p.mode||'Ranked'}</span></div>
      <div class="lfg-description">${p.description||p.desc||''}</div>
      <div class="lfg-footer">
        <div class="lfg-slots"><div class="slot-dots">${slotsHtml}</div><span style="font-size:12px;color:var(--text-muted)">${filled}/${slots} filled</span></div>
        ${p.isHost ? `<button class="lfg-delete-btn" onclick="deleteLFGReal(${p.id})">Delete</button>` : ''}
        <button class="lfg-join-btn" ${p.status==='full'||p.isHost?'disabled':''} onclick="joinLFGReal(${p.id},this)">
          ${p.isHost?'Your Party':p.isMember?'Joined':p.status==='full'?'Full':'Join'}
        </button>
      </div>
    </div>`;
  }).join('');
}

async function deleteLFGReal(id) {
  if (!await showConfirm('Delete this LFG post?')) return;
  try {
    await api.deleteLFG(id);
    showToast('LFG post deleted', 'success');
    loadLFG();
  } catch (err) { showToast(err.message || 'Failed to delete', 'error'); }
}

async function joinLFGReal(id, btn) {
  try {
    const result = await api.joinLFG(id);
    showToast(result.action==='joined'?`Joined the party! 🎮 ${result.game||''}`:'Left the party', result.action==='joined'?'success':'info', '👥');
    loadLFG();
  } catch (err) { showToast(err.message||'Failed to join', 'error', '⚠️'); }
}

// ================================================================
// TOURNAMENTS
// ================================================================

function loadTournaments() {
  const container = document.getElementById('tournaments-container');
  const plan = window.CURRENT_USER?.plan || 'free';
  const canHost = plan === 'pro';
  container.innerHTML = `
    <div class="maintenance-screen">
      <div class="maintenance-icon">🔧</div>
      <h2 class="maintenance-title">Tournaments Under Maintenance</h2>
      <p class="maintenance-desc">We're building something epic. Tournament brackets, live brackets, prize pools, and team management are coming soon.</p>
      <div class="maintenance-features">
        <div class="maintenance-feature">🏆 Prize Pool Tournaments</div>
        <div class="maintenance-feature">📊 Live Bracket Tracking</div>
        <div class="maintenance-feature">👥 Team Registration</div>
        <div class="maintenance-feature">📺 Match Streaming</div>
      </div>
      <p class="maintenance-eta">Expected launch: Q2 2026</p>
      ${!canHost ? `<div style="margin-top:16px;padding:12px;background:rgba(139,92,246,0.1);border:1px solid rgba(139,92,246,0.3);border-radius:var(--radius);font-size:13px;text-align:center">
        🏆 Tournament hosting will be a <strong>DXED Pro</strong> exclusive feature.
        <button class="btn-primary" style="margin-left:8px;font-size:12px;padding:4px 12px" onclick="navigate('plans')">Upgrade</button>
      </div>` : ''}
    </div>`;
}

// ================================================================
// MESSAGES
// ================================================================

async function openDirectMessage(userId) {
  navigate('messages');
  // Wait for DOM to be ready, then open the conversation
  setTimeout(async () => {
    try {
      const user = await api.getUser(userId);
      state.currentConversation = userId;
      await selectConversationAPI(userId, user);
    } catch {
      showToast('Could not open conversation', 'error');
    }
  }, 100);
}

async function loadMessages() {
  const list = document.getElementById('conversations-list');
  const header = document.getElementById('chat-header');
  list.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted)">Loading...</div>`;
  // Mobile: reset to show list, hide chat
  if (window.innerWidth <= 560) {
    document.querySelector('.messages-sidebar')?.classList.remove('msg-sidebar-hidden');
    document.querySelector('.messages-chat')?.classList.add('msg-chat-hidden');
  }
  try {
    const conversations = await api.getConversations();
    renderConversationsFromAPI(conversations);
    if (conversations.length) {
      const firstId = conversations[0].other_id;
      state.currentConversation = firstId;
      await selectConversationAPI(firstId, conversations[0].user);
    } else {
      header.innerHTML = `<div style="color:var(--text-muted);padding:12px">No conversations yet. Follow someone and message them!</div>`;
    }
  } catch {
    list.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted)">Could not load messages</div>`;
    header.innerHTML = `<div style="color:var(--text-muted);padding:12px">Server offline</div>`;
  }
}

function renderConversationsFromAPI(conversations) {
  const list = document.getElementById('conversations-list');
  if (!conversations.length) {
    list.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted)">No conversations yet</div>`;
    return;
  }
  list.innerHTML = conversations.map(c => {
    const user = c.user;
    return `<div class="conv-item ${c.other_id === state.currentConversation ? 'active' : ''}" data-uid="${c.other_id}" onclick="selectConversationAPI(${c.other_id})">
      <div class="conv-avatar" style="background:${user?.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}" data-uid="${c.other_id}">
        ${user?.avatar||'?'}
        ${user?.online ? '<div class="conv-online-dot"></div>' : ''}
      </div>
      <div class="conv-info">
        <div class="conv-name">${user?.username||'Unknown'}</div>
        <div class="conv-last-msg">${c.last_msg||''}</div>
      </div>
      <div class="conv-meta">
        <div class="conv-time">${c.time||''}</div>
        ${c.unread ? `<div class="conv-unread">${c.unread}</div>` : ''}
      </div>
    </div>`;
  }).join('');
}

async function selectConversationAPI(userId, userObj) {
  state.currentConversation = userId;
  let user = userObj;
  if (!user) {
    try { user = await api.getUser(userId); } catch { user = { username:'User', avatar:'?', gradient:'linear-gradient(135deg,#8b5cf6,#3b82f6)', online:false }; }
  }
  document.getElementById('chat-header').innerHTML = `
    <button class="msg-back-btn" onclick="msgShowList()">
      <svg viewBox="0 0 24 24"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
      Back
    </button>
    <div class="conv-avatar" style="background:${user.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};width:40px;height:40px">${user.avatar||'?'}</div>
    <div>
      <div style="font-weight:800;font-size:14px">${user.username||'User'}</div>
      <div style="font-size:12px;color:${user.online?'var(--accent-green)':'var(--text-muted)'}">
        ${user.online ? '🟢 Online' : '⚫ Offline'}
      </div>
    </div>`;
  // Mobile: show chat, hide conversation list
  if (window.innerWidth <= 560) {
    document.querySelector('.messages-sidebar')?.classList.add('msg-sidebar-hidden');
    document.querySelector('.messages-chat')?.classList.remove('msg-chat-hidden');
  }
  // Update active conversation in list
  document.querySelectorAll('.conv-item').forEach(el => {
    el.classList.toggle('active', +el.dataset.uid === userId);
  });
  try {
    const msgs = await api.getMessages(userId);
    const chatEl = document.getElementById('chat-messages');
    chatEl.innerHTML = msgs.length ? msgs.map(m => `
      <div class="chat-msg ${m.mine ? 'mine' : ''}">
        <div class="chat-msg-avatar" style="background:${m.gradient||user.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}">${m.avatar||'?'}</div>
        <div>
          <div class="chat-msg-bubble">${m.text}</div>
          <div class="chat-msg-time">${m.time}</div>
        </div>
      </div>`).join('') : `<div style="padding:40px;text-align:center;color:var(--text-muted)">No messages yet. Say hi!</div>`;
    chatEl.scrollTop = chatEl.scrollHeight;
  } catch {}
}

function appendChatMessage(msg, mine) {
  const chatEl = document.getElementById('chat-messages');
  const u = window.CURRENT_USER;
  const div = document.createElement('div');
  div.className = `chat-msg ${mine ? 'mine' : ''}`;
  div.innerHTML = `
    <div class="chat-msg-avatar" style="background:${mine ? u.gradient : msg.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}">${mine ? u.avatar : msg.avatar||'?'}</div>
    <div>
      <div class="chat-msg-bubble">${msg.text}</div>
      <div class="chat-msg-time">${msg.time||'just now'}</div>
    </div>`;
  chatEl.appendChild(div);
  chatEl.scrollTop = chatEl.scrollHeight;
}

async function sendMessage(e) {
  if (e.key !== 'Enter') return;
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';

  if (window.SOCKET?.connected) {
    window.SOCKET.emit(EVENTS.MESSAGE_SEND, { receiverId: state.currentConversation, text });
  } else {
    try {
      const msg = await api.sendMessage(state.currentConversation, text);
      appendChatMessage(msg, true);
    } catch { showToast('Failed to send message', 'error', '⚠️'); }
  }
}

// Mobile More menu
function toggleMobileMore(e) {
  e?.preventDefault();
  document.getElementById('mobile-more-menu')?.classList.remove('hidden');
}
function closeMobileMore() {
  document.getElementById('mobile-more-menu')?.classList.add('hidden');
}

// Mobile messages: show conversation list, hide chat
function msgShowList() {
  document.querySelector('.messages-sidebar')?.classList.remove('msg-sidebar-hidden');
  document.querySelector('.messages-chat')?.classList.add('msg-chat-hidden');
}

// ================================================================
// NOTIFICATIONS
// ================================================================

async function loadNotifications() {
  try {
    state.notifs = await api.getNotifications();
  } catch {
    state.notifs = [];
  }
  renderNotifications('all');
}

function renderNotifications(filter) {
  const notifs = filter === 'all' ? state.notifs : state.notifs.filter(n => n.type === filter || (filter === 'reactions' && n.type === 'reaction'));
  const container = document.getElementById('notifications-container');
  if (!notifs.length) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔔</div><p>No notifications yet</p><span>Interact with posts to get notified!</span></div>`;
    return;
  }
  container.innerHTML = notifs.map(n => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="notifClick(${n.id},${n.actor_id||0},this)">
      <div class="notif-icon notif-${n.type}">${n.icon}</div>
      <div class="notif-content">
        <div class="notif-text">${n.text}</div>
        <div class="notif-time">${n.time}</div>
      </div>
      ${n.unread ? '<div class="unread-dot"></div>' : ''}
    </div>`).join('');
}

function filterNotifs(btn, filter) {
  document.querySelectorAll('.notif-filter-row .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  renderNotifications(filter);
}

function markNotifRead(id, el) {
  const notif = state.notifs.find(n => n.id === id);
  if (notif) notif.unread = false;
  el.classList.remove('unread');
  el.querySelector('.unread-dot')?.remove();
  updateNotifBadge();
}

function notifClick(id, actorId, el) {
  markNotifRead(id, el);
  if (actorId) openUserProfile(actorId);
}

async function markAllRead() {
  try { await api.readAll(); } catch {}
  state.notifs.forEach(n => { n.unread = false; n.read = 1; });
  renderNotifications('all');
  updateNotifBadge();
  showToast('All notifications marked as read', 'success', '✅');
}

async function updateNotifBadge() {
  try {
    const counts = await api.unreadCounts();
    const badge = document.querySelector('.notif-badge');
    if (badge) { badge.textContent = counts.notifications; badge.style.display = counts.notifications ? '' : 'none'; }
    const msgBadges = document.querySelectorAll('.nav-badge');
    if (msgBadges[1]) { msgBadges[1].textContent = counts.messages; msgBadges[1].style.display = counts.messages ? '' : 'none'; }
  } catch {
    const count = state.notifs.filter(n => n.unread).length;
    const badge = document.querySelector('.notif-badge');
    if (badge) { badge.textContent = count; badge.style.display = count ? '' : 'none'; }
  }
}

// ================================================================
// LEADERBOARD
// ================================================================

async function loadLeaderboard(game) {
  const container = document.getElementById('leaderboard-container');
  container.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading...</div>`;
  try {
    const rows = await api.getLeaderboard(game);
    const rankIcons = { 1:'🥇', 2:'🥈', 3:'🥉' };
    const myId = window.Auth?.getUser()?.id;
    if (!rows.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">🏆</div><p>No leaderboard data yet</p><span>Start posting to appear here!</span></div>`;
      return;
    }
    container.innerHTML = `<div class="lb-table">
      ${rows.map((row, i) => {
        const pos = row.rank_position || (i+1);
        const isMe = row.id === myId;
        return `<div class="lb-row ${pos<=3?'top'+pos:''} ${isMe?'glow-purple':''}" style="${isMe?'border-color:var(--accent)':''}" onclick="openUserProfile(${row.id})">
          <div class="lb-rank r${pos}">${rankIcons[pos] || pos}</div>
          <div class="lb-avatar" style="background:${row.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}">${row.avatar||'?'}</div>
          <div class="lb-info">
            <div class="lb-name">${row.username||row.name||'Player'} ${isMe ? '(You)' : ''} ${planBadge(row.plan)}</div>
            <div class="lb-game">${row.rank||'Unranked'}</div>
          </div>
          <div class="lb-stats">
            <div class="lb-stat">
              <div class="lb-stat-val">${formatNum(row.score||0)}</div>
              <div class="lb-stat-lbl">Score</div>
            </div>
            <div class="lb-stat">
              <div class="lb-stat-val">${row.post_count||0}</div>
              <div class="lb-stat-lbl">Posts</div>
            </div>
            <div class="lb-change up">↑</div>
          </div>
        </div>`;
      }).join('')}
    </div>`;
  } catch {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load leaderboard</p></div>`;
  }
}

function switchLBTab(btn, tab) {
  document.querySelectorAll('.lb-time-filter .tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  showToast(`Showing ${tab} leaderboard`, 'info', '🏆');
}

// ================================================================
// PEOPLE SEARCH
// ================================================================

async function loadPeople() {
  const container = document.getElementById('people-container');
  if (!container) return;
  const query = document.getElementById('people-search')?.value || '';
  container.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading...</div>`;
  try {
    const users = await api.getUsers(query);
    const myId = Auth.getUser()?.id;
    if (!users.length) {
      container.innerHTML = `<div class="empty-state"><div class="empty-icon">👥</div><p>No players found</p>${query?`<span>Try a different search</span>`:''}</div>`;
      return;
    }
    container.innerHTML = `<div class="people-grid">${users.map(u => `
      <div class="people-card" onclick="openUserProfile(${u.id})">
        <div class="people-avatar" style="background:${u.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};${u.avatar_url?`background-image:url('${u.avatar_url}');background-size:cover`:''}">${u.avatar_url?'':u.avatar||'?'}</div>
        <div class="people-info">
          <div class="people-name">${escapeHtml(u.username)} ${verifiedBadge(u)} ${planBadge(u.plan)}</div>
          <div class="people-handle">@${escapeHtml(cleanHandle(u.handle||u.username))}</div>
          <div style="margin-top:4px"><span class="${rankBadgeClass(u.rank)}" style="font-size:11px">${u.rank||'Bronze'}</span></div>
          ${u.bio?`<div class="people-bio">${escapeHtml(u.bio.slice(0,60))}${u.bio.length>60?'...':''}</div>`:''}
        </div>
        <div style="display:flex;flex-direction:column;gap:4px;align-items:flex-end">
          <div style="font-size:12px;color:var(--text-muted)">${formatNum(u.followers||0)} followers</div>
          ${u.online?'<span style="color:var(--accent-green);font-size:12px">🟢 Online</span>':''}
          ${u.id!==myId?`<button class="btn-primary" style="font-size:12px;padding:6px 14px;margin-top:4px" onclick="event.stopPropagation();toggleFollowPeople(${u.id},this)">${u.isFollowing?'Following':'+ Follow'}</button>`:''}
        </div>
      </div>`).join('')}</div>`;
  } catch {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load players</p></div>`;
  }
}

async function toggleFollowPeople(userId, btn) {
  try {
    const result = await api.followUser(userId);
    btn.textContent = result.action === 'followed' ? 'Following' : '+ Follow';
    btn.className = result.action === 'followed'
      ? btn.className.replace('btn-primary','btn-secondary')
      : btn.className.replace('btn-secondary','btn-primary');
  } catch (err) { showToast(err.message||'Failed','error','⚠️'); }
}

// ================================================================
// SETTINGS
// ================================================================

function loadSettings() {
  const container = document.getElementById('settings-container');
  if (!container) return;
  const u = window.CURRENT_USER;
  container.innerHTML = `
    <div class="settings-layout">
      <nav class="settings-nav">
        <div class="settings-nav-item active" onclick="switchSettingsTab(this,'account')">👤 Account</div>
        <div class="settings-nav-item" onclick="switchSettingsTab(this,'profile')">✏️ Profile</div>
        <div class="settings-nav-item" onclick="switchSettingsTab(this,'appearance')">🎨 Appearance</div>
        <div class="settings-nav-item" onclick="switchSettingsTab(this,'notifications')">🔔 Notifications</div>
        <div class="settings-nav-item" onclick="switchSettingsTab(this,'privacy')">🔒 Privacy</div>
        <div class="settings-nav-item" onclick="navigate('plans')">⚡ Subscription</div>
        <div class="settings-nav-item danger" onclick="switchSettingsTab(this,'danger')">⚠️ Danger Zone</div>
      </nav>
      <div class="settings-content" id="settings-content"></div>
    </div>`;
  switchSettingsTab(container.querySelector('.settings-nav-item.active'), 'account');
}

function switchSettingsTab(btn, tab) {
  document.querySelectorAll('.settings-nav-item').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const content = document.getElementById('settings-content');
  if (!content) return;
  const u = window.CURRENT_USER;

  if (tab === 'account') {
    content.innerHTML = `
      <div class="settings-section">
        <h3 class="settings-section-title">Account Settings</h3>
        <form onsubmit="saveAccountSettings(event)">
          <div class="settings-field">
            <label>Username</label>
            <input id="s-username" value="${escapeHtml(u.name||u.username||'')}" placeholder="Username">
          </div>
          <div class="settings-field">
            <label>Handle</label>
            <input id="s-handle" value="${escapeHtml((u.handle||'').replace(/^@/,''))}" placeholder="handle">
          </div>
          <div class="settings-field">
            <label>Email</label>
            <input id="s-email" type="email" value="${escapeHtml(u.email||'')}" placeholder="email@example.com">
          </div>
          <div id="s-account-error" class="auth-error" style="display:none"></div>
          <button type="submit" class="btn-primary">Save Changes</button>
        </form>
      </div>
      <div class="settings-section">
        <h3 class="settings-section-title">Change Password</h3>
        <form onsubmit="savePassword(event)">
          <div class="settings-field">
            <label>Current Password</label>
            <input id="s-cur-pw" type="password" placeholder="Current password">
          </div>
          <div class="settings-field">
            <label>New Password</label>
            <input id="s-new-pw" type="password" placeholder="New password (min 6 chars)">
          </div>
          <div id="s-pw-error" class="auth-error" style="display:none"></div>
          <button type="submit" class="btn-primary">Update Password</button>
        </form>
      </div>`;
  } else if (tab === 'profile') {
    content.innerHTML = `
      <div class="settings-section">
        <h3 class="settings-section-title">Profile Settings</h3>
        <div class="settings-avatar-section">
          <div class="settings-avatar-preview" id="s-avatar-preview" style="background:${u.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};${u.avatar_url?`background-image:url('${u.avatar_url}');background-size:cover`:''}">
            ${u.avatar_url?'':u.avatar||'?'}
          </div>
          <div>
            <div style="font-size:14px;margin-bottom:8px;color:var(--text-secondary)">Profile Picture</div>
            <label class="btn-secondary" style="cursor:pointer">
              Upload Photo
              <input type="file" id="s-avatar-file" accept="image/*" style="display:none" onchange="previewAndUploadAvatar(this)">
            </label>
          </div>
        </div>
        <form onsubmit="saveProfileSettings(event)">
          <div class="settings-field">
            <label>Bio</label>
            <textarea id="s-bio" rows="3" maxlength="160" placeholder="Tell the squad about yourself...">${escapeHtml(u.bio||'')}</textarea>
          </div>
          <div class="settings-field">
            <label>Rank</label>
            <select id="s-rank">
              ${['Iron','Bronze','Silver','Gold','Platinum','Diamond','Master','Grandmaster','Challenger'].map(r=>`<option${u.rank===r?' selected':''}>${r}</option>`).join('')}
            </select>
          </div>
          <div class="settings-field">
            <label>Platform</label>
            <select id="s-platform">
              ${['PC','PlayStation','Xbox','Nintendo Switch','Mobile'].map(p=>`<option${u.platform===p?' selected':''}>${p}</option>`).join('')}
            </select>
          </div>
          <div id="s-profile-error" class="auth-error" style="display:none"></div>
          <button type="submit" class="btn-primary">Save Profile</button>
        </form>
      </div>`;
  } else if (tab === 'appearance') {
    const accent = localStorage.getItem('nx_accent') || '#8b5cf6';
    const theme = localStorage.getItem('nx_theme') || 'dark';
    content.innerHTML = `
      <div class="settings-section">
        <h3 class="settings-section-title">Appearance</h3>
        <div class="settings-field">
          <label>Theme</label>
          <div class="settings-toggle-row">
            <button class="btn-${theme==='dark'?'primary':'secondary'}" onclick="setTheme('dark',this)">🌙 Dark</button>
            <button class="btn-${theme==='light'?'primary':'secondary'}" onclick="setTheme('light',this)">☀️ Light</button>
          </div>
        </div>
        <div class="settings-field">
          <label>Accent Color</label>
          <div class="accent-color-grid">
            ${(()=>{
              const plan = window.CURRENT_USER?.plan || 'free';
              const canAccent = typeof hasFeature==='function' ? hasFeature({plan},'accent_colors') : (plan==='plus'||plan==='pro');
              const baseColors = [['#8b5cf6','Purple'],['#3b82f6','Blue'],['#06b6d4','Cyan'],['#22c55e','Green'],['#f97316','Orange'],['#ef4444','Red'],['#ec4899','Pink'],['#f59e0b','Gold']];
              const premiumColors = [['#10b981','Emerald'],['#6366f1','Indigo'],['#d946ef','Fuchsia'],['#0ea5e9','Sky']];
              const allColors = [...baseColors, ...premiumColors];
              return allColors.map(([c,n],i)=>{
                const isPremium = i >= baseColors.length;
                const locked = isPremium && !canAccent;
                if (locked) return `<div class="accent-swatch accent-swatch-locked" style="background:${c}" title="${n} (DXED+ required)" onclick="showUpgradePrompt('Premium accent colors')"></div>`;
                return `<div class="accent-swatch${accent===c?' active':''}" style="background:${c}" onclick="setAccentColor('${c}',this)" title="${n}"></div>`;
              }).join('');
            })()}
          </div>
        </div>
      </div>`;
  } else if (tab === 'notifications') {
    const prefs = JSON.parse(localStorage.getItem('nx_notif_prefs') || '{"follows":true,"reactions":true,"mentions":true,"messages":true,"lfg":true}');
    content.innerHTML = `
      <div class="settings-section">
        <h3 class="settings-section-title">Notification Preferences</h3>
        ${[['follows','👤 New Followers'],['reactions','❤️ Post Reactions'],['mentions','💬 Mentions & Comments'],['messages','📩 Direct Messages'],['lfg','👥 LFG Activity']].map(([key,label])=>`
          <div class="settings-toggle-row" style="justify-content:space-between;padding:12px 0;border-bottom:1px solid var(--border)">
            <span>${label}</span>
            <label class="toggle-switch">
              <input type="checkbox" ${prefs[key]?'checked':''} onchange="saveNotifPref('${key}',this.checked)">
              <span class="toggle-slider"></span>
            </label>
          </div>`).join('')}
      </div>`;
  } else if (tab === 'privacy') {
    content.innerHTML = `
      <div class="settings-section">
        <h3 class="settings-section-title">Privacy Settings</h3>
        <div style="color:var(--text-muted);font-size:14px;line-height:1.6">
          <p style="margin-bottom:12px">Privacy controls are coming soon! We're working on giving you full control over who can see your content, send you messages, and tag you in posts.</p>
          <p>For now your profile is public and everyone can interact with you.</p>
        </div>
      </div>`;
  } else if (tab === 'danger') {
    content.innerHTML = `
      <div class="settings-section">
        <h3 class="settings-section-title" style="color:var(--accent-red)">Danger Zone</h3>
        <div style="background:rgba(239,68,68,0.1);border:1px solid rgba(239,68,68,0.3);border-radius:var(--radius);padding:20px">
          <div style="font-weight:700;margin-bottom:8px">Delete Account</div>
          <div style="color:var(--text-muted);font-size:14px;margin-bottom:16px">This will permanently delete your account, posts, and all data. This cannot be undone.</div>
          <button class="btn-danger" onclick="confirmDeleteAccount()">Delete My Account</button>
        </div>
      </div>`;
  }
}

async function saveAccountSettings(e) {
  e.preventDefault();
  const errEl = document.getElementById('s-account-error');
  errEl.style.display = 'none';
  try {
    const updated = await api.updateMe({
      username: document.getElementById('s-username').value.trim(),
      handle: document.getElementById('s-handle').value.trim(),
      email: document.getElementById('s-email').value.trim(),
    });
    Object.assign(window.CURRENT_USER, { name: updated.username, username: updated.username, handle: '@'+updated.handle, email: updated.email });
    updateSidebarUser();
    showToast('Account updated!', 'success', '✅');
  } catch (err) { errEl.textContent = err.message||'Failed'; errEl.style.display='block'; }
}

async function savePassword(e) {
  e.preventDefault();
  const errEl = document.getElementById('s-pw-error');
  errEl.style.display = 'none';
  try {
    const data = await api.changePassword({
      current_password: document.getElementById('s-cur-pw').value,
      new_password: document.getElementById('s-new-pw').value,
    });
    // Store new token returned after password change
    if (data.token) Auth.setToken(data.token);
    document.getElementById('s-cur-pw').value = '';
    document.getElementById('s-new-pw').value = '';
    showToast('Password updated!', 'success', '✅');
  } catch (err) { errEl.textContent = err.message||'Failed'; errEl.style.display='block'; }
}

async function saveProfileSettings(e) {
  e.preventDefault();
  const errEl = document.getElementById('s-profile-error');
  errEl.style.display = 'none';
  try {
    const updated = await api.updateMe({
      bio: document.getElementById('s-bio').value.trim(),
      rank: document.getElementById('s-rank').value,
      platform: document.getElementById('s-platform').value,
    });
    Object.assign(window.CURRENT_USER, { bio: updated.bio, rank: updated.rank, platform: updated.platform });
    showToast('Profile updated!', 'success', '✅');
    if (state.currentSection === 'profile') loadProfile();
  } catch (err) { errEl.textContent = err.message||'Failed'; errEl.style.display='block'; }
}

async function previewAndUploadAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  openAvatarCropper(file);
}

function openAvatarCropper(file) {
  const url = URL.createObjectURL(file);
  const overlay = document.createElement('div');
  overlay.id = 'avatar-crop-overlay';
  overlay.className = 'modal-overlay';
  overlay.innerHTML = `
    <div class="avatar-crop-modal">
      <div class="avatar-crop-header">
        <h3>Crop Profile Picture</h3>
        <button class="icon-btn" onclick="closeAvatarCropper()"><svg viewBox="0 0 24 24" width="18" height="18"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" fill="none"/></svg></button>
      </div>
      <div class="avatar-crop-body">
        <div class="avatar-crop-container" id="avatar-crop-container">
          <canvas id="avatar-crop-canvas" width="380" height="300"></canvas>
        </div>
        <div class="avatar-crop-controls">
          <label style="font-size:13px;color:var(--text-secondary)">Zoom</label>
          <input type="range" id="avatar-crop-zoom" min="0.5" max="3" step="0.01" value="1" class="avatar-crop-slider">
        </div>
      </div>
      <div class="avatar-crop-footer">
        <button class="btn-ghost" onclick="closeAvatarCropper()">Cancel</button>
        <button class="btn-primary" id="avatar-crop-save">Save</button>
      </div>
    </div>`;
  document.body.appendChild(overlay);

  const canvas = document.getElementById('avatar-crop-canvas');
  const ctx = canvas.getContext('2d');
  const zoomSlider = document.getElementById('avatar-crop-zoom');
  const img = new Image();
  let scale = 1, panX = 0, panY = 0, dragging = false, lastX = 0, lastY = 0;

  // Circle crop area (centered, 80% of min dimension)
  const circleR = Math.min(canvas.width, canvas.height) * 0.4;
  const cx = canvas.width / 2;
  const cy = canvas.height / 2;

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw image centered + pan + scale
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    // Fit image to canvas initially
    const fitScale = Math.max(canvas.width / imgW, canvas.height / imgH);
    const drawW = imgW * fitScale * scale;
    const drawH = imgH * fitScale * scale;
    const drawX = (canvas.width - drawW) / 2 + panX;
    const drawY = (canvas.height - drawH) / 2 + panY;
    ctx.drawImage(img, drawX, drawY, drawW, drawH);

    // Darken outside circle
    ctx.save();
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(cx, cy, circleR, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Draw circle border
    ctx.strokeStyle = 'rgba(255,255,255,0.7)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(cx, cy, circleR, 0, Math.PI * 2);
    ctx.stroke();
  }

  img.onload = () => {
    // Auto-zoom to fill the circle
    const fitScale = Math.max(canvas.width / img.naturalWidth, canvas.height / img.naturalHeight);
    const autoZoom = (circleR * 2) / (Math.min(img.naturalWidth, img.naturalHeight) * fitScale);
    scale = Math.max(autoZoom, 1);
    zoomSlider.value = scale;
    draw();
  };
  img.src = url;

  zoomSlider.addEventListener('input', () => { scale = parseFloat(zoomSlider.value); draw(); });

  canvas.addEventListener('mousedown', (e) => { dragging = true; lastX = e.clientX; lastY = e.clientY; canvas.style.cursor = 'grabbing'; });
  window.addEventListener('mousemove', (e) => { if (!dragging) return; panX += e.clientX - lastX; panY += e.clientY - lastY; lastX = e.clientX; lastY = e.clientY; draw(); });
  window.addEventListener('mouseup', () => { dragging = false; canvas.style.cursor = 'grab'; });
  canvas.addEventListener('touchstart', (e) => { dragging = true; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; });
  canvas.addEventListener('touchmove', (e) => { if (!dragging) return; panX += e.touches[0].clientX - lastX; panY += e.touches[0].clientY - lastY; lastX = e.touches[0].clientX; lastY = e.touches[0].clientY; draw(); e.preventDefault(); });
  canvas.addEventListener('touchend', () => { dragging = false; });

  document.getElementById('avatar-crop-save').addEventListener('click', async () => {
    // Render the cropped circle to a new canvas
    const outSize = 256;
    const outCanvas = document.createElement('canvas');
    outCanvas.width = outSize; outCanvas.height = outSize;
    const outCtx = outCanvas.getContext('2d');

    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const fitScale = Math.max(canvas.width / imgW, canvas.height / imgH);
    const drawW = imgW * fitScale * scale;
    const drawH = imgH * fitScale * scale;
    const drawX = (canvas.width - drawW) / 2 + panX;
    const drawY = (canvas.height - drawH) / 2 + panY;

    // Map the circle region from the preview canvas to the output
    const srcX = (cx - circleR - drawX) / drawW * imgW;
    const srcY = (cy - circleR - drawY) / drawH * imgH;
    const srcSize = (circleR * 2) / drawW * imgW;

    outCtx.beginPath();
    outCtx.arc(outSize/2, outSize/2, outSize/2, 0, Math.PI*2);
    outCtx.clip();
    outCtx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, outSize, outSize);

    outCanvas.toBlob(async (blob) => {
      if (!blob) { showToast('Crop failed', 'error', '⚠️'); return; }
      const croppedFile = new File([blob], 'avatar.png', { type: 'image/png' });
      const blobUrl = URL.createObjectURL(blob);
      closeAvatarCropper();

      // Update all avatar previews
      const preview = document.getElementById('s-avatar-preview');
      if (preview) { preview.style.backgroundImage = `url('${blobUrl}')`; preview.style.backgroundSize = 'cover'; preview.textContent = ''; }
      const epPreview = document.getElementById('ep-avatar-preview');
      if (epPreview) { epPreview.style.backgroundImage = `url('${blobUrl}')`; epPreview.style.backgroundSize = 'cover'; epPreview.textContent = ''; }

      try {
        const result = await api.uploadAvatar(croppedFile);
        window.CURRENT_USER.avatar_url = result.avatar_url;
        updateSidebarUser();
        showToast('Profile picture updated!', 'success', '✅');
        if (state.currentSection === 'profile') loadProfile();
      } catch (err) { showToast(err.message || 'Upload failed', 'error', '⚠️'); }
    }, 'image/png');
  });
}

function closeAvatarCropper() {
  const el = document.getElementById('avatar-crop-overlay');
  if (el) el.remove();
}

function setTheme(theme) {
  localStorage.setItem('nx_theme', theme);
  if (theme === 'light') {
    document.documentElement.style.setProperty('--bg-primary', '#f5f5f5');
    document.documentElement.style.setProperty('--bg-secondary', '#ffffff');
    document.documentElement.style.setProperty('--bg-card', '#ffffff');
    document.documentElement.style.setProperty('--text-primary', '#111111');
    document.documentElement.style.setProperty('--text-secondary', '#555555');
    document.documentElement.style.setProperty('--border', '#e0e0e0');
    document.documentElement.style.setProperty('--bg-input', '#f0f0f0');
  } else {
    document.documentElement.style.setProperty('--bg-primary', '#080811');
    document.documentElement.style.setProperty('--bg-secondary', '#0d0d1a');
    document.documentElement.style.setProperty('--bg-card', '#111125');
    document.documentElement.style.setProperty('--text-primary', '#f0f0fa');
    document.documentElement.style.setProperty('--text-secondary', '#8080a8');
    document.documentElement.style.setProperty('--border', '#1c1c38');
    document.documentElement.style.setProperty('--bg-input', '#0a0a18');
  }
  loadSettings();
}

function setAccentColor(color) {
  localStorage.setItem('nx_accent', color);
  document.documentElement.style.setProperty('--accent', color);
  loadSettings();
}

function saveNotifPref(key, val) {
  const prefs = JSON.parse(localStorage.getItem('nx_notif_prefs') || '{}');
  prefs[key] = val;
  localStorage.setItem('nx_notif_prefs', JSON.stringify(prefs));
}

async function confirmDeleteAccount() {
  const me = Auth.getUser();
  const input = prompt(`This will permanently delete your account and ALL data. Type your username "${me?.username}" to confirm:`);
  if (!input || input.trim() !== me?.username) {
    if (input !== null) showToast('Username did not match. Deletion cancelled.', 'error', '⚠️');
    return;
  }
  try {
    await api.deleteAccount();
    Auth.logout();
  } catch (err) { showToast(err.message || 'Failed', 'error', '⚠️'); }
}

// ================================================================
// PROFILE
// ================================================================

function loadProfile() {
  const u = window.CURRENT_USER;
  const handle = cleanHandle(u.handle || u.name || u.username);
  if (handle) {
    const newHash = '#@' + handle;
    if (window.location.hash !== newHash) history.pushState(null, '', newHash);
  }
  renderProfile(u.id, document.getElementById('profile-container'));
}

async function renderProfile(userId, container) {
  container.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading profile...</div>`;
  try {
    const myId = window.Auth?.getUser()?.id || window.CURRENT_USER.id;
    const isMe = userId === myId || userId === 0;
    const effectiveId = isMe ? myId : userId;

    // Track profile view (fire-and-forget)
    if (!isMe) api.trackProfileView(effectiveId);

    let user;
    if (isMe) {
      user = { ...window.Auth?.getUser(), ...window.CURRENT_USER };
      user.username = user.username || user.name;
    } else {
      user = await api.getUser(effectiveId);
    }

    const gameIcon = GAMES.find(g => (user.games||[])[0] === g.name)?.icon || '🎮';

    const bannerGrad = user.is_bot
      ? 'linear-gradient(135deg,#cc785c 0%,#a85f45 50%,#2d1810 100%)'
      : (user.gradient||'linear-gradient(135deg,#1a0a3a,#3b1a6e,#0a1a40)');

    container.innerHTML = `
      <div class="profile-banner" style="background:${bannerGrad}">
        <div class="profile-banner-icon">${user.is_bot ? '<img src="/claude-avatar.svg" style="width:56px;height:56px;border-radius:50%;opacity:.35">' : `<span>${gameIcon}</span>`}</div>
        <div class="profile-banner-overlay"></div>
      </div>
      <div class="profile-header-info">
        <div class="profile-avatar-row">
          ${(()=>{
            const avatarInner = `<div class="profile-avatar-lg" style="background:${user.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};${user.avatar_url?`background-image:url('${user.avatar_url}');background-size:cover;background-position:center`:''}">${user.avatar_url?'':user.avatar||'?'}</div>`;
            const p = user.plan || 'free';
            if (p === 'pro') return `<div class="avatar-frame-animated frame-pro">${avatarInner}</div>`;
            if (p === 'plus') return `<div class="avatar-frame-animated">${avatarInner}</div>`;
            return avatarInner;
          })()}
          <div class="profile-actions-row">
            ${isMe
              ? `<button class="btn-secondary profile-edit-btn" onclick="openEditProfile()"><svg viewBox="0 0 24 24" width="14" height="14"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit Profile</button>
                 <button class="btn-secondary" onclick="openShareProfile('${cleanHandle(user.handle||user.username)}','${(user.username||'').replace(/'/g,"\\'")}','${user.avatar_url||''}','${user.gradient||''}','${user.avatar||''}',${user.followers||0},${user.post_count||user.posts_count||0})"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></button>`
              : `<button class="btn-primary" id="follow-btn-${user.id}" onclick="toggleFollow(${user.id},this)">${user.isFollowing?'Following':'+ Follow'}</button>
                 <button class="btn-secondary" onclick="openDirectMessage(${user.id})">Message</button>
                 <button class="btn-secondary" onclick="openShareProfile('${cleanHandle(user.handle||user.username)}','${(user.username||'').replace(/'/g,"\\'")}','${user.avatar_url||''}','${user.gradient||''}','${user.avatar||''}',${user.followers||0},${user.post_count||user.posts_count||0})"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg></button>`}
          </div>
        </div>
        <div class="profile-name">${user.username||user.name||'Player'} ${verifiedBadge(user, true)} ${user.is_bot ? '<span class="claude-ai-badge" style="font-size:11px;vertical-align:middle">AI</span>' : `<span class="${rankBadgeClass(user.rank)}" style="font-size:12px">${user.rank||'Bronze'}</span>`} ${planBadge(user.plan)}</div>
        <div class="profile-handle">@${cleanHandle(user.handle||user.username)} <span class="profile-online-dot" style="color:${user.online?'var(--accent-green)':'var(--text-muted)'}">${user.online?'● Online':'● Offline'}</span></div>
        ${user.bio ? `<div class="profile-bio">${user.bio}</div>` : ''}
        <div class="profile-stats-row">
          <div class="profile-stat"><span class="stat-val">${user.post_count||user.posts_count||user.posts||0}</span> <span class="stat-label">Posts</span></div>
          <div class="profile-stat clickable-stat" onclick="openFollowModal('followers',${effectiveId})"><span class="stat-val">${formatNum(user.followers||0)}</span> <span class="stat-label">Followers</span></div>
          <div class="profile-stat clickable-stat" onclick="openFollowModal('following',${effectiveId})"><span class="stat-val">${formatNum(user.following||0)}</span> <span class="stat-label">Following</span></div>
        </div>
      </div>
      ${isMe ? `<div class="profile-compose-box">
        <div class="compose-box" style="border-bottom:none;border-top:1px solid rgba(255,255,255,0.04)">
          <div class="compose-avatar" style="background:${user.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};${user.avatar_url?`background-image:url('${user.avatar_url}');background-size:cover;background-position:center`:''};width:32px;height:32px;font-size:12px">${user.avatar_url?'':user.avatar||'?'}</div>
          <div class="compose-right" style="flex:1">
            <div class="profile-compose-trigger" onclick="openPostModal()" style="cursor:pointer;padding:8px 12px;border:1px solid rgba(255,255,255,0.06);border-radius:10px;color:rgba(255,255,255,0.3);font-size:13px;transition:border-color 0.15s">What's on your mind?</div>
          </div>
        </div>
      </div>` : ''}
      <div class="profile-tabs">
        ${user.is_bot
          ? `<div class="profile-tab active" onclick="switchProfileTab(this,'replies',${effectiveId})">Replies</div>`
          : `<div class="profile-tab active" onclick="switchProfileTab(this,'posts',${effectiveId})">Posts</div>
        <div class="profile-tab" onclick="switchProfileTab(this,'replies',${effectiveId})">Replies</div>
        <div class="profile-tab" onclick="switchProfileTab(this,'clips',${effectiveId})">Clips</div>
        <div class="profile-tab" onclick="switchProfileTab(this,'games',${effectiveId})">Games</div>
        <div class="profile-tab" onclick="switchProfileTab(this,'achievements',${effectiveId})">Achievements</div>
        ${(user.plan === 'pro' && isMe) ? `<div class="profile-tab" onclick="switchProfileTab(this,'analytics',${effectiveId})">Analytics</div>` : ''}`}
      </div>
      <div id="profile-tab-content"></div>`;

    switchProfileTab(container.querySelector('.profile-tab.active'), user.is_bot ? 'replies' : 'posts', effectiveId);
  } catch (err) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load profile</p></div>`;
  }
}

// ── Share Profile Sheet (Twitter-style) ──
function openShareProfile(handle, username, avatarUrl, gradient, avatarLetter, followers, posts) {
  const existing = document.getElementById('share-profile-sheet');
  if (existing) existing.remove();

  const profileUrl = window.location.origin + '/#@' + handle;

  const sheet = document.createElement('div');
  sheet.id = 'share-profile-sheet';
  sheet.className = 'sp-overlay';

  sheet.innerHTML = `
    <div class="sp-backdrop" onclick="closeShareProfile()"></div>
    <div class="sp-sheet">
      <div class="sp-drag-handle"></div>
      <div class="sp-header">
        <span class="sp-title">Share Profile</span>
        <button class="sp-close" onclick="closeShareProfile()">
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>

      <div class="sp-card" id="sp-card">
        <div class="sp-card-banner" style="background:${gradient || 'linear-gradient(135deg,#8b5cf6,#3b82f6)'}">
          <div class="sp-card-pattern"></div>
        </div>
        <div class="sp-card-body">
          <div class="sp-card-avatar" style="background:${gradient || 'linear-gradient(135deg,#8b5cf6,#3b82f6)'};${avatarUrl ? `background-image:url('${avatarUrl}');background-size:cover;background-position:center` : ''}">${avatarUrl ? '' : (avatarLetter || '?')}</div>
          <div class="sp-card-name">${username}</div>
          <div class="sp-card-handle">@${handle}</div>
          <div class="sp-card-stats">
            <span><strong>${formatNum(followers)}</strong> followers</span>
            <span class="sp-dot"></span>
            <span><strong>${formatNum(posts)}</strong> posts</span>
          </div>
          <div class="sp-card-url">${profileUrl.replace('http://','').replace('https://','')}</div>
        </div>
      </div>

      <div class="sp-actions">
        <button class="sp-action-btn sp-copy" onclick="copyProfileLink('${profileUrl}')">
          <div class="sp-action-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
          </div>
          <span>Copy link</span>
        </button>
        <button class="sp-action-btn" onclick="shareProfileNative('${handle}','${username.replace(/'/g,"\\'")}','${profileUrl}')">
          <div class="sp-action-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
          </div>
          <span>Share via...</span>
        </button>
        <button class="sp-action-btn" onclick="shareProfileToX('${handle}','${username.replace(/'/g,"\\'")}','${profileUrl}')">
          <div class="sp-action-icon sp-x-icon">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
          </div>
          <span>Post to X</span>
        </button>
        <button class="sp-action-btn" onclick="shareProfileQR('${profileUrl}')">
          <div class="sp-action-icon">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="2" y="2" width="8" height="8" rx="1"/><rect x="14" y="2" width="8" height="8" rx="1"/><rect x="2" y="14" width="8" height="8" rx="1"/><rect x="14" y="14" width="4" height="4"/><line x1="22" y1="14" x2="22" y2="18"/><line x1="18" y1="22" x2="22" y2="22"/></svg>
          </div>
          <span>QR code</span>
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(sheet);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => sheet.classList.add('visible'));
}

function closeShareProfile() {
  const sheet = document.getElementById('share-profile-sheet');
  if (!sheet) return;
  sheet.classList.remove('visible');
  document.body.style.overflow = '';
  setTimeout(() => sheet.remove(), 300);
}

function copyProfileLink(url) {
  navigator.clipboard.writeText(url).then(() => {
    const btn = document.querySelector('.sp-copy');
    if (btn) {
      btn.querySelector('span').textContent = 'Copied!';
      btn.classList.add('sp-copied');
      setTimeout(() => {
        btn.querySelector('span').textContent = 'Copy link';
        btn.classList.remove('sp-copied');
      }, 2000);
    }
    showToast('Profile link copied!', 'success');
  });
}

function shareProfileNative(handle, username, url) {
  if (navigator.share) {
    navigator.share({
      title: `${username} (@${handle})`,
      text: `Check out ${username}'s profile on NEXUS`,
      url: url
    });
  } else {
    copyProfileLink(url);
  }
}

function shareProfileToX(handle, username, url) {
  const text = encodeURIComponent(`Check out ${username}'s profile on NEXUS`);
  const encodedUrl = encodeURIComponent(url);
  window.open(`https://x.com/intent/tweet?text=${text}&url=${encodedUrl}`, '_blank', 'width=550,height=420');
}

function shareProfileQR(url) {
  const qrSize = 200;
  const card = document.querySelector('.sp-card');
  if (!card) return;

  // Show QR code using a simple QR API
  const existing = document.getElementById('sp-qr-display');
  if (existing) { existing.remove(); return; }

  const qrDiv = document.createElement('div');
  qrDiv.id = 'sp-qr-display';
  qrDiv.className = 'sp-qr-display';
  qrDiv.innerHTML = `
    <img src="https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(url)}&bgcolor=0e0e18&color=ffffff&format=svg" width="${qrSize}" height="${qrSize}" alt="QR Code" style="border-radius:12px"/>
    <span class="sp-qr-label">Scan to view profile</span>
  `;
  card.after(qrDiv);
}

async function switchProfileTab(btn, tab, userId) {
  document.querySelectorAll('.profile-tab').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  const content = document.getElementById('profile-tab-content');
  if (!content) return;

  if (tab === 'analytics') {
    content.innerHTML = `<div style="padding:20px;color:var(--text-muted);text-align:center"><div class="spinner" style="margin:0 auto 12px"></div>Loading analytics...</div>`;
    try {
      const data = await api.getAnalytics(userId);
      const o = data.overview;
      const d = data.daily;
      const reactionEmojis = { gg: '🎮', fire: '🔥', rekt: '💀', king: '👑', epic: '🏆', lul: '😂' };

      // Helper: build a mini sparkline SVG from data array
      function sparkline(values, color, h = 40, w = 160) {
        if (!values.length) return '';
        const max = Math.max(...values, 1);
        const pts = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * (h - 4)}`).join(' ');
        const fill = values.map((v, i) => `${(i / (values.length - 1)) * w},${h - (v / max) * (h - 4)}`);
        fill.push(`${w},${h}`, `0,${h}`);
        return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="display:block;overflow:visible">
          <polygon points="${fill.join(' ')}" fill="${color}15" />
          <polyline points="${pts}" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>`;
      }

      // Helper: bar chart SVG
      function barChart(labels, values, color, h = 120, w = 500) {
        if (!values.length) return '';
        const max = Math.max(...values, 1);
        const barW = Math.max(4, Math.floor((w - 20) / values.length) - 2);
        const bars = values.map((v, i) => {
          const bh = Math.max(1, (v / max) * (h - 24));
          const x = 10 + i * (barW + 2);
          return `<rect x="${x}" y="${h - 16 - bh}" width="${barW}" height="${bh}" rx="2" fill="${color}" opacity="0.85"><title>${labels[i]}: ${v}</title></rect>`;
        }).join('');
        // X-axis labels (show every 5th)
        const xLabels = values.map((v, i) => {
          if (i % 5 !== 0 && i !== values.length - 1) return '';
          const x = 10 + i * (barW + 2) + barW / 2;
          return `<text x="${x}" y="${h - 2}" fill="var(--text-muted)" font-size="9" text-anchor="middle">${labels[i].slice(5)}</text>`;
        }).join('');
        return `<svg width="100%" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="display:block;overflow:visible">${bars}${xLabels}</svg>`;
      }

      // Helper: horizontal bar for reaction breakdown
      function reactionBar(rb) {
        const total = Object.values(rb).reduce((s, v) => s + v, 0) || 1;
        const colors = { gg: '#8b5cf6', fire: '#f97316', rekt: '#ef4444', king: '#eab308', epic: '#3b82f6', lul: '#22c55e' };
        return Object.entries(rb).map(([k, v]) => {
          const pct = (v / total * 100).toFixed(1);
          return `<div class="analytics-reaction-row">
            <span class="analytics-reaction-emoji">${reactionEmojis[k]}</span>
            <span class="analytics-reaction-name">${k.toUpperCase()}</span>
            <div class="analytics-reaction-bar-track"><div class="analytics-reaction-bar-fill" style="width:${pct}%;background:${colors[k]}"></div></div>
            <span class="analytics-reaction-pct">${v} (${pct}%)</span>
          </div>`;
        }).join('');
      }

      // Helper: hourly heatmap
      function hourlyHeatmap(buckets) {
        const max = Math.max(...buckets, 1);
        return `<div class="analytics-heatmap">${buckets.map((v, h) => {
          const intensity = v / max;
          const bg = intensity > 0 ? `rgba(139,92,246,${0.15 + intensity * 0.85})` : 'var(--bg-tertiary)';
          const label = h === 0 ? '12a' : h < 12 ? h + 'a' : h === 12 ? '12p' : (h - 12) + 'p';
          return `<div class="analytics-heatmap-cell" style="background:${bg}" title="${label}: ${v} engagement"><span>${label}</span></div>`;
        }).join('')}</div>`;
      }

      // Helper: game breakdown table
      function gameTable(gb) {
        const entries = Object.entries(gb).sort((a, b) => b[1].reactions - a[1].reactions);
        if (!entries.length) return '<div style="color:var(--text-muted);padding:12px">No game data yet</div>';
        return `<div class="analytics-game-table">${entries.map(([name, s]) =>
          `<div class="analytics-game-row">
            <span class="analytics-game-name">${escapeHtml(name)}</span>
            <span class="analytics-game-stat">${s.posts} posts</span>
            <span class="analytics-game-stat">${s.reactions} reactions</span>
            <span class="analytics-game-stat">${s.views} views</span>
          </div>`).join('')}</div>`;
      }

      // Short date labels for charts
      const shortLabels = d.labels.map(l => l.slice(5)); // "MM-DD"

      content.innerHTML = `
        <div class="analytics-dashboard">
          <!-- Overview Cards -->
          <div class="analytics-grid analytics-grid-6">
            <div class="analytics-card analytics-card-accent">
              <div class="analytics-card-icon">👁️</div>
              <div class="analytics-card-value">${formatNum(o.totalViews)}</div>
              <div class="analytics-card-label">Post Views</div>
              ${sparkline(d.posts, '#8b5cf6')}
            </div>
            <div class="analytics-card analytics-card-accent">
              <div class="analytics-card-icon">❤️</div>
              <div class="analytics-card-value">${formatNum(o.totalReactions)}</div>
              <div class="analytics-card-label">Reactions</div>
              ${sparkline(d.reactions, '#f97316')}
            </div>
            <div class="analytics-card analytics-card-accent">
              <div class="analytics-card-icon">💬</div>
              <div class="analytics-card-value">${formatNum(o.totalCommentsReceived)}</div>
              <div class="analytics-card-label">Comments</div>
              ${sparkline(d.comments, '#3b82f6')}
            </div>
            <div class="analytics-card analytics-card-accent">
              <div class="analytics-card-icon">📝</div>
              <div class="analytics-card-value">${formatNum(o.totalPosts)}</div>
              <div class="analytics-card-label">Posts</div>
              ${sparkline(d.posts, '#22c55e')}
            </div>
            <div class="analytics-card analytics-card-accent">
              <div class="analytics-card-icon">👥</div>
              <div class="analytics-card-value">${formatNum(o.totalFollowers)}</div>
              <div class="analytics-card-label">Followers</div>
              ${sparkline(d.followers, '#eab308')}
            </div>
            <div class="analytics-card analytics-card-accent">
              <div class="analytics-card-icon">🔄</div>
              <div class="analytics-card-value">${formatNum(o.totalReposts)}</div>
              <div class="analytics-card-label">Reposts</div>
            </div>
          </div>

          <!-- Key Metrics Row -->
          <div class="analytics-metrics-row">
            <div class="analytics-metric">
              <div class="analytics-metric-value">${o.engagementRate}%</div>
              <div class="analytics-metric-label">Engagement Rate</div>
            </div>
            <div class="analytics-metric">
              <div class="analytics-metric-value">${o.avgReactionsPerPost}</div>
              <div class="analytics-metric-label">Avg Reactions/Post</div>
            </div>
            <div class="analytics-metric">
              <div class="analytics-metric-value">${formatNum(o.uniqueCommenters)}</div>
              <div class="analytics-metric-label">Unique Commenters</div>
            </div>
            <div class="analytics-metric">
              <div class="analytics-metric-value">${formatNum(o.totalProfileViews)}</div>
              <div class="analytics-metric-label">Profile Views</div>
            </div>
          </div>

          <!-- Trends -->
          <div class="analytics-trends-row">
            <div class="analytics-trend-card">
              <div class="analytics-trend-header">📈 Profile Views</div>
              <div class="analytics-trend-stats">
                <span><strong>${data.trends.profileViewsLast7}</strong> last 7d</span>
                <span><strong>${data.trends.profileViewsLast30}</strong> last 30d</span>
              </div>
              ${barChart(shortLabels, d.profileViews, '#8b5cf6')}
            </div>
            <div class="analytics-trend-card">
              <div class="analytics-trend-header">👥 Follower Growth</div>
              <div class="analytics-trend-stats">
                <span><strong>+${data.trends.followersLast7}</strong> last 7d</span>
                <span><strong>+${data.trends.followersLast30}</strong> last 30d</span>
              </div>
              ${barChart(shortLabels, d.followers, '#22c55e')}
            </div>
          </div>

          <!-- Activity Chart -->
          <div class="analytics-section-card">
            <div class="analytics-section-title">📊 Daily Activity (30 days)</div>
            <div class="analytics-chart-tabs">
              <button class="analytics-chart-tab active" onclick="switchAnalyticsChart(this,'posts')">Posts</button>
              <button class="analytics-chart-tab" onclick="switchAnalyticsChart(this,'reactions')">Reactions</button>
              <button class="analytics-chart-tab" onclick="switchAnalyticsChart(this,'comments')">Comments</button>
            </div>
            <div id="analytics-activity-chart">${barChart(shortLabels, d.posts, '#8b5cf6', 140)}</div>
          </div>

          <!-- Two-column: Reactions + Best Time -->
          <div class="analytics-two-col">
            <div class="analytics-section-card">
              <div class="analytics-section-title">❤️ Reaction Breakdown</div>
              ${reactionBar(data.reactionBreakdown)}
            </div>
            <div class="analytics-section-card">
              <div class="analytics-section-title">🕐 Best Time to Post</div>
              <p class="analytics-hint">Engagement by hour of day</p>
              ${hourlyHeatmap(data.hourlyEngagement)}
            </div>
          </div>

          <!-- Game Breakdown -->
          <div class="analytics-section-card">
            <div class="analytics-section-title">🎮 Performance by Game</div>
            ${gameTable(data.gameBreakdown)}
          </div>

          <!-- Top Posts -->
          ${data.topPosts.length ? `
          <div class="analytics-section-card">
            <div class="analytics-section-title">🏆 Top Posts by Engagement</div>
            <div class="analytics-top-posts-list">
              ${data.topPosts.map((p, i) => `
                <div class="analytics-top-post-row" onclick="scrollToPost(${p.id})">
                  <div class="analytics-top-post-rank">#${i + 1}</div>
                  <div class="analytics-top-post-content">
                    <div class="analytics-top-post-body">${escapeHtml(p.body)}</div>
                    <div class="analytics-top-post-meta">
                      ${p.game ? `<span class="analytics-top-post-game">${escapeHtml(p.game)}</span>` : ''}
                      <span>👁️ ${formatNum(p.views)}</span>
                      <span>❤️ ${formatNum(Object.values(p.reactions).reduce((s, v) => s + v, 0))}</span>
                      <span>💬 ${p.comments_count}</span>
                      <span>🔄 ${p.reposts_count}</span>
                    </div>
                  </div>
                  <div class="analytics-top-post-eng">${formatNum(p.engagement)}<small>eng</small></div>
                </div>`).join('')}
            </div>
          </div>` : ''}
        </div>`;

      // Store chart data for tab switching
      window._analyticsChartData = { labels: shortLabels, posts: d.posts, reactions: d.reactions, comments: d.comments };
    } catch (err) {
      console.error('Analytics error:', err);
      content.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load analytics</p><span>${err.message || ''}</span></div>`;
    }
    return;
  }

  if (tab === 'achievements') {
    content.innerHTML = `<div class="achievements-grid">
      ${ACHIEVEMENTS.map(a => `
        <div class="achievement-card ${a.unlocked?'':'locked'}" onclick="showToast('${a.name}: ${a.desc}','${a.unlocked?'success':'info'}','${a.icon}')">
          <div class="ach-icon">${a.icon}</div>
          <div class="ach-name">${a.name}</div>
          <div class="ach-desc">${a.desc}</div>
          ${!a.unlocked && a.progress < 100 ? `<div class="ach-progress"><div class="ach-progress-bar" style="width:${a.progress}%"></div></div>` : ''}
        </div>`).join('')}
    </div>`;
    return;
  }

  if (tab === 'games') {
    content.innerHTML = `<div style="padding:20px;color:var(--text-muted);text-align:center">Loading...</div>`;
    try {
      const gameNames = await api.getUserGameFollows(userId);
      if (!gameNames.length) {
        content.innerHTML = `<div class="empty-state"><div class="empty-icon">🎮</div><p>No games followed yet</p></div>`;
        return;
      }
      content.innerHTML = `<div class="profile-games-grid">${gameNames.map(name => {
        const g = _liveGames.find(x => x.name === name) || GAMES.find(x => x.name === name) || {};
        const cover = g.cover_url ? `<img src="${g.cover_url}" style="width:100%;height:100%;object-fit:cover;border-radius:8px">` : `<div style="font-size:32px;text-align:center">${g.icon||g._icon||'🎮'}</div>`;
        return `<div class="profile-game-item" onclick="navigate('games')">
          <div class="profile-game-cover">${cover}</div>
          <div class="profile-game-name">${name}</div>
        </div>`;
      }).join('')}</div>`;
    } catch {
      content.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load games</p></div>`;
    }
    return;
  }

  if (tab === 'replies') {
    content.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading...</div>`;
    try {
      const replies = await api.getUserComments(userId);
      const emptyMsg = userId === 999
        ? `<div class="empty-state"><div class="empty-icon">🤖</div><p>No replies yet — mention @Claude in a post!</p></div>`
        : `<div class="empty-state"><div class="empty-icon">💬</div><p>No replies yet</p></div>`;
      const isBot = userId === 999;
      const authorName = isBot ? 'Claude' : null;
      content.innerHTML = replies.length
        ? `<div class="replies-feed">${replies.map(c => {
            const displayName = authorName || c.username || c.handle || 'Player';
            const avatarEl = isBot
              ? `<img src="/claude-avatar.svg" class="reply-feed-avatar reply-feed-avatar-bot">`
              : c.avatar_url
                ? `<div class="reply-feed-avatar" style="background-image:url('${c.avatar_url}');background-size:cover;background-position:center"></div>`
                : `<div class="reply-feed-avatar" style="background:${c.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}">${c.avatar||'?'}</div>`;
            return `
            <div class="reply-feed-item${isBot ? ' reply-feed-item--claude' : ''}" onclick="scrollToPost(${c.post_id})">
              <div class="reply-feed-quote-block">
                <div class="reply-feed-quote-label">Replying to <strong>@${c.post_author}</strong></div>
                <div class="reply-feed-quote-text">${(c.post_body||'').slice(0,120)}${(c.post_body||'').length>120?'…':''}</div>
              </div>
              <div class="reply-feed-row">
                ${avatarEl}
                <div class="reply-feed-bubble">
                  <div class="reply-feed-meta"><span class="reply-feed-name">${displayName}</span>${isBot?'<span class="claude-ai-badge" style="font-size:10px">AI</span>':''}<span class="reply-feed-time">${c.time}</span></div>
                  <div class="reply-feed-text">${parseBody(c.body)}</div>
                </div>
              </div>
            </div>`;
          }).join('')}</div>`
        : emptyMsg;
    } catch {
      content.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load replies</p></div>`;
    }
    return;
  }

  content.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading...</div>`;
  try {
    const posts = await api.getUserPosts(userId);
    const normalized = posts.map(normalizePost);
    const filtered = tab === 'clips' ? normalized.filter(p => p.type === 'clip') : normalized;
    const emptyIcon = tab === 'clips' ? '🎬' : '📝';
    content.innerHTML = filtered.length
      ? filtered.map(renderPost).join('')
      : `<div class="empty-state"><div class="empty-icon">${emptyIcon}</div><p>No ${tab} yet</p></div>`;
  } catch {
    content.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load ${tab}</p></div>`;
  }
}

// ================================================================
// USER PROFILE MODAL
// ================================================================

function openImageLightbox(url) {
  const el = document.createElement('div');
  el.className = 'img-lightbox';
  el.innerHTML = `<div class="img-lightbox-inner"><img src="${url}"><button onclick="this.closest('.img-lightbox').remove()">✕</button></div>`;
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
  document.body.appendChild(el);
}

// ================================================================
// CUSTOM VIDEO PLAYER
// ================================================================
function openVideoPlayer(postId) {
  const post = state.posts.find(p => p.id === postId);
  if (!post || !post.clip_url) return;
  const user = post.user || {};
  const me = window.Auth?.getUser() || window.CURRENT_USER;
  const total = totalReactions(post.reactions || {});
  const liked = post._liked || false;
  const isLoggedIn = !!window.Auth?.getToken();
  const commentCount = post.comment_count || post.comments_count || 0;
  const viewCount = post.views || 0;

  const overlay = document.createElement('div');
  overlay.className = 'vp-overlay';
  overlay.id = 'video-player-overlay';

  overlay.innerHTML = `
    <div class="vp-container">
      <div class="vp-video-area">
        <video class="vp-video" src="${post.clip_url}" playsinline preload="auto" loop></video>

        <!-- Gradient overlays for readability -->
        <div class="vp-gradient-top"></div>
        <div class="vp-gradient-bottom"></div>

        <!-- Tap zones -->
        <div class="vp-tap-zone vp-tap-left"></div>
        <div class="vp-tap-zone vp-tap-center"></div>
        <div class="vp-tap-zone vp-tap-right"></div>

        <!-- Double-tap heart burst -->
        <div class="vp-heart-burst" id="vp-heart-burst"></div>

        <!-- Play/pause indicator -->
        <div class="vp-state-icon" id="vp-state-icon">
          <div class="vp-state-play"><svg viewBox="0 0 24 24" width="44" height="44" fill="white"><polygon points="6,3 20,12 6,21"/></svg></div>
          <div class="vp-state-pause"><svg viewBox="0 0 24 24" width="44" height="44" fill="white"><rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/></svg></div>
        </div>

        <!-- Skip ripple indicators -->
        <div class="vp-skip-ripple vp-skip-ripple-left" id="vp-skip-back">
          <div class="vp-skip-ripple-bg"></div>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><polyline points="11 17 6 12 11 7"/><polyline points="18 17 13 12 18 7"/></svg>
          <span>10</span>
        </div>
        <div class="vp-skip-ripple vp-skip-ripple-right" id="vp-skip-fwd">
          <div class="vp-skip-ripple-bg"></div>
          <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><polyline points="13 17 18 12 13 7"/><polyline points="6 17 11 12 6 7"/></svg>
          <span>10</span>
        </div>

        <!-- Top bar -->
        <div class="vp-top-bar" id="vp-top-bar">
          <button class="vp-close-btn" id="vp-close-btn">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 5 12 12 19"/></svg>
          </button>
          <div class="vp-top-info" onclick="closeVideoPlayer();openProfileById(${user.id || 0})">
            <div class="vp-user-avatar" style="background:${user.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};${user.avatar_url?`background-image:url('${user.avatar_url}');background-size:cover;background-position:center`:''}">${user.avatar_url?'':user.avatar||'?'}</div>
            <div class="vp-user-meta">
              <span class="vp-username">${userName(user)}</span>
              <span class="vp-handle">@${user.handle || user.username || 'player'}</span>
            </div>
          </div>
          ${post.game ? `<span class="vp-game-pill">${post.game}</span>` : ''}
          <div class="vp-top-spacer"></div>
          <button class="vp-more-btn" id="vp-more-btn">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="white"><circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/></svg>
          </button>
        </div>

        <!-- Side action rail (TikTok-style) -->
        <div class="vp-rail" id="vp-rail">
          <div class="vp-rail-avatar" onclick="closeVideoPlayer();openProfileById(${user.id || 0})">
            <div class="vp-rail-avatar-img" style="background:${user.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};${user.avatar_url?`background-image:url('${user.avatar_url}');background-size:cover;background-position:center`:''}">${user.avatar_url?'':user.avatar||'?'}</div>
          </div>
          <button class="vp-rail-btn ${liked ? 'active' : ''}" id="vp-like-btn">
            <div class="vp-rail-icon">
              <svg viewBox="0 0 24 24" width="28" height="28"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" ${liked ? 'fill="currentColor"' : ''}/></svg>
            </div>
            <span id="vp-like-count">${formatNum(total)}</span>
          </button>
          <button class="vp-rail-btn" id="vp-comment-btn">
            <div class="vp-rail-icon">
              <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
            </div>
            <span id="vp-comment-count">${formatNum(commentCount)}</span>
          </button>
          <button class="vp-rail-btn" id="vp-bookmark-btn">
            <div class="vp-rail-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z"/></svg>
            </div>
            <span>Save</span>
          </button>
          <button class="vp-rail-btn" id="vp-share-btn">
            <div class="vp-rail-icon">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            </div>
            <span>Share</span>
          </button>
        </div>

        <!-- Bottom info + controls -->
        <div class="vp-bottom" id="vp-bottom">
          <div class="vp-desc-area">
            <div class="vp-desc-text" id="vp-desc-text">${escapeHtml(post.body || '')}</div>
            ${post.body && post.body.length > 80 ? '<button class="vp-desc-more" id="vp-desc-more">more</button>' : ''}
          </div>
          <div class="vp-views-row">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="rgba(255,255,255,0.5)" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            <span>${formatNum(viewCount)} views</span>
          </div>
        </div>

        <!-- YouTube-style progress bar (full width at bottom) -->
        <div class="vp-controls" id="vp-controls">
          <div class="vp-progress-bar" id="vp-progress-bar">
            <div class="vp-progress-buffer" id="vp-progress-buffer"></div>
            <div class="vp-progress-fill" id="vp-progress-fill"></div>
            <div class="vp-progress-thumb" id="vp-progress-thumb"></div>
            <div class="vp-progress-hover-time" id="vp-hover-time">0:00</div>
          </div>
          <div class="vp-controls-row">
            <button class="vp-ctrl-btn" id="vp-play-btn">
              <svg viewBox="0 0 24 24" width="22" height="22" fill="white" id="vp-play-svg"><polygon points="6,3 20,12 6,21"/></svg>
            </button>
            <span class="vp-time-display"><span id="vp-time-current">0:00</span> / <span id="vp-time-total">0:00</span></span>
            <div class="vp-ctrl-spacer"></div>
            <button class="vp-ctrl-btn" id="vp-mute-btn">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" stroke-width="2" id="vp-vol-icon"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/></svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Comments panel -->
      <div class="vp-comments-panel hidden" id="vp-comments-panel">
        <div class="vp-comments-drag-handle"></div>
        <div class="vp-comments-header">
          <span id="vp-comments-title">Comments</span>
          <button class="vp-comments-close" id="vp-comments-close">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>
        <div class="vp-comments-body comment-section" id="vp-comments-body" data-post-id="${postId}"></div>
      </div>
    </div>`;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';
  requestAnimationFrame(() => overlay.classList.add('visible'));

  // ── Element refs ──
  const video = overlay.querySelector('.vp-video');
  const stateIcon = overlay.querySelector('#vp-state-icon');
  const progressFill = overlay.querySelector('#vp-progress-fill');
  const progressBuffer = overlay.querySelector('#vp-progress-buffer');
  const progressThumb = overlay.querySelector('#vp-progress-thumb');
  const progressBar = overlay.querySelector('#vp-progress-bar');
  const hoverTime = overlay.querySelector('#vp-hover-time');
  const timeCurrent = overlay.querySelector('#vp-time-current');
  const timeTotal = overlay.querySelector('#vp-time-total');
  const heartBurst = overlay.querySelector('#vp-heart-burst');
  const likeBtn = overlay.querySelector('#vp-like-btn');
  const commentBtn = overlay.querySelector('#vp-comment-btn');
  const commentsPanel = overlay.querySelector('#vp-comments-panel');
  const commentsClose = overlay.querySelector('#vp-comments-close');
  const shareBtn = overlay.querySelector('#vp-share-btn');
  const bookmarkBtn = overlay.querySelector('#vp-bookmark-btn');
  const skipBack = overlay.querySelector('#vp-skip-back');
  const skipFwd = overlay.querySelector('#vp-skip-fwd');
  const playBtn = overlay.querySelector('#vp-play-btn');
  const playSvg = overlay.querySelector('#vp-play-svg');
  const muteBtn = overlay.querySelector('#vp-mute-btn');
  const volIcon = overlay.querySelector('#vp-vol-icon');
  const descText = overlay.querySelector('#vp-desc-text');
  const descMore = overlay.querySelector('#vp-desc-more');
  const controls = overlay.querySelector('#vp-controls');

  function fmtTime(s) {
    if (isNaN(s)) return '0:00';
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }

  // ── Play / Pause ──
  let stateTimeout;
  function showStateIcon(playing) {
    stateIcon.className = 'vp-state-icon show ' + (playing ? 'playing' : 'paused');
    clearTimeout(stateTimeout);
    stateTimeout = setTimeout(() => stateIcon.classList.remove('show'), 500);
  }

  function togglePlay() {
    if (video.paused) {
      video.play();
      showStateIcon(true);
    } else {
      video.pause();
      showStateIcon(false);
    }
    updatePlayBtn();
  }

  function updatePlayBtn() {
    if (video.paused) {
      playSvg.innerHTML = '<polygon points="6,3 20,12 6,21"/>';
    } else {
      playSvg.innerHTML = '<rect x="5" y="3" width="4" height="18" rx="1"/><rect x="15" y="3" width="4" height="18" rx="1"/>';
    }
  }

  // Center tap toggles play
  overlay.querySelector('.vp-tap-center').addEventListener('click', togglePlay);
  playBtn.addEventListener('click', togglePlay);

  // ── Double-tap detection ──
  let lastTapTime = { left: 0, center: 0, right: 0 };

  function handleDoubleTap(zone, action) {
    zone.addEventListener('click', (e) => {
      const now = Date.now();
      const key = zone.classList.contains('vp-tap-left') ? 'left'
                : zone.classList.contains('vp-tap-right') ? 'right' : 'center';
      if (now - lastTapTime[key] < 300) {
        e.stopPropagation();
        action(e);
      }
      lastTapTime[key] = now;
    });
  }

  // Double-tap center = like with particle burst
  handleDoubleTap(overlay.querySelector('.vp-tap-center'), (e) => {
    spawnHeartBurst(e);
    if (!post._liked && isLoggedIn) vpToggleLike();
  });

  // Double-tap left = rewind 10s
  handleDoubleTap(overlay.querySelector('.vp-tap-left'), () => {
    video.currentTime = Math.max(0, video.currentTime - 10);
    skipBack.classList.remove('show');
    void skipBack.offsetWidth;
    skipBack.classList.add('show');
    setTimeout(() => skipBack.classList.remove('show'), 700);
  });

  // Double-tap right = forward 10s
  handleDoubleTap(overlay.querySelector('.vp-tap-right'), () => {
    video.currentTime = Math.min(video.duration || 0, video.currentTime + 10);
    skipFwd.classList.remove('show');
    void skipFwd.offsetWidth;
    skipFwd.classList.add('show');
    setTimeout(() => skipFwd.classList.remove('show'), 700);
  });

  // ── Heart particle burst ──
  function spawnHeartBurst(e) {
    const rect = overlay.querySelector('.vp-video-area').getBoundingClientRect();
    const x = (e.clientX || rect.width / 2) - rect.left;
    const y = (e.clientY || rect.height / 2) - rect.top;
    for (let i = 0; i < 7; i++) {
      const heart = document.createElement('div');
      heart.className = 'vp-heart-particle';
      heart.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" fill="#ef4444"/></svg>';
      heart.style.left = x + 'px';
      heart.style.top = y + 'px';
      heart.style.setProperty('--dx', (Math.random() - 0.5) * 120 + 'px');
      heart.style.setProperty('--dy', -(Math.random() * 140 + 60) + 'px');
      heart.style.setProperty('--rot', (Math.random() - 0.5) * 90 + 'deg');
      heart.style.setProperty('--scale', (0.6 + Math.random() * 0.8));
      heart.style.animationDelay = (i * 0.04) + 's';
      heartBurst.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
    }
  }

  // ── Progress bar (YouTube-style) ──
  video.addEventListener('loadedmetadata', () => {
    timeTotal.textContent = fmtTime(video.duration);
  });
  video.addEventListener('timeupdate', () => {
    if (!video.duration || isSeeking) return;
    const pct = (video.currentTime / video.duration) * 100;
    progressFill.style.width = pct + '%';
    progressThumb.style.left = pct + '%';
    timeCurrent.textContent = fmtTime(video.currentTime);
  });
  video.addEventListener('progress', () => {
    if (video.buffered.length > 0) {
      const buffered = (video.buffered.end(video.buffered.length - 1) / video.duration) * 100;
      progressBuffer.style.width = buffered + '%';
    }
  });
  video.addEventListener('play', updatePlayBtn);
  video.addEventListener('pause', updatePlayBtn);

  // Seekable progress
  let isSeeking = false;
  function seekTo(clientX) {
    const rect = progressBar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    video.currentTime = pct * (video.duration || 0);
    progressFill.style.width = (pct * 100) + '%';
    progressThumb.style.left = (pct * 100) + '%';
    timeCurrent.textContent = fmtTime(video.currentTime);
  }
  progressBar.addEventListener('mousedown', (e) => { isSeeking = true; seekTo(e.clientX); progressBar.classList.add('seeking'); });
  progressBar.addEventListener('touchstart', (e) => { isSeeking = true; seekTo(e.touches[0].clientX); progressBar.classList.add('seeking'); }, { passive: true });
  document.addEventListener('mousemove', (e) => { if (isSeeking) seekTo(e.clientX); });
  document.addEventListener('touchmove', (e) => { if (isSeeking) seekTo(e.touches[0].clientX); }, { passive: true });
  document.addEventListener('mouseup', () => { if (isSeeking) { isSeeking = false; progressBar.classList.remove('seeking'); } });
  document.addEventListener('touchend', () => { if (isSeeking) { isSeeking = false; progressBar.classList.remove('seeking'); } });

  // Hover time preview
  progressBar.addEventListener('mousemove', (e) => {
    const rect = progressBar.getBoundingClientRect();
    const pct = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    hoverTime.textContent = fmtTime(pct * (video.duration || 0));
    hoverTime.style.left = (pct * 100) + '%';
    hoverTime.classList.add('show');
  });
  progressBar.addEventListener('mouseleave', () => { hoverTime.classList.remove('show'); });

  // ── Mute / volume ──
  muteBtn.addEventListener('click', () => {
    video.muted = !video.muted;
    volIcon.innerHTML = video.muted
      ? '<line x1="23" y1="1" x2="1" y2="23"/><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>'
      : '<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M19.07 4.93a10 10 0 010 14.14M15.54 8.46a5 5 0 010 7.07"/>';
  });

  // ── Auto-hide controls ──
  let hideTimer;
  function showControls() {
    overlay.classList.add('controls-visible');
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      if (!video.paused && !isSeeking) overlay.classList.remove('controls-visible');
    }, 3000);
  }
  overlay.addEventListener('mousemove', showControls);
  overlay.addEventListener('touchstart', showControls, { passive: true });
  showControls();
  video.addEventListener('pause', () => overlay.classList.add('controls-visible'));
  video.addEventListener('play', () => {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => overlay.classList.remove('controls-visible'), 3000);
  });

  // ── Like ──
  async function vpToggleLike() {
    if (!isLoggedIn) { showToast('Sign in to like', 'info'); return; }
    likeBtn.classList.add('vp-btn-pop');
    setTimeout(() => likeBtn.classList.remove('vp-btn-pop'), 300);
    try {
      const result = await api.reactToPost(postId, 'gg');
      if (result.action === 'added') {
        post._liked = true;
        post.reactions.gg = (post.reactions.gg || 0) + 1;
        likeBtn.classList.add('active');
        likeBtn.querySelector('path').setAttribute('fill', 'currentColor');
      } else {
        post._liked = false;
        post.reactions.gg = Math.max(0, (post.reactions.gg || 0) - 1);
        likeBtn.classList.remove('active');
        likeBtn.querySelector('path').removeAttribute('fill');
      }
      const tot = totalReactions(post.reactions);
      overlay.querySelector('#vp-like-count').textContent = formatNum(tot);
      // Sync feed
      const feedBtn = document.querySelector(`#post-${postId} .like-btn`);
      if (feedBtn) {
        feedBtn.classList.toggle('liked', post._liked);
        const fc = document.getElementById(`like-count-${postId}`);
        if (fc) fc.textContent = formatNum(tot);
      }
    } catch { showToast('Failed to like', 'error'); }
  }
  likeBtn.addEventListener('click', vpToggleLike);

  // ── Comments ──
  commentBtn.addEventListener('click', () => {
    commentsPanel.classList.toggle('hidden');
    if (!commentsPanel.classList.contains('hidden')) {
      loadCommentsInSection(postId, overlay.querySelector('#vp-comments-body'));
    }
  });
  commentsClose.addEventListener('click', () => commentsPanel.classList.add('hidden'));

  // ── Bookmark ──
  bookmarkBtn.addEventListener('click', async () => {
    bookmarkBtn.classList.add('vp-btn-pop');
    setTimeout(() => bookmarkBtn.classList.remove('vp-btn-pop'), 300);
    if (!isLoggedIn) { showToast('Sign in to bookmark', 'info'); return; }
    try {
      await api.toggleBookmark(postId);
      bookmarkBtn.classList.toggle('active');
      showToast(bookmarkBtn.classList.contains('active') ? 'Saved!' : 'Removed', 'success');
    } catch { showToast('Failed', 'error'); }
  });

  // ── Share ──
  shareBtn.addEventListener('click', () => {
    if (navigator.share) {
      navigator.share({ title: post.body || 'Check out this clip', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied!', 'success');
    }
  });

  // ── Description expand ──
  if (descMore) {
    descMore.addEventListener('click', () => {
      descText.classList.toggle('expanded');
      descMore.textContent = descText.classList.contains('expanded') ? 'less' : 'more';
    });
  }

  // ── More menu ──
  overlay.querySelector('#vp-more-btn').addEventListener('click', () => {
    showToast('More options coming soon', 'info');
  });

  // ── Close ──
  function closeVideoPlayer() {
    video.pause();
    overlay.classList.remove('visible');
    document.body.style.overflow = '';
    clearTimeout(hideTimer);
    setTimeout(() => overlay.remove(), 250);
  }
  window.closeVideoPlayer = closeVideoPlayer;
  overlay.querySelector('#vp-close-btn').addEventListener('click', closeVideoPlayer);

  // ── Keyboard shortcuts ──
  function handleKeydown(e) {
    if (e.key === 'Escape') { closeVideoPlayer(); document.removeEventListener('keydown', handleKeydown); }
    if (e.key === ' ' || e.key === 'k') { e.preventDefault(); togglePlay(); }
    if (e.key === 'ArrowLeft' || e.key === 'j') { video.currentTime = Math.max(0, video.currentTime - 10); }
    if (e.key === 'ArrowRight' || e.key === 'l') { video.currentTime = Math.min(video.duration || 0, video.currentTime + 10); }
    if (e.key === 'm') { video.muted = !video.muted; muteBtn.click(); }
    if (e.key === 'f') { video.requestFullscreen?.(); }
  }
  document.addEventListener('keydown', handleKeydown);

  // Auto play
  video.play().then(() => updatePlayBtn()).catch(() => updatePlayBtn());
  showControls();
}

function switchAnalyticsChart(btn, type) {
  btn.closest('.analytics-chart-tabs').querySelectorAll('.analytics-chart-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const d = window._analyticsChartData;
  if (!d) return;
  const container = document.getElementById('analytics-activity-chart');
  if (!container) return;
  const colors = { posts: '#8b5cf6', reactions: '#f97316', comments: '#3b82f6' };
  const values = d[type] || d.posts;
  const max = Math.max(...values, 1);
  const w = 500, h = 140;
  const barW = Math.max(4, Math.floor((w - 20) / values.length) - 2);
  const bars = values.map((v, i) => {
    const bh = Math.max(1, (v / max) * (h - 24));
    const x = 10 + i * (barW + 2);
    return `<rect x="${x}" y="${h - 16 - bh}" width="${barW}" height="${bh}" rx="2" fill="${colors[type]}" opacity="0.85"><title>${d.labels[i]}: ${v}</title></rect>`;
  }).join('');
  const xLabels = values.map((v, i) => {
    if (i % 5 !== 0 && i !== values.length - 1) return '';
    const x = 10 + i * (barW + 2) + barW / 2;
    return `<text x="${x}" y="${h - 2}" fill="var(--text-muted)" font-size="9" text-anchor="middle">${d.labels[i].slice(5)}</text>`;
  }).join('');
  container.innerHTML = `<svg width="100%" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" style="display:block;overflow:visible">${bars}${xLabels}</svg>`;
}

function scrollToPost(postId) {
  navigate('home');
  setTimeout(() => {
    const el = document.getElementById(`post-${postId}`);
    if (el) { el.scrollIntoView({ behavior: 'smooth', block: 'center' }); el.classList.add('post-highlight'); setTimeout(() => el.classList.remove('post-highlight'), 1500); }
  }, 300);
}

async function openUserProfile(userId) {
  if (!userId) return;
  const myId = +(window.Auth?.getUser()?.id || window.CURRENT_USER.id || 0);
  if (+userId === myId) { navigate('profile'); return; }
  state._profileUserId = +userId;
  state._profileBack = state.currentSection;
  // Resolve handle for URL
  try {
    const user = await api.getUser(userId);
    const handle = cleanHandle(user.handle || user.username);
    history.pushState(null, '', '#@' + handle);
  } catch { /* fall back without hash */ }
  navigate('user-profile', true);
}

function loadUserProfile() {
  const userId = state._profileUserId;
  const container = document.getElementById('user-profile-container');
  if (!container) return;
  container.innerHTML = '';
  // Back button
  const backSection = state._profileBack || 'home';
  const backLabel = backSection.charAt(0).toUpperCase() + backSection.slice(1);
  const backBar = document.createElement('div');
  backBar.className = 'profile-back-bar';
  backBar.innerHTML = `<button class="profile-back-btn" onclick="navigate('${backSection}')">
    <svg viewBox="0 0 24 24" width="18" height="18"><polyline points="15 18 9 12 15 6"/></svg>
    Back to ${backLabel}
  </button>`;
  container.appendChild(backBar);
  const profileDiv = document.createElement('div');
  container.appendChild(profileDiv);
  renderProfile(userId, profileDiv);
}

function closeProfileModal() { document.getElementById('profile-modal').classList.add('hidden'); }

// ================================================================
// FOLLOW SYSTEM
// ================================================================

async function toggleFollow(userId, btn) {
  try {
    const result = await api.followUser(userId);
    if (result.action === 'followed') {
      btn.textContent = 'Following';
      btn.className = btn.className.replace('btn-primary', 'btn-secondary');
      showToast('Now following!', 'success', '👥');
    } else {
      btn.textContent = '+ Follow';
      btn.className = btn.className.replace('btn-secondary', 'btn-primary');
      showToast('Unfollowed', 'info', '👋');
    }
  } catch (err) { showToast(err.message || 'Failed', 'error', '⚠️'); }
}

// ================================================================
// FOLLOWERS / FOLLOWING MODAL
// ================================================================

async function openFollowModal(type, userId) {
  const modal = document.getElementById('follow-modal');
  const title = document.getElementById('follow-modal-title');
  const list = document.getElementById('follow-modal-list');
  if (!modal) return;
  title.textContent = type === 'followers' ? 'Followers' : 'Following';
  list.innerHTML = `<div style="padding:20px;text-align:center;color:var(--text-muted)">Loading...</div>`;
  modal.classList.remove('hidden');
  try {
    const users = type === 'followers'
      ? await api.getFollowers(userId)
      : await api.getFollowing(userId);
    if (!users.length) {
      list.innerHTML = `<div class="empty-state"><div class="empty-icon">👥</div><p>No ${type} yet</p></div>`;
      return;
    }
    list.innerHTML = users.map(u => `
      <div class="follow-modal-user" onclick="closeFollowModal();openUserProfile(${u.id})">
        <div class="post-avatar" style="background:${u.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};${u.avatar_url?`background-image:url('${u.avatar_url}');background-size:cover`:''};width:42px;height:42px;min-width:42px">${u.avatar_url?'':u.avatar||'?'}</div>
        <div style="flex:1">
          <div style="font-weight:700;font-size:14px;display:flex;align-items:center;gap:5px">${u.username} ${verifiedBadge(u)} ${planBadge(u.plan)}</div>
          <div style="color:var(--text-muted);font-size:12px">@${(u.handle||u.username).replace(/^@/,'')} · <span class="${rankBadgeClass(u.rank)}" style="font-size:11px">${u.rank||'Bronze'}</span></div>
        </div>
      </div>`).join('');
  } catch {
    list.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load</p></div>`;
  }
}

function closeFollowModal() {
  document.getElementById('follow-modal')?.classList.add('hidden');
}

// ================================================================
// RIGHT SIDEBAR WIDGETS
// ================================================================

async function loadWidgets() {
  // Online Friends from real API
  try {
    const onlineUsers = (await api.getOnline()).slice(0, 5);
    document.getElementById('online-count').textContent = onlineUsers.length;
    document.getElementById('online-friends').innerHTML = onlineUsers.length
      ? onlineUsers.map(u => `
        <div class="friend-item" onclick="openUserProfile(${u.id})">
          <div class="friend-avatar" style="background:${u.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}${u.avatar_url?`;background-image:url('${u.avatar_url}');background-size:cover;background-position:center`:''}">
            ${u.avatar_url?'':u.avatar||'?'}
            <div class="friend-status-dot" style="background:var(--accent-green)"></div>
          </div>
          <div class="friend-info">
            <div class="friend-name">${u.username||'Player'}</div>
            <div class="friend-game" data-uid="${u.id}">${u.now_playing ? 'Playing '+u.now_playing : 'Online'}</div>
          </div>
        </div>`).join('')
      : `<div style="padding:12px;color:var(--text-muted);font-size:13px">No one online yet</div>`;
  } catch {
    document.getElementById('online-count').textContent = '0';
    document.getElementById('online-friends').innerHTML = `<div style="padding:12px;color:var(--text-muted);font-size:13px">Server offline</div>`;
  }

  // Trending Games (live from API, fallback to static)
  try {
    const tgGames = _liveGames.length ? _liveGames.slice(0,5) : TRENDING_GAMES;
    document.getElementById('trending-games-widget').innerHTML = tgGames.map((g, i) => {
      const name = g.name;
      const viewers = g.twitch_viewers > 0
        ? (g.twitch_viewers >= 1000 ? (g.twitch_viewers/1000).toFixed(1)+'K' : g.twitch_viewers) + ' live'
        : (g.players || '');
      const icon = g._icon || g.icon || '🎮';
      return `<div class="trend-item" onclick="navigate('games')">
        <div class="trend-icon">${icon}</div>
        <div class="trend-info">
          <div class="trend-name">${name}</div>
          <div class="trend-players">${viewers}</div>
        </div>
        <div class="trend-rank">#${i+1}</div>
      </div>`;
    }).join('');
  } catch {
    document.getElementById('trending-games-widget').innerHTML = TRENDING_GAMES.map((g, i) => `
      <div class="trend-item" onclick="navigate('games')">
        <div class="trend-icon">${g.icon}</div>
        <div class="trend-info">
          <div class="trend-name">${g.name}</div>
          <div class="trend-players">${g.players}</div>
        </div>
        <div class="trend-rank">#${i+1}</div>
      </div>`).join('');
  }

  // Hot Tags
  document.getElementById('hashtags-widget').innerHTML = HOT_TAGS.map(tag =>
    `<div class="hashtag-pill" onclick="searchExploreTag('${tag}')">${tag}</div>`
  ).join('');

  // Quick LFG from API
  try {
    const lfgPosts = await api.getLFG('');
    const quickLFG = lfgPosts.filter(p => p.status !== 'full').slice(0, 3);
    document.getElementById('quick-lfg').innerHTML = quickLFG.length
      ? quickLFG.map(p => `
        <div class="quick-lfg-item">
          <div>
            <div class="quick-lfg-game">🎮 ${p.game}</div>
            <div class="quick-lfg-slots">${(p.slots||5) - (p.filled||1)} slots open</div>
          </div>
          <button class="quick-join-btn" onclick="joinLFGReal(${p.id},this);navigate('lfg')">Join</button>
        </div>`).join('')
      : `<div style="padding:12px;color:var(--text-muted);font-size:13px">No open LFG posts</div>`;
  } catch {
    document.getElementById('quick-lfg').innerHTML = `<div style="padding:12px;color:var(--text-muted);font-size:13px">No LFG data</div>`;
  }
}

// ================================================================
// SIDEBAR USER MENU
// ================================================================

function toggleSidebarMenu(e) {
  e.stopPropagation(); // prevent doc listener from immediately closing it
  const menu = document.getElementById('sidebar-user-menu');
  const isHidden = menu.classList.contains('hidden');
  closeAllShareMenus();
  if (isHidden) {
    menu.classList.remove('hidden');
  } else {
    menu.classList.add('hidden');
  }
}

function closeSidebarMenu() {
  document.getElementById('sidebar-user-menu')?.classList.add('hidden');
}

// ================================================================
// EDIT PROFILE
// ================================================================

function openEditProfile() {
  const u = window.CURRENT_USER;
  document.getElementById('ep-bio').value = u.bio || '';
  document.getElementById('ep-rank').value = u.rank || 'Bronze';
  document.getElementById('ep-platform').value = u.platform || 'PC';
  document.getElementById('ep-nowplaying').value = u.now_playing || '';
  document.getElementById('ep-error').style.display = 'none';
  // Update avatar preview
  const preview = document.getElementById('ep-avatar-preview');
  if (preview) {
    preview.style.background = u.gradient || 'linear-gradient(135deg,#8b5cf6,#3b82f6)';
    if (u.avatar_url) {
      preview.style.backgroundImage = `url('${u.avatar_url}')`;
      preview.style.backgroundSize = 'cover';
      preview.textContent = '';
    } else {
      preview.style.backgroundImage = '';
      preview.textContent = u.avatar || '?';
    }
  }
  document.getElementById('edit-profile-modal').classList.remove('hidden');
}

function closeEditProfile() {
  document.getElementById('edit-profile-modal').classList.add('hidden');
}

async function handleEditProfileAvatar(input) {
  const file = input.files[0];
  if (!file) return;
  openAvatarCropper(file);
  return;
  // Legacy direct upload (kept for reference)
  const preview = document.getElementById('ep-avatar-preview');
  if (preview) {
    preview.style.backgroundImage = `url('${URL.createObjectURL(file)}')`;
    preview.style.backgroundSize = 'cover';
    preview.style.backgroundPosition = 'center';
    preview.textContent = '';
  }
  try {
    const result = await api.uploadAvatar(file);
    window.CURRENT_USER.avatar_url = result.avatar_url;
    updateSidebarUser();
    showToast('Profile picture updated!', 'success', '✅');
    if (state.currentSection === 'profile') loadProfile();
  } catch (err) { showToast(err.message || 'Upload failed', 'error', '⚠️'); }
}

async function submitEditProfile(e) {
  e.preventDefault();
  const btn = document.getElementById('ep-submit-btn');
  btn.disabled = true; btn.textContent = 'Saving...';
  const errEl = document.getElementById('ep-error');
  errEl.style.display = 'none';
  try {
    const updated = await api.updateMe({
      bio: document.getElementById('ep-bio').value.trim(),
      rank: document.getElementById('ep-rank').value,
      platform: document.getElementById('ep-platform').value,
      now_playing: document.getElementById('ep-nowplaying').value.trim() || null,
    });
    // Update CURRENT_USER
    const u = window.CURRENT_USER;
    u.bio = updated.bio;
    u.rank = updated.rank;
    u.platform = updated.platform;
    u.now_playing = updated.now_playing;
    closeEditProfile();
    showToast('Profile updated! ✨', 'success', '✅');
    if (state.currentSection === 'profile') loadProfile();
  } catch (err) {
    errEl.textContent = err.message || 'Failed to save';
    errEl.style.display = 'block';
  } finally {
    btn.disabled = false; btn.textContent = 'Save Changes';
  }
}

function searchExploreTag(tag) {
  navigate('explore');
  setTimeout(() => {
    const input = document.getElementById('explore-search');
    if (input) { input.value = tag.replace('#',''); searchExplore(input.value); }
  }, 100);
}

// ================================================================
// MODAL HELPER
// ================================================================

function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.style.display = 'none';
}

// ================================================================
// BOOKMARKS
// ================================================================

async function loadBookmarks() {
  const feed = document.getElementById('bookmarks-feed');
  if (!feed) return;
  feed.innerHTML = '<div class="loading-spinner" style="margin:40px auto"></div>';
  try {
    const posts = await api.getBookmarks();
    if (!posts.length) { feed.innerHTML = '<div style="text-align:center;padding:40px;opacity:.5">No bookmarks yet.<br>Save posts with the bookmark icon.</div>'; return; }
    feed.innerHTML = posts.map(p => renderPost(normalizePost(p))).join('');
  } catch(e) { feed.innerHTML = '<div style="text-align:center;padding:40px;opacity:.5">Failed to load bookmarks.</div>'; }
}

async function toggleBookmark(postId, btn) {
  if (!Auth.isLoggedIn()) { showToast('Log in to bookmark posts'); return; }
  try {
    const res = await api.toggleBookmark(postId);
    const isNowBookmarked = res.action === 'added';
    if (btn) { btn.classList.toggle('active', isNowBookmarked); btn.title = isNowBookmarked ? 'Remove bookmark' : 'Bookmark'; }
    showToast(isNowBookmarked ? 'Bookmarked!' : 'Removed bookmark');
  } catch(e) { showToast('Failed to bookmark', 'error', '⚠️'); }
}

// ================================================================
// POLLS
// ================================================================

function togglePollCompose() {
  const area = document.getElementById('poll-compose-area');
  if (!area) return;
  const show = area.style.display === 'none';
  area.style.display = show ? 'block' : 'none';
  const btn = document.getElementById('poll-toggle-btn');
  if (btn) btn.style.color = show ? '#6c63ff' : '';
}

function addPollOption() {
  const container = document.getElementById('poll-options-container');
  if (!container) return;
  const inputs = container.querySelectorAll('.poll-option-input');
  if (inputs.length >= 4) { showToast('Max 4 poll options'); return; }
  const inp = document.createElement('input');
  inp.className = 'input-field poll-option-input';
  inp.placeholder = `Option ${inputs.length + 1}`;
  inp.style.marginBottom = '6px';
  container.appendChild(inp);
}

function renderPollCard(poll, postId) {
  if (!poll) return '';
  const { options, totalVotes, userVoteId } = poll;
  if (!options || !options.length) return '';
  const hasVoted = !!userVoteId;
  return `<div class="poll-card">
    ${options.map(o => {
      const isVoted = o.id === userVoteId;
      const isWinner = hasVoted && o.pct === Math.max(...options.map(x => x.pct));
      return `<div class="poll-option${isVoted?' voted':''}${isWinner&&hasVoted?' winner':''}" onclick="${hasVoted?'':'castPollVote('+postId+','+o.id+',this.closest(\'.poll-card\'))'}">
        <div class="poll-option-bar" style="width:${hasVoted?o.pct:0}%"></div>
        <span class="poll-option-text">${isVoted?'✓ ':''}${escapeHtml(o.text)}</span>
        ${hasVoted?`<span class="poll-option-pct">${o.pct}%</span>`:''}
      </div>`;
    }).join('')}
    <div class="poll-meta">${totalVotes} vote${totalVotes!==1?'s':''} · ${hasVoted?'You voted':'Tap to vote'}</div>
  </div>`;
}

async function castPollVote(postId, optionId, card) {
  if (!Auth.isLoggedIn()) { showToast('Log in to vote'); return; }
  try {
    const result = await api.votePoll(postId, optionId);
    if (result.error) { showToast(result.error); return; }
    if (card) card.outerHTML = renderPollCard(result, postId);
  } catch(e) { showToast('Failed to vote', 'error', '⚠️'); }
}

// ================================================================
// HASHTAGS / MENTIONS
// ================================================================

function searchHashtag(tag) {
  navigate('search');
  setTimeout(() => {
    const inp = document.getElementById('search-input-big');
    if (inp) { inp.value = '#'+tag; doSearch('#'+tag); }
  }, 100);
}

function searchUser(handle) {
  navigate('search');
  setTimeout(() => {
    const inp = document.getElementById('search-input-big');
    if (inp) { inp.value = '@'+handle; doSearch('@'+handle); }
  }, 100);
}

// ================================================================
// SEARCH
// ================================================================

let searchDebounceTimer = null;

function debounceSearch(q) {
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = setTimeout(() => doSearch(q), 300);
}

async function doSearch(q) {
  const container = document.getElementById('search-results');
  const recentEl = document.getElementById('search-recent');
  if (!container) return;
  q = (q || '').trim();
  if (!q) {
    container.innerHTML = '';
    loadSearchRecent(recentEl);
    return;
  }
  // Save recent
  const recents = JSON.parse(localStorage.getItem('searchRecent') || '[]');
  if (!recents.includes(q)) { recents.unshift(q); localStorage.setItem('searchRecent', JSON.stringify(recents.slice(0,8))); }
  if (recentEl) recentEl.innerHTML = '';
  container.innerHTML = '<div class="loading-spinner" style="margin:30px auto"></div>';

  try {
    // Backend search
    const res = await api.search(q);
    const ql = q.toLowerCase();

    // Also search local GAMES catalog as a fallback
    let localGames = GAMES.filter(g =>
      g.name.toLowerCase().includes(ql) ||
      g.category?.toLowerCase().includes(ql) ||
      g.genre?.toLowerCase().includes(ql)
    );

    // Merge server games with local games (deduplicate by name)
    const serverGameNames = new Set((res.games || []).map(g => g.name.toLowerCase()));
    const allGames = [...(res.games || [])];
    localGames.forEach(g => {
      if (!serverGameNames.has(g.name.toLowerCase())) allGames.push(g);
    });

    let html = '';

    // Games section
    if (allGames.length) {
      html += `<div class="search-section-title">🎮 Games</div><div class="search-games-grid">`;
      html += allGames.slice(0, 12).map(g => {
        const icon = g.icon || g._icon || '🎮';
        const color = g.color || '#6c63ff';
        const cover = g.cover_url
          ? `<img src="${g.cover_url}" class="search-game-cover" onerror="this.style.display='none'">`
          : `<div class="search-game-cover-placeholder" style="background:${color}">${icon}</div>`;
        return `<div class="search-game-card" onclick="navigate('games')">
          ${cover}
          <div class="search-game-card-info">
            <div class="search-game-card-name">${escapeHtml(g.name)}</div>
            <div class="search-game-card-meta">${g.category || g.genre || 'Game'}${g.players ? ` · ${g.players} players` : ''}</div>
          </div>
        </div>`;
      }).join('') + '</div>';
    }

    // Players section
    if (res.users && res.users.length) {
      html += `<div class="search-section-title">👥 Players</div><div class="search-players-list">`;
      html += res.users.map(u => {
        const av = u.avatar_url
          ? `<div class="search-player-avatar" style="background-image:url('${u.avatar_url}');background-size:cover;background-position:center"></div>`
          : `<div class="search-player-avatar" style="background:${u.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'}">${u.avatar||u.username?.[0]?.toUpperCase()||'?'}</div>`;
        return `<div class="search-player-card" onclick="openUserProfile(${u.id})">
          ${av}
          <div class="search-player-info">
            <div class="search-player-name">${escapeHtml(u.username)} ${verifiedBadge(u)} ${planBadge(u.plan)}</div>
            <div class="search-player-handle">@${escapeHtml((u.handle||u.username||'').replace(/^@/,''))}</div>
            ${u.bio ? `<div class="search-player-bio">${escapeHtml(u.bio).slice(0,80)}</div>` : ''}
          </div>
          <span class="${rankBadgeClass(u.rank)}" style="font-size:11px">${u.rank||''}</span>
        </div>`;
      }).join('') + '</div>';
    }

    // Posts section
    if (res.posts && res.posts.length) {
      html += `<div class="search-section-title">📝 Posts</div>`;
      html += res.posts.map(p => renderPost(normalizePost(p))).join('');
    }

    if (!html) html = `<div class="empty-state" style="padding:50px 20px"><div class="empty-icon">🔍</div><p>No results for "${escapeHtml(q)}"</p><span style="color:var(--text-muted)">Try searching for a game, player, or hashtag</span></div>`;
    container.innerHTML = html;
  } catch(e) {
    // Fallback: client-side game search still works
    const ql = q.toLowerCase();
    const localGames = GAMES.filter(g => g.name.toLowerCase().includes(ql) || g.genre?.toLowerCase().includes(ql));
    if (localGames.length) {
      container.innerHTML = `<div class="search-section-title">🎮 Games</div><div class="search-games-grid">${localGames.map(g =>
        `<div class="search-game-card" onclick="navigate('games')">
          <div class="search-game-cover-placeholder" style="background:${g.color||'#6c63ff'}">${g.icon||'🎮'}</div>
          <div class="search-game-card-info"><div class="search-game-card-name">${g.name}</div><div class="search-game-card-meta">${g.category||g.genre||'Game'}</div></div>
        </div>`).join('')}</div>`;
    } else {
      container.innerHTML = '<div style="text-align:center;padding:40px;opacity:.5">Search failed — try again</div>';
    }
  }
}

function loadSearchRecent(el) {
  if (!el) return;
  const recents = JSON.parse(localStorage.getItem('searchRecent') || '[]');
  if (!recents.length) { el.innerHTML = ''; return; }
  el.innerHTML = `<div class="search-recent"><div style="font-size:12px;opacity:.5;width:100%;margin-bottom:2px">Recent searches</div>` +
    recents.map(r => `<div class="search-recent-chip" onclick="document.getElementById('search-input-big').value='${escapeHtml(r).replace(/'/g, "\\'")}';doSearch('${escapeHtml(r).replace(/'/g, "\\'")}')"><span>${escapeHtml(r)}</span> <span onclick="removeSearchRecent('${escapeHtml(r).replace(/'/g, "\\'")}',event)" style="opacity:.4;font-size:10px">✕</span></div>`).join('') + '</div>';
}

function removeSearchRecent(q, e) {
  e.stopPropagation();
  const recents = JSON.parse(localStorage.getItem('searchRecent') || '[]').filter(r => r !== q);
  localStorage.setItem('searchRecent', JSON.stringify(recents));
  loadSearchRecent(document.getElementById('search-recent'));
}

function loadSearch() {
  loadSearchRecent(document.getElementById('search-recent'));
}

// ================================================================
// CLANS
// ================================================================

async function loadClans() {
  searchClans('');
  const myEl = document.getElementById('my-clans-list');
  if (!myEl) return;
  if (!Auth.isLoggedIn()) { myEl.innerHTML = ''; return; }
  try {
    const clans = await api.getMyClans();
    myEl.innerHTML = clans.length ? clans.map(renderClanCard).join('') : '<div style="padding:16px;opacity:.5;font-size:13px">You haven\'t joined any clans yet.</div>';
  } catch(e) { myEl.innerHTML = ''; }
}

async function searchClans(q) {
  const el = document.getElementById('clans-list');
  if (!el) return;
  try {
    const clans = await api.getClans(q);
    el.innerHTML = clans.length ? clans.map(renderClanCard).join('') : '<div style="padding:16px;opacity:.5;font-size:13px">No clans found.</div>';
  } catch(e) { el.innerHTML = '<div style="padding:16px;opacity:.5;font-size:13px">Could not load clans.</div>'; }
}

function renderClanCard(clan) {
  return `<div class="clan-card" onclick="openClanDetail(${clan.id})">
    <div class="clan-card-banner" style="background:${clan.banner_color||'#6c63ff'}"></div>
    <div class="clan-card-body">
      <div class="clan-card-top">
        <div class="clan-avatar" style="background:${clan.banner_color||'#6c63ff'}">${clan.tag?.[0]||'?'}</div>
        <div style="flex:1;padding-top:22px">
          <div class="clan-name">${escapeHtml(clan.name)} <span class="clan-tag">[${escapeHtml(clan.tag)}]</span></div>
          <div class="clan-meta"><span>👥 ${clan.member_count||1} members</span>${clan.game?`<span>🎮 ${escapeHtml(clan.game)}</span>`:''}</div>
        </div>
      </div>
      ${clan.description ? `<div style="font-size:13px;opacity:.6;margin-top:8px;line-height:1.4">${escapeHtml(clan.description)}</div>` : ''}
    </div>
  </div>`;
}

async function openClanDetail(clanId) {
  try {
    const [clan, members] = await Promise.all([api.getClan(clanId), api.getClanMembers(clanId)]);
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.style.cssText = 'display:flex;z-index:1000';
    modal.onclick = e => { if (e.target === modal) modal.remove(); };
    const isMember = clan.isMember;
    modal.innerHTML = `<div class="modal-box" style="max-width:560px;max-height:80vh;overflow-y:auto;padding:0">
      <div class="clan-detail-header" style="background:${clan.banner_color||'#6c63ff'}">
        <button class="modal-close" onclick="this.closest('.modal-overlay').remove()" style="position:absolute;top:8px;right:8px">×</button>
      </div>
      <div class="clan-detail-body">
        <div style="display:flex;align-items:center;gap:12px;margin-top:-22px;margin-bottom:12px">
          <div class="clan-avatar" style="background:${clan.banner_color||'#6c63ff'};width:52px;height:52px;font-size:20px">${clan.tag?.[0]||'?'}</div>
          <div>
            <div style="font-size:18px;font-weight:700">${escapeHtml(clan.name)} <span class="clan-tag">[${escapeHtml(clan.tag)}]</span></div>
            <div class="clan-meta"><span>👥 ${clan.member_count||1} members</span>${clan.game?`<span>🎮 ${escapeHtml(clan.game)}</span>`:''}</div>
          </div>
          <div style="margin-left:auto">
            ${!isMember ? `<button class="btn-primary" onclick="joinClan(${clan.id},this)">Join Clan</button>` : `<button class="btn-secondary" onclick="leaveClanAction(${clan.id},this)">Leave</button>`}
          </div>
        </div>
        ${clan.description ? `<p style="font-size:14px;opacity:.7;margin-bottom:16px">${escapeHtml(clan.description)}</p>` : ''}
        <div class="clan-detail-tabs">
          <div class="clan-detail-tab active" onclick="switchClanTab(this,'members-tab')">Members</div>
          <div class="clan-detail-tab" onclick="switchClanTab(this,'feed-tab',${clan.id})">Feed</div>
        </div>
        <div id="members-tab">
          ${(members||[]).map(m => `<div class="search-user-row" onclick="this.closest('.modal-overlay').remove();openUserProfile(${m.id})">
            <div style="background:${m.gradient||'#6c63ff'};width:38px;height:38px;font-size:14px;flex-shrink:0;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700">${m.avatar||m.username?.[0]?.toUpperCase()||'?'}</div>
            <div style="flex:1"><div style="font-weight:600">${escapeHtml(m.username)} ${m.role==='owner'?'👑':''} ${planBadge(m.plan)}</div><div style="font-size:12px;opacity:.5">@${escapeHtml(m.handle||m.username)}</div></div>
          </div>`).join('')}
        </div>
        <div id="feed-tab" style="display:none"><div class="loading-spinner" style="margin:20px auto"></div></div>
      </div>
    </div>`;
    document.body.appendChild(modal);
  } catch(e) { showToast('Failed to load clan'); }
}

function switchClanTab(btn, tabId, clanId) {
  const body = btn.closest('.clan-detail-body');
  body.querySelectorAll('.clan-detail-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  body.querySelectorAll('[id$="-tab"]').forEach(t => t.style.display='none');
  const tab = body.querySelector('#'+tabId);
  if (tab) tab.style.display='block';
  if (tabId === 'feed-tab' && clanId && tab && tab.innerHTML.includes('loading-spinner')) {
    api.getClanFeed(clanId).then(posts => {
      tab.innerHTML = posts.length ? posts.map(p => renderPost(normalizePost(p))).join('') : '<div style="padding:20px;text-align:center;opacity:.5">No posts yet</div>';
    }).catch(() => { tab.innerHTML = '<div style="padding:20px;text-align:center;opacity:.5">Failed to load feed</div>'; });
  }
}

async function joinClan(clanId, btn) {
  if (!Auth.isLoggedIn()) { showToast('Log in to join clans'); return; }
  try {
    const res = await api.joinClan(clanId);
    if (res.error) { showToast(res.error); return; }
    showToast('Joined clan!');
    if (btn) { btn.textContent = 'Leave'; btn.className = 'btn-secondary'; btn.onclick = () => leaveClanAction(clanId, btn); }
  } catch(e) { showToast('Failed to join clan', 'error', '⚠️'); }
}

async function leaveClanAction(clanId, btn) {
  try {
    const res = await api.leaveClan(clanId);
    if (res.error) { showToast(res.error); return; }
    showToast('Left clan');
    if (btn) { btn.textContent = 'Join Clan'; btn.className = 'btn-primary'; btn.onclick = () => joinClan(clanId, btn); }
  } catch(e) { showToast('Failed to leave clan', 'error', '⚠️'); }
}

function openCreateClan() {
  if (!Auth.isLoggedIn()) { showToast('Log in to create a clan'); return; }
  const plan = window.CURRENT_USER?.plan || 'free';
  if (plan !== 'pro') {
    showUpgradePrompt('Clan creation requires DXED Pro');
    return;
  }
  const m = document.getElementById('create-clan-modal');
  if (m) m.style.display = 'flex';
}

async function submitCreateClan() {
  const name = document.getElementById('clan-name-input')?.value?.trim();
  const tag = document.getElementById('clan-tag-input')?.value?.trim().toUpperCase();
  const game = document.getElementById('clan-game-input')?.value?.trim();
  const description = document.getElementById('clan-desc-input')?.value?.trim();
  const banner_color = document.getElementById('clan-color-input')?.value;
  if (!name || !tag) { showToast('Name and tag required'); return; }
  if (tag.length > 4) { showToast('Tag max 4 characters'); return; }
  try {
    const clan = await api.createClan({ name, tag, game, description, banner_color });
    if (clan.error) { showToast(clan.error); return; }
    closeModal('create-clan-modal');
    showToast('Clan created!');
    loadClans();
    openClanDetail(clan.id);
  } catch(e) { showToast('Failed to create clan'); }
}

// ================================================================
// CHALLENGES WIDGET
// ================================================================

async function loadChallengesWidget() {
  const el = document.getElementById('challenges-list');
  if (!el) return;
  try {
    const challenges = await api.getChallenges();
    if (!challenges || !challenges.length) { el.innerHTML = '<div style="opacity:.5;padding:12px;font-size:13px">No challenges available</div>'; return; }
    el.innerHTML = challenges.map(ch => {
      const pct = Math.min(100, Math.round((ch.progress / ch.target) * 100));
      return `<div class="challenge-item" id="challenge-${ch.id}">
        <div class="challenge-icon">${ch.icon}</div>
        <div class="challenge-info">
          <div class="challenge-title">${escapeHtml(ch.title)}</div>
          <div class="challenge-desc">${escapeHtml(ch.desc)}</div>
          <div class="challenge-progress-bar"><div class="challenge-progress-fill" style="width:${pct}%"></div></div>
          <div style="font-size:11px;opacity:.4;margin-top:2px">${ch.progress}/${ch.target}</div>
        </div>
        <div style="display:flex;flex-direction:column;align-items:center;gap:4px">
          <div class="challenge-xp">+${ch.xp} XP</div>
          ${ch.completed && !ch.claimed ? `<button class="challenge-claim-btn" onclick="claimChallengeXP(${ch.id},this)">Claim!</button>` : ch.claimed ? `<span style="font-size:11px;opacity:.4">✓ Done</span>` : `<span style="font-size:11px;opacity:.3">${pct}%</span>`}
        </div>
      </div>`;
    }).join('');
  } catch(e) { el.innerHTML = '<div style="opacity:.5;padding:12px;font-size:13px">Log in to see challenges</div>'; }
}

async function claimChallengeXP(challengeId, btn) {
  if (btn) { btn.disabled = true; btn.textContent = '...'; }
  try {
    const res = await api.claimChallenge(challengeId);
    if (res.error) { showToast(res.error); if (btn) { btn.disabled = false; btn.textContent = 'Claim!'; } return; }
    showToast(`+${res.xp} XP earned!`);
    const item = document.getElementById(`challenge-${challengeId}`);
    if (item) {
      const claimArea = item.querySelector('.challenge-claim-btn')?.parentElement;
      if (claimArea) claimArea.innerHTML = `<span style="font-size:11px;opacity:.4">✓ Done</span>`;
    }
  } catch(e) { showToast('Failed to claim', 'error', '⚠️'); if (btn) { btn.disabled = false; btn.textContent = 'Claim!'; } }
}

// ================================================================
// TRENDING HASHTAGS
// ================================================================

async function loadTrendingHashtags() {
  const el = document.getElementById('trending-hashtags');
  if (!el) return;
  try {
    const tags = await api.getTrendingHashtags();
    el.innerHTML = tags.map(t => `<span class="hashtag-trending-pill" onclick="searchHashtag('${escapeHtml(t.tag.replace('#',''))}')">${escapeHtml(t.tag)} <span style="opacity:.5">${t.count}</span></span>`).join('');
  } catch(e) {}
}

// ================================================================
// BOOT — Real API version
// ================================================================

// ================================================================
// HASH-BASED ROUTING
// ================================================================

const VALID_SECTIONS = ['home','explore','games','lfg','tournaments','messages','notifications','leaderboard','profile','people','plans','settings','bookmarks','clans','clips','search'];

async function handleHashRoute() {
  const hash = window.location.hash.slice(1); // remove '#'
  if (!hash) return false;

  // User profile: #@handle
  if (hash.startsWith('@')) {
    const handle = hash.slice(1); // remove '@'
    if (!handle) return false;
    try {
      const user = await api.getUserByHandle(handle);
      if (user) {
        const myId = +(window.Auth?.getUser()?.id || window.CURRENT_USER.id || 0);
        if (+user.id === myId) {
          navigate('profile', true);
        } else {
          state._profileUserId = +user.id;
          state._profileBack = 'home';
          navigate('user-profile', true);
        }
        return true;
      }
    } catch { /* user not found, fall through */ }
    return false;
  }

  // Section routes: #explore, #games, #settings, etc.
  if (VALID_SECTIONS.includes(hash)) {
    navigate(hash, true);
    return true;
  }

  return false;
}

window.addEventListener('popstate', () => {
  handleHashRoute().then(handled => {
    if (!handled) navigate('home', true);
  });
});

// ================================================================
// ADMIN PANEL (Owner only - @Dexide)
// ================================================================
let _adminTab = 'dashboard';
let _adminUserSearch = '';
let _adminUserPage = 1;

async function loadAdmin() {
  const container = document.getElementById('admin-container');
  if (!container) return;
  if (window.CURRENT_USER?.id !== 1) {
    container.innerHTML = `<div class="empty-state"><div class="empty-icon">🔒</div><p>Access denied</p></div>`;
    return;
  }
  container.innerHTML = `
    <div class="adm-tabs">
      <button class="adm-tab ${_adminTab==='dashboard'?'active':''}" onclick="switchAdminTab('dashboard')">Dashboard</button>
      <button class="adm-tab ${_adminTab==='users'?'active':''}" onclick="switchAdminTab('users')">Users</button>
      <button class="adm-tab ${_adminTab==='content'?'active':''}" onclick="switchAdminTab('content')">Content</button>
      <button class="adm-tab ${_adminTab==='badges'?'active':''}" onclick="switchAdminTab('badges')">Badges</button>
    </div>
    <div id="adm-content"></div>
  `;
  await renderAdminTab();
}

function switchAdminTab(tab) {
  _adminTab = tab;
  document.querySelectorAll('.adm-tab').forEach(b => b.classList.remove('active'));
  const btn = document.querySelector(`.adm-tab[onclick*="${tab}"]`);
  if (btn) btn.classList.add('active');
  renderAdminTab();
}

async function renderAdminTab() {
  const el = document.getElementById('adm-content');
  if (!el) return;
  el.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)"><div class="spinner" style="margin:0 auto 12px"></div></div>`;

  if (_adminTab === 'dashboard') await renderAdminDashboard(el);
  else if (_adminTab === 'users') await renderAdminUsers(el);
  else if (_adminTab === 'content') await renderAdminContent(el);
  else if (_adminTab === 'badges') renderAdminBadges(el);
}

async function renderAdminDashboard(el) {
  try {
    const s = await api.adminStats();
    el.innerHTML = `
      <div class="adm-stats-grid">
        <div class="adm-stat-card adm-stat-purple">
          <div class="adm-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg></div>
          <div class="adm-stat-val">${formatNum(s.totalUsers)}</div>
          <div class="adm-stat-label">Total Users</div>
          <div class="adm-stat-sub">+${s.usersToday} today / +${s.usersThisWeek} this week</div>
        </div>
        <div class="adm-stat-card adm-stat-blue">
          <div class="adm-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg></div>
          <div class="adm-stat-val">${formatNum(s.totalPosts)}</div>
          <div class="adm-stat-label">Total Posts</div>
          <div class="adm-stat-sub">+${s.postsToday} today / +${s.postsThisWeek} this week</div>
        </div>
        <div class="adm-stat-card adm-stat-green">
          <div class="adm-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
          <div class="adm-stat-val">${s.onlineCount}</div>
          <div class="adm-stat-label">Online Now</div>
          <div class="adm-stat-sub">${s.commentsToday} comments today</div>
        </div>
        <div class="adm-stat-card adm-stat-amber">
          <div class="adm-stat-icon"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg></div>
          <div class="adm-stat-val">${formatNum(s.totalReactions)}</div>
          <div class="adm-stat-label">Total Reactions</div>
          <div class="adm-stat-sub">${formatNum(s.totalComments)} comments</div>
        </div>
      </div>

      <div class="adm-row">
        <div class="adm-card">
          <div class="adm-card-title">Subscription Breakdown</div>
          <div class="adm-plan-bars">
            <div class="adm-plan-row">
              <span class="adm-plan-label">Free</span>
              <div class="adm-plan-bar"><div class="adm-plan-fill" style="width:${s.totalUsers?Math.round((s.planCounts.free/s.totalUsers)*100):0}%;background:#6b7280"></div></div>
              <span class="adm-plan-count">${s.planCounts.free||0}</span>
            </div>
            <div class="adm-plan-row">
              <span class="adm-plan-label" style="color:#a78bfa">DXED+</span>
              <div class="adm-plan-bar"><div class="adm-plan-fill" style="width:${s.totalUsers?Math.round((s.planCounts.plus/s.totalUsers)*100):0}%;background:#8b5cf6"></div></div>
              <span class="adm-plan-count">${s.planCounts.plus||0}</span>
            </div>
            <div class="adm-plan-row">
              <span class="adm-plan-label" style="color:#fbbf24">DXED Pro</span>
              <div class="adm-plan-bar"><div class="adm-plan-fill" style="width:${s.totalUsers?Math.round((s.planCounts.pro/s.totalUsers)*100):0}%;background:#f59e0b"></div></div>
              <span class="adm-plan-count">${s.planCounts.pro||0}</span>
            </div>
          </div>
        </div>
        <div class="adm-card">
          <div class="adm-card-title">Platform Stats</div>
          <div class="adm-misc-stats">
            <div class="adm-misc-row"><span>LFG Posts</span><strong>${s.lfgPosts}</strong></div>
            <div class="adm-misc-row"><span>Clans</span><strong>${s.clans}</strong></div>
            <div class="adm-misc-row"><span>Messages</span><strong>${formatNum(s.messages)}</strong></div>
          </div>
        </div>
      </div>

      <div class="adm-card">
        <div class="adm-card-title">User Growth (14 Days)</div>
        <div class="adm-growth-chart">
          ${s.growth.map(d => `
            <div class="adm-growth-bar-wrap">
              <div class="adm-growth-bar" style="height:${d.users?Math.max(8,d.users*20):4}px" title="${d.users} new users"></div>
              <span class="adm-growth-label">${d.day}</span>
            </div>
          `).join('')}
        </div>
      </div>

      ${s.topPosters.length ? `
      <div class="adm-card">
        <div class="adm-card-title">Top Posters</div>
        <div class="adm-top-list">
          ${s.topPosters.map((u, i) => `
            <div class="adm-top-item" onclick="openProfileById(${u.id})">
              <span class="adm-top-rank">${i+1}</span>
              <div class="adm-top-avatar" style="background:${u.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};${u.avatar_url?`background-image:url('${u.avatar_url}');background-size:cover`:''}">${u.avatar_url?'':u.avatar||'?'}</div>
              <span class="adm-top-name">${u.username}</span>
              <span class="adm-top-count">${u.count} posts</span>
            </div>
          `).join('')}
        </div>
      </div>` : ''}
    `;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><p>Failed to load stats</p></div>`;
  }
}

async function renderAdminUsers(el) {
  try {
    const data = await api.adminUsers(_adminUserSearch, _adminUserPage);
    el.innerHTML = `
      <div class="adm-toolbar">
        <div class="adm-search-wrap">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="var(--text-muted)" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input class="adm-search" placeholder="Search users by name, handle, or email..." value="${_adminUserSearch}" oninput="admSearchUsers(this.value)">
        </div>
        <span class="adm-count">${data.total} users</span>
      </div>
      <div class="adm-users-table">
        <div class="adm-table-head">
          <span class="adm-th" style="flex:2">User</span>
          <span class="adm-th">Plan</span>
          <span class="adm-th">Badge</span>
          <span class="adm-th">Status</span>
          <span class="adm-th" style="flex:1.5">Actions</span>
        </div>
        ${data.users.map(u => `
          <div class="adm-table-row" id="adm-user-${u.id}">
            <div class="adm-td" style="flex:2;display:flex;align-items:center;gap:10px;cursor:pointer" onclick="openProfileById(${u.id})">
              <div class="adm-user-av" style="background:${u.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};${u.avatar_url?`background-image:url('${u.avatar_url}');background-size:cover`:''}">${u.avatar_url?'':u.avatar||'?'}</div>
              <div>
                <div style="font-weight:700;font-size:13px;color:white">${escapeHtml(u.username||'')}</div>
                <div style="font-size:11px;color:var(--text-muted)">@${u.handle||u.username} &middot; ID: ${u.id}</div>
              </div>
            </div>
            <div class="adm-td">
              <select class="adm-select" onchange="admUpdateUser(${u.id},{plan:this.value})">
                <option value="free" ${(u.plan||'free')==='free'?'selected':''}>Free</option>
                <option value="plus" ${u.plan==='plus'?'selected':''}>DXED+</option>
                <option value="pro" ${u.plan==='pro'?'selected':''}>Pro</option>
              </select>
            </div>
            <div class="adm-td">
              <select class="adm-select" onchange="admUpdateUser(${u.id},{badge_type:this.value})">
                <option value="" ${!u.badge_type?'selected':''}>None</option>
                <option value="official" ${u.badge_type==='official'?'selected':''}>Official</option>
                <option value="verified" ${u.badge_type==='verified'?'selected':''}>Verified</option>
                <option value="trusted" ${u.badge_type==='trusted'?'selected':''}>Trusted</option>
                <option value="gold" ${u.badge_type==='gold'?'selected':''}>Gold</option>
                <option value="premium" ${u.badge_type==='premium'?'selected':''}>Premium</option>
                <option value="creator" ${u.badge_type==='creator'?'selected':''}>Creator</option>
                <option value="partner" ${u.badge_type==='partner'?'selected':''}>Partner</option>
                <option value="staff" ${u.badge_type==='staff'?'selected':''}>Staff</option>
                <option value="admin" ${u.badge_type==='admin'?'selected':''}>Admin</option>
                <option value="legend" ${u.badge_type==='legend'?'selected':''}>Legend</option>
                <option value="newcomer" ${u.badge_type==='newcomer'?'selected':''}>New</option>
                <option value="elite" ${u.badge_type==='elite'?'selected':''}>Elite</option>
              </select>
            </div>
            <div class="adm-td">
              <span class="adm-status ${u.online?'adm-online':'adm-offline'}">${u.online?'Online':'Offline'}</span>
            </div>
            <div class="adm-td" style="flex:1.5;display:flex;gap:6px">
              <button class="adm-btn adm-btn-warn" onclick="admBanUser(${u.id},'${escapeHtml(u.username||'')}')" title="Ban">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
              </button>
              <button class="adm-btn adm-btn-danger" onclick="admDeleteUser(${u.id},'${escapeHtml(u.username||'')}')" title="Delete">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2m2 0v14a2 2 0 01-2 2H8a2 2 0 01-2-2V6h12"/></svg>
              </button>
            </div>
          </div>
        `).join('')}
      </div>
      ${data.pages > 1 ? `
      <div class="adm-pagination">
        ${_adminUserPage > 1 ? `<button class="adm-btn" onclick="_adminUserPage--;renderAdminTab()">Prev</button>` : ''}
        <span class="adm-page-info">Page ${data.page} of ${data.pages}</span>
        ${_adminUserPage < data.pages ? `<button class="adm-btn" onclick="_adminUserPage++;renderAdminTab()">Next</button>` : ''}
      </div>` : ''}
    `;
  } catch (err) {
    el.innerHTML = `<div class="empty-state"><p>Failed to load users</p></div>`;
  }
}

let _admSearchTimeout;
function admSearchUsers(q) {
  clearTimeout(_admSearchTimeout);
  _admSearchTimeout = setTimeout(() => {
    _adminUserSearch = q;
    _adminUserPage = 1;
    renderAdminTab();
  }, 300);
}

async function admUpdateUser(id, changes) {
  try {
    await api.adminUpdateUser(id, changes);
    showToast('User updated', 'success');
  } catch (err) {
    showToast('Update failed: ' + (err.message || ''), 'error');
  }
}

async function admBanUser(id, name) {
  if (!confirm(`Ban user "${name}"? They will be unable to use the platform.`)) return;
  try {
    await api.adminUpdateUser(id, { banned: true, ban_reason: 'Banned by admin' });
    showToast(`${name} has been banned`, 'success');
    renderAdminTab();
  } catch (err) {
    showToast('Ban failed', 'error');
  }
}

async function admDeleteUser(id, name) {
  if (!confirm(`Permanently delete user "${name}" and all their data? This cannot be undone.`)) return;
  if (!confirm(`Are you absolutely sure? This is irreversible.`)) return;
  try {
    await api.adminDeleteUser(id);
    showToast(`${name} has been deleted`, 'success');
    renderAdminTab();
  } catch (err) {
    showToast('Delete failed', 'error');
  }
}

async function admDeletePost(id) {
  if (!confirm('Delete this post?')) return;
  try {
    await api.adminDeletePost(id);
    showToast('Post deleted', 'success');
    renderAdminTab();
  } catch (err) {
    showToast('Delete failed', 'error');
  }
}

async function renderAdminContent(el) {
  try {
    const data = await api.adminReported();
    el.innerHTML = `
      <div class="adm-card" style="margin-top:0">
        <div class="adm-card-title">Recent Posts</div>
        <p style="font-size:12px;color:var(--text-muted);margin:0 0 16px">Review and moderate recent content across the platform.</p>
        <div class="adm-content-list">
          ${data.posts.map(p => `
            <div class="adm-content-item">
              <div class="adm-content-meta">
                <div class="adm-user-av" style="background:${p.user?.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};${p.user?.avatar_url?`background-image:url('${p.user.avatar_url}');background-size:cover`:''};width:28px;height:28px;font-size:10px">${p.user?.avatar_url?'':p.user?.avatar||'?'}</div>
                <strong>${p.user?.username||'Unknown'}</strong>
                <span style="color:var(--text-muted);font-size:11px">${p.time||''}</span>
              </div>
              <div class="adm-content-body">${escapeHtml((p.body||'').substring(0,200))}${(p.body||'').length>200?'...':''}</div>
              ${p.image_url?`<img src="${p.image_url}" style="max-width:200px;border-radius:8px;margin-top:6px">`:''}
              <div class="adm-content-actions">
                <span style="font-size:11px;color:var(--text-muted)">${p.type||'post'} &middot; ${totalReactions(p.reactions||{})} reactions &middot; ${p.comments_count||0} comments</span>
                <button class="adm-btn adm-btn-danger" onclick="admDeletePost(${p.id})">Delete Post</button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  } catch {
    el.innerHTML = `<div class="empty-state"><p>Failed to load content</p></div>`;
  }
}

function renderAdminBadges(el) {
  const badges = Object.entries(BADGE_TYPES);
  el.innerHTML = `
    <div class="adm-card" style="margin-top:0">
      <div class="adm-card-title">Badge Reference</div>
      <p style="font-size:12px;color:var(--text-muted);margin:0 0 16px">All available verification badge types. Assign badges from the Users tab.</p>
      <div class="adm-badges-grid">
        ${badges.map(([key, b]) => `
          <div class="adm-badge-card">
            <div class="adm-badge-preview">${verifiedBadge({verified:true,badge_type:key}, true)}</div>
            <div class="adm-badge-info">
              <div class="adm-badge-name">${b.title}</div>
              <div class="adm-badge-key">${key}</div>
              <div class="adm-badge-color" style="color:${b.color}">${b.color}</div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
}

async function init(user) {
  if (user) {
    const u = window.CURRENT_USER;
    u.id        = user.id;
    u.name      = user.username;
    u.handle    = '@' + user.handle;
    u.avatar    = user.avatar;
    u.rank      = user.rank;
    u.bio       = user.bio;
    u.followers = user.followers;
    u.following = user.following;
    u.posts     = user.posts_count;
    u.platform  = user.platform;
    u.region    = user.region;
    u.gradient  = user.gradient;
    u.avatar_url = user.avatar_url || null;
    u.email     = user.email;
    u.games     = user.games || [];
  }
  // Show admin nav only for platform owner (user_id=1)
  const adminNav = document.getElementById('nav-admin');
  if (adminNav) adminNav.style.display = (window.CURRENT_USER?.id === 1) ? '' : 'none';

  updateSidebarUser();
  await loadWidgets();
  // Route based on initial URL hash, or default to home
  const handled = await handleHashRoute();
  if (!handled) navigate('home');
  await updateNotifBadge();
  loadChallengesWidget();
  loadTrendingHashtags();
  // Pre-load game list for dropdowns + refresh trending widget once data loads
  api.getTrendingGames(500).then(g => {
    if (g && g.length) {
      _liveGames = g;
      _populateGameDropdowns();
      loadWidgets(); // refresh trending games widget with real data
    }
  }).catch(()=>{});
}

window.addEventListener('DOMContentLoaded', () => {
  initLFGModal();
  // Apply saved theme/accent
  const savedAccent = localStorage.getItem('nx_accent');
  if (savedAccent) document.documentElement.style.setProperty('--accent', savedAccent);
  const savedTheme = localStorage.getItem('nx_theme');
  if (savedTheme === 'light') setTheme('light');
  if (window.bootWithAuth) bootWithAuth();
  else init(null);
});

// ================================================================
// CLIPS (Video-only)
// ================================================================

let _clipsTab = 'trending';
let _clipVideoFile = null;

function switchClipsTab(btn, tab) {
  document.querySelectorAll('#clips-section .tab-btn').forEach(b => b.classList.remove('active'));
  if (btn) btn.classList.add('active');
  _clipsTab = tab;
  loadClips();
}

async function loadClips() {
  const feed = document.getElementById('clips-feed');
  if (!feed) return;
  const gameFilter = document.getElementById('clips-game-filter');
  // Populate game filter
  if (gameFilter && gameFilter.options.length <= 1) {
    GAMES.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.name; opt.textContent = `${g.icon} ${g.name}`;
      gameFilter.appendChild(opt);
    });
  }
  feed.innerHTML = `<div style="padding:40px;text-align:center;color:var(--text-muted)">Loading clips...</div>`;
  try {
    const posts = await api.getFeed('for-you');
    const normalized = posts.map(normalizePost);
    const selectedGame = gameFilter?.value || '';
    // Only show posts with actual video clips
    let clips = normalized.filter(p => p.type === 'clip' && p.clip_url);
    if (selectedGame) clips = clips.filter(p => p.game === selectedGame);
    if (_clipsTab === 'my-clips') {
      const myId = window.CURRENT_USER.id;
      clips = clips.filter(p => (p.user?.id || p.user_id) === myId);
    } else if (_clipsTab === 'trending') {
      clips.sort((a,b) => totalReactions(b.reactions) - totalReactions(a.reactions));
    }
    feed.innerHTML = clips.length
      ? `<div class="clips-grid">${clips.map(c => renderClipCard(c)).join('')}</div>`
      : `<div class="empty-state"><div class="empty-icon">🎬</div><p>No video clips yet${_clipsTab==='my-clips'?' — upload your first clip!':''}</p>
         <button class="btn-primary" style="margin-top:12px" onclick="openClipUpload()">Upload Clip</button></div>`;
  } catch {
    feed.innerHTML = `<div class="empty-state"><div class="empty-icon">⚠️</div><p>Could not load clips</p></div>`;
  }
}

function renderClipCard(post) {
  const user = post.user || {};
  const total = totalReactions(post.reactions || {});
  return `<div class="clip-card" onclick="openVideoPlayer(${post.id})">
    <div class="clip-card-thumb">
      <video src="${post.clip_url}" muted preload="metadata"></video>
      <div class="clip-card-play">▶</div>
      <div class="clip-card-duration" id="dur-${post.id}"></div>
      ${post.game ? `<span class="clip-card-game">${post.game}</span>` : ''}
    </div>
    <div class="clip-card-info">
      <div class="clip-card-avatar" style="background:${user.gradient||'linear-gradient(135deg,#8b5cf6,#3b82f6)'};${user.avatar_url?`background-image:url('${user.avatar_url}');background-size:cover`:''}">${user.avatar_url?'':user.avatar||'?'}</div>
      <div class="clip-card-meta">
        <div class="clip-card-title">${escapeHtml((post.body||'Untitled clip').slice(0,60))}</div>
        <div class="clip-card-sub">${userName(user)} · ${formatNum(total)} ❤️ · ${post.views||0} views</div>
      </div>
    </div>
  </div>`;
}

function playClipInline(card, url, postId) {
  const vid = card.querySelector('video');
  const playBtn = card.querySelector('.clip-card-play');
  if (!vid) return;
  if (vid.paused) {
    // Pause all other clips
    document.querySelectorAll('.clip-card video').forEach(v => { if (v !== vid) { v.pause(); v.muted = true; } });
    document.querySelectorAll('.clip-card-play').forEach(p => p.textContent = '▶');
    vid.muted = false;
    vid.play();
    if (playBtn) playBtn.textContent = '⏸';
  } else {
    vid.pause();
    if (playBtn) playBtn.textContent = '▶';
  }
}

// Clip upload modal
function openClipUpload() {
  _clipVideoFile = null;
  document.getElementById('clip-upload-modal').classList.remove('hidden');
  document.getElementById('clip-upload-placeholder').style.display = '';
  document.getElementById('clip-video-preview-wrap').style.display = 'none';
  document.getElementById('clip-title-input').value = '';
  document.getElementById('clip-desc-input').value = '';
  // Populate game select
  const sel = document.getElementById('clip-game-select');
  if (sel && sel.options.length <= 1) {
    GAMES.forEach(g => {
      const opt = document.createElement('option');
      opt.value = g.name; opt.textContent = `${g.icon} ${g.name}`;
      sel.appendChild(opt);
    });
  }
}

function closeClipUpload() {
  document.getElementById('clip-upload-modal').classList.add('hidden');
  _clipVideoFile = null;
}

function handleClipVideoSelect(input) {
  const file = input.files[0];
  if (!file) return;
  if (!file.type.startsWith('video/')) {
    showToast('Only video files are allowed for clips', 'error', '⚠️');
    input.value = '';
    return;
  }
  if (file.size > 100 * 1024 * 1024) {
    showToast('Video must be under 100MB', 'error', '⚠️');
    input.value = '';
    return;
  }
  _clipVideoFile = file;
  const url = URL.createObjectURL(file);
  document.getElementById('clip-upload-placeholder').style.display = 'none';
  document.getElementById('clip-video-preview-wrap').style.display = '';
  const vid = document.getElementById('clip-video-preview');
  vid.src = url;
  // Check duration
  vid.onloadedmetadata = () => {
    if (vid.duration > 60) {
      showToast('Clip must be 60 seconds or shorter', 'error', '⚠️');
      clearClipVideo();
    }
  };
}

function clearClipVideo(e) {
  if (e) e.stopPropagation();
  _clipVideoFile = null;
  document.getElementById('clip-upload-placeholder').style.display = '';
  document.getElementById('clip-video-preview-wrap').style.display = 'none';
  document.getElementById('clip-video-input').value = '';
}

async function submitClipUpload() {
  if (!_clipVideoFile) {
    showToast('Select a video clip first', 'error', '⚠️');
    return;
  }
  const title = document.getElementById('clip-title-input').value.trim();
  const desc = document.getElementById('clip-desc-input').value.trim();
  const game = document.getElementById('clip-game-select').value;
  const platform = document.getElementById('clip-platform-select').value;
  const body = title ? (desc ? `${title}\n\n${desc}` : title) : (desc || '🎬 New clip');

  const btn = document.getElementById('clip-submit-btn');
  btn.disabled = true;
  btn.textContent = 'Uploading...';

  const token = Auth.getToken();
  const authHeaders = token ? { 'Authorization': 'Bearer ' + token } : {};

  try {
    // Step 1: Upload the video file to the clip upload endpoint
    const fd = new FormData();
    fd.append('clip', _clipVideoFile);
    btn.textContent = 'Uploading video...';
    const uploadRes = await fetch('/api/posts/upload-clip', {
      method: 'POST',
      headers: authHeaders,
      body: fd,
    });
    if (!uploadRes.ok) {
      const err = await uploadRes.json().catch(() => ({}));
      throw new Error(err.error || 'Video upload failed');
    }
    const { url: clipUrl } = await uploadRes.json();

    // Step 2: Create the post with the clip URL
    btn.textContent = 'Creating post...';
    const postRes = await fetch('/api/posts', {
      method: 'POST',
      headers: { ...authHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body,
        type: 'clip',
        game: game || null,
        platform: platform || null,
        clip_url: clipUrl,
      }),
    });
    if (!postRes.ok) {
      const err = await postRes.json().catch(() => ({}));
      throw new Error(err.error || 'Post creation failed');
    }
    showToast('Clip uploaded! 🎬', 'success', '🎬');
    closeClipUpload();
    loadClips();
  } catch (err) {
    showToast(err.message || 'Failed to upload clip', 'error', '⚠️');
  } finally {
    btn.disabled = false;
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="16" height="16"><polygon points="23 7 16 12 23 17 23 7" stroke="currentColor" stroke-width="2" fill="none"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2" stroke="currentColor" stroke-width="2" fill="none"/></svg> Post Clip`;
  }
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  const shortcuts = { h:'home', e:'explore', g:'games', l:'lfg', t:'tournaments', m:'messages', n:'notifications', b:'leaderboard', p:'profile' };
  if (shortcuts[e.key]) navigate(shortcuts[e.key]);
  if (e.key === 'Escape') { closePostModal(); closeProfileModal(); closeLFGModal(); closeFollowModal(); }
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') { e.preventDefault(); openPostModal(); }
});
