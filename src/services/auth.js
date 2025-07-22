import bcrypt from 'bcryptjs';
import createError from 'http-errors';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken';
import { Session } from '../models/Session.js';

export const registerUserService = async ({ name, email, password }) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw createError(409, 'Email in use');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  return newUser;
};

export const loginUserService = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createError(401, 'Invalid credentials');
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw createError(401, 'Invalid credentials');
  }

  // Удаляем старую сессию (если есть)
  await Session.findOneAndDelete({ userId: user._id });

  // Генерация токенов
  const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  // Даты истечения
  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  // Сохраняем новую сессию
  await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { user, accessToken, refreshToken };
};

export const refreshSessionService = async (oldRefreshToken) => {
  if (!oldRefreshToken) {
    throw createError(401, 'Refresh token missing');
  }

  let payload;

  try {
    payload = jwt.verify(oldRefreshToken, process.env.JWT_SECRET);
  } catch {
    throw createError(401, 'Invalid refresh token');
  }

  const session = await Session.findOne({ refreshToken: oldRefreshToken });

  if (!session) {
    throw createError(401, 'Session not found');
  }

  await Session.deleteOne({ _id: session._id });

  const accessToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, {
    expiresIn: '15m',
  });

  const refreshToken = jwt.sign({ id: payload.id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });

  const accessTokenValidUntil = new Date(Date.now() + 15 * 60 * 1000);
  const refreshTokenValidUntil = new Date(
    Date.now() + 30 * 24 * 60 * 60 * 1000,
  );

  await Session.create({
    userId: payload.id,
    accessToken,
    refreshToken,
    accessTokenValidUntil,
    refreshTokenValidUntil,
  });

  return { accessToken, refreshToken };
};

export const logoutUserService = async (refreshToken) => {
  if (!refreshToken) {
    throw createError(401, 'No refresh token provided');
  }

  const session = await Session.findOne({ refreshToken });

  if (!session) {
    throw createError(401, 'Session not found');
  }

  await Session.deleteOne({ _id: session._id });
};
