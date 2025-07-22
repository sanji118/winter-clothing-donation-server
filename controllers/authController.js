const jwt = require('jsonwebtoken');
const { getCollection } = require('../utils/connectDB');


//middleware
exports.verifyToken = async (req, res, next ) => {
  const token = req.cookies.token;
  if(!token) return res.status(401).send({ success: false, message: 'Unauthorized.'});

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if(err) return res.status(403).send({ success: false, message: 'Forbidden'});

    const userCollection = await getCollection('users');
    const user = await userCollection.findOne({ email: decoded.userEmail });

    if(!user) return res.status(401).send({success: false , message: 'User not found'});


    req.user = decoded;
    next();
  })
}

exports.verifyRole = (roles) => {
  return (req, res, next) => {
    if(!roles.includes(req.user.role)) {
      return res.status(403).send({ success: false, message: 'Access denied: invalid role'})
    }
    next();
  }
}


//auth functions
exports.login = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.send({ success: false, message: 'Email is required' });

    const userCollection = await getCollection('users');
    const user = await userCollection.findOne({ email });

    if(!user) return res.status(404).send({success: false, message: 'User not found.'})


    const token = jwt.sign(
      { userEmail: email , role: user.role},
      process.env.JWT_SECRET, 
      { expiresIn: '2d' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000,
      path: '/'
    }).send({ success: true, token , user: {
      name: user.name,
      email: user.email,
      role: user.role
    }});
  } catch (error) {
    console.error('Login error: ', error);
    res.status(500).send({ success: false, message: 'Internal server Error'})
  }
  
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  }).send({ success: true });
};
