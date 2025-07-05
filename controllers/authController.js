const jwt = require('jsonwebtoken');

exports.login = (req, res) => {
  const { email } = req.body;
  if (!email) return res.send({ success: false, message: 'Email is required' });

  const token = jwt.sign({ userEmail: email }, process.env.JWT_SECRET, { expiresIn: '2d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 2 * 24 * 60 * 60 * 1000,
    path: '/'
  }).send({ success: true, token });
};

exports.logout = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  }).send({ success: true });
};
