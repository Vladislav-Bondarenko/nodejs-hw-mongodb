import jwt from 'jsonwebtoken';
import { createHttpError } from '../../utils/createHttpError.js';
import { User } from '../../models/User.js';
import { Session } from '../../models/Session.js';

export const resetPassword = async (req, res) => {
  const { token, password } = req.body;

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw createHttpError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email: payload.email });

  if (!user) {
    throw createHttpError(404, 'User not found!');
  }

  user.password = password;
  await user.save();

  await Session.deleteMany({ owner: user._id });

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
};
