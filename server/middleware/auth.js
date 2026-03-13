const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'dxed_super_secret_key_change_this_in_production';

function requireAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (!header) return res.status(401).json({ error: 'No token provided' });
  const token = header.startsWith('Bearer ') ? header.slice(7) : header;
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

function optionalAuth(req, res, next) {
  const header = req.headers['authorization'];
  if (header) {
    const token = header.startsWith('Bearer ') ? header.slice(7) : header;
    try { req.user = jwt.verify(token, JWT_SECRET); } catch {}
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
