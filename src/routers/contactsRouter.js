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

const router = express.Router();

router.use(authenticate);

router.get('/', getAllContactsController);

router.get('/:contactId', isValidId, getContactByIdController);

router.post('/', validateBody(createContactSchema), createContactController);

router.patch(
  '/:contactId',
  isValidId,
  validateBody(updateContactSchema),
  updateContactController,
);

router.delete('/:contactId', isValidId, deleteContactController);

export default router;
