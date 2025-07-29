import express from 'express';
import { registerUserController } from '../controllers/auth.js';
import { validateRegisterBody } from '../middlewares/validation.js';
import { loginUserController } from '../controllers/auth.js';
import { validateLoginBody } from '../middlewares/validation.js';
import { refreshSessionController } from '../controllers/auth.js';
import { logoutUserController } from '../controllers/auth.js';

import sendResetEmail from '../controllers/auth/sendResetEmail.js';
import { resetPassword } from '../controllers/auth/resetPassword.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import { sendResetEmailSchema } from '../validation/auth/sendResetEmailSchema.js';
import { resetPasswordSchema } from '../validation/auth/resetPasswordSchema.js';

const router = express.Router();

router.post('/register', validateRegisterBody, registerUserController);
router.post('/login', validateLoginBody, loginUserController);
router.post('/refresh', refreshSessionController);
router.post('/logout', logoutUserController);
router.post(
  '/send-reset-email',
  validateBody(sendResetEmailSchema),
  ctrlWrapper(sendResetEmail),
);
router.post(
  '/reset-pwd',
  validateBody(resetPasswordSchema),
  ctrlWrapper(resetPassword),
);

export default router;
