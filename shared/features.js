/**
 * DXED — Subscription feature gate helper
 * Shared between server (Node) and client (browser).
 */
const FEATURE_GATES = {
  claude_bot:      ['plus', 'pro'],
  accent_colors:   ['plus', 'pro'],
  animated_frame:  ['plus', 'pro'],
  priority_lfg:    ['plus', 'pro'],
  clan_create:     ['pro'],
  tournament_host: ['pro'],
  extended_clips:  ['pro'],
  analytics:       ['pro'],
};

const PLAN_LIMITS = {
  free:  { max_posts: 100, max_clip_seconds: 60 },
  plus:  { max_posts: 500, max_clip_seconds: 60 },
  pro:   { max_posts: Infinity, max_clip_seconds: 600 },
};

function hasFeature(user, feature) {
  const plan = (user && user.plan) || 'free';
  const allowed = FEATURE_GATES[feature];
  return allowed ? allowed.includes(plan) : false;
}

function getPlanLimits(plan) {
  return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
}

// CommonJS (Node) + browser global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { hasFeature, getPlanLimits, FEATURE_GATES, PLAN_LIMITS };
} else if (typeof window !== 'undefined') {
  window.hasFeature = hasFeature;
  window.getPlanLimits = getPlanLimits;
  window.FEATURE_GATES = FEATURE_GATES;
  window.PLAN_LIMITS = PLAN_LIMITS;
}
