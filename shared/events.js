/**
 * NEXUS GG — Socket event name constants
 * Shared between server (Node) and client (browser).
 */
const EVENTS = {
  // Posts
  POST_NEW:        'post:new',
  POST_COMMENT:    'post:comment',

  // Messages
  MESSAGE_SEND:    'message:send',
  MESSAGE_RECEIVE: 'message:receive',
  MESSAGE_SENT:    'message:sent',

  // Typing
  TYPING_START:    'typing:start',
  TYPING_STOP:     'typing:stop',

  // User presence
  USER_ONLINE:     'user:online',
  USER_OFFLINE:    'user:offline',
  USER_STATUS:     'user:status',
  STATUS_UPDATE:   'status:update',

  // LFG
  LFG_NEW:         'lfg:new',
  LFG_UPDATE:      'lfg:update',
};

// CommonJS (Node) + browser global
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EVENTS;
} else if (typeof window !== 'undefined') {
  window.EVENTS = EVENTS;
}
