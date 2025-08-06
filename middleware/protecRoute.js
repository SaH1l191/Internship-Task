import User from '../models/userModel.js'
import jwt from 'jsonwebtoken'

const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.accesstoken;
    console.log("token",token)

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("decodede ",decoded)

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({ message: 'Unauthorized: User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized: Invalid token' });
  }
};

export default protectRoute;
