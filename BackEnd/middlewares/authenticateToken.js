const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();


const authenticateToken = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1];
    const SECRET_KEY = process.env.SECRET_KEY;

    if (!token) return res.status(401).json({ message: 'Access Denied' });
  
    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) return res.status(403).json({ message: 'Invalid Token',err:err });
      req.user = user;
      next();
    });
  };

  module.exports = authenticateToken;
  