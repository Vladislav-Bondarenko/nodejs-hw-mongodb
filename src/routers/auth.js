import express from 'express';
import { registerUserController } from '../controllers/auth.js';
import { validateRegisterBody } from '../middlewares/validation.js';
import { loginUserController } from '../controllers/auth.js';
import { validateLoginBody } from '../middlewares/validation.js';
import { refreshSessionController } from '../controllers/auth.js';
import { logoutUserController } from '../controllers/auth.js';

const router = express.Router();

router.post('/register', validateRegisterBody, registerUserController);
router.post('/login', validateLoginBody, loginUserController);
router.post('/refresh', refreshSessionController);
router.post('/logout', logoutUserController);

export default router;
