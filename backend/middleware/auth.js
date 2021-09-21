const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authiorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'SECRET_RANDOM_TOKEN_GENERATE');
    const userId = decodedToken.userId;

    if (req.body.userId && req.body.userId !== userId) {
      throw 'invalid userId';
    } else {
      next();
    }
  } catch {
    res.status(401).json({
      error: new Error('wrong status token received!'),
    });
  }
};
