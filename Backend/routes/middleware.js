
const jwt = require('jsonwebtoken');

const { JWT_SECRET } = require('../config.js');

async function authMiddleware (req, res, next) {
     // JWT is always in req.body.authorization 
    
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) { 
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.userId = decoded;
        next();
      } catch (error) {
        return res.status(403).send('User Authentication failed');
      }
  }

  module.exports = authMiddleware;