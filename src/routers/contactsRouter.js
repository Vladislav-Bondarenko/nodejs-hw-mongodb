import express from 'express';
import { authenticate } from '../middlewares/authenticate.js';

import {
  getAllContactsController,
  getContactByIdController,
  createContactController,
  updateContactController,
  deleteContactController,
} from '../controllers/contacts.js';

import { validateBody } from '../middlewares/validateBody.js';
import { isValidId } from '../middlewares/isValidId.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contactsSchemas.js';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

router.use(authenticate);

router.get('/', getAllContactsController);

router.get('/:contactId', isValidId, getContactByIdController);

router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  createContactController,
);

router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  updateContactController,
);

router.delete('/:contactId', isValidId, deleteContactController);

export default router;
