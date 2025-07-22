import Joi from 'joi';
import createError from 'http-errors';

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const validateRegisterBody = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return next(createError(400, error.message));
  }
  next();
};

export const validateLoginBody = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return next(createError(400, error.message));
  }
  next();
};
