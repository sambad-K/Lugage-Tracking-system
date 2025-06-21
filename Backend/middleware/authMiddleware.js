import jwt from 'jsonwebtoken';

const jwtSecret = '9793615b5d209d020375f6f4d2fa959a2bded2452e5a759dc5cdfa1e6a5c97ea177e1770430f78ac0ecee885fe4dcc919c0654456c81efaa95328e7d7deb9314'; // Replace with your own secret key

const authMiddleware = (req, res, next) => {
  const token = req.headers['authorization'];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Failed to authenticate token' });
    }

    req.userId = decoded.id;
    next();
  });
};

export default authMiddleware;

