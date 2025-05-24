const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET must be defined in your environment variables');
}

// Middleware to verify access tokens
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }

    req.user = {
      userId: decoded.userId,
      ...decoded, // support for future role-based access
    };

    next();
  } catch (err) {
    // For refresh flow compatibility, don’t flood logs for every client retry
    if (req.path !== '/api/users/refresh-token') {
      console.error('Invalid token:', err.message);
    }

    return res.status(401).json({ error: 'Unauthorized: Invalid or expired token' });
  }
};

module.exports = authMiddleware;
