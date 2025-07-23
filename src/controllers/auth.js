import { registerUserService } from '../services/auth.js';
import { loginUserService } from '../services/auth.js';
import { refreshSessionService } from '../services/auth.js';

export const registerUserController = async (req, res, next) => {
  try {
    const newUser = await registerUserService(req.body);

    res.status(201).json({
      status: '201',
      message: 'Successfully registered a user!',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const loginUserController = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await loginUserService(
      req.body,
    );

    // Установить refreshToken в куки
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 дней
    });

    // Ответ с accessToken
    res.status(200).json({
      status: '200',
      message: 'Successfully logged in an user!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshSessionController = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    const { accessToken, refreshToken } = await refreshSessionService(
      oldRefreshToken,
    );

    // Обновляем куку с новым refresh токеном
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      status: '200',
      message: 'Successfully refreshed a session!',
      data: {
        accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

import { logoutUserService } from '../services/auth.js';

export const logoutUserController = async (req, res, next) => {
  try {
    const oldRefreshToken = req.cookies.refreshToken;

    await logoutUserService(oldRefreshToken);

    // Очистка cookie
    res.clearCookie('refreshToken');

    res.status(204).send(); // No Content
  } catch (error) {
    next(error);
  }
};
