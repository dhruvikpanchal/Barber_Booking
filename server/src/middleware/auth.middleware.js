import { ApiError, verifyToken } from '../utils/index.js';

export const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new ApiError(401, 'Unauthorized: No token provided');
    }

    const token = authHeader.split(' ')[1]?.trim();

    if (!token) {
      throw new ApiError(401, 'Unauthorized: Token missing');
    }

    const decoded = verifyToken({ token: token });

    req.user = {
      id: decoded.id,
      role: decoded.role,
    };

    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        statusCode: 401,
        message: 'Token expired',
        success: false,
      });
    }

    return res.status(401).json({
      statusCode: 401,
      message: 'Invalid token',
      success: false,
    });
  }
};
