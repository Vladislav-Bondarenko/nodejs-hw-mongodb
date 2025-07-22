import jwt from 'jsonwebtoken';
import createError from 'http-errors';
import { Session } from '../models/Session.js';
import { User } from '../models/User.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization || '';

    if (!authHeader.startsWith('Bearer ')) {
      throw createError(401, 'Access token missing');
    }

    const token = authHeader.split(' ')[1];

    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      if (err.name === 'TokenExpiredError') {
        throw createError(401, 'Access token expired');
      }
      throw createError(401, 'Invalid access token');
    }

    const session = await Session.findOne({ accessToken: token });
    if (!session) {
      throw createError(401, 'Session not found');
    }

    const user = await User.findById(payload.id);
    if (!user) {
      throw createError(401, 'User not found');
    }

    req.user = user; // 👈 сюда добавляем пользователя
    next();
  } catch (error) {
    next(error);
  }
};
