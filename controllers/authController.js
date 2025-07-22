const jwt = require('jsonwebtoken');
const { getCollection } = require('../utils/connectDB');
const { ObjectId } = require('mongodb');

// Constants
const ROLES = {
  USER: 'user',
  ADMIN: 'admin',
  PARTNER: 'partner',
  VOLUNTEER: 'volunteer'
};
exports.ROLES = ROLES;

const JWT_CONFIG = {
  expiresIn: '2d',
  issuer: 'your-app-name'
};

// Middleware
exports.verifyToken = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ success: false, message: 'Unauthorized - No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userCollection = await getCollection('users');
    const user = await userCollection.findOne({ email: decoded.userEmail });

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    req.user = {
      ...decoded,
      id: user._id.toString()
    };
    next();
  } catch (err) {
    console.error('Token verification error:', err);
    return res.status(403).json({ success: false, message: 'Invalid or expired token' });
  }
};

exports.verifyRole = (allowedRoles = []) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required roles: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
};

// Auth Functions
exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    const userCollection = await getCollection('users');
    const user = await userCollection.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const token = jwt.sign(
      { 
        userEmail: email,
        role: user.role,
        userId: user._id.toString() 
      },
      process.env.JWT_SECRET,
      JWT_CONFIG
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000,
      path: '/'
    }).json({ 
      success: true, 
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        photo: user.photo
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

exports.getMe = async (req, res) => {
  try {
    const userCollection = await getCollection('users');
    const user = await userCollection.findOne(
      { email: req.user.userEmail },
      { projection: { password: 0 } }
    );
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    
    res.json({ success: true, user });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  }).json({ success: true });
};





exports.checkRole = async (req, res) => {
  try {
    const { role } = req.params;
    res.json({ hasRole: req.user.role === role });
  } catch (error) {
    console.error('Role check error:', error);
    res.status(500).json({ success: false, message: 'Error checking role' });
  }
};
