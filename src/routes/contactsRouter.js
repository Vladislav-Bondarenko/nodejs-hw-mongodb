import express from 'express';
import { getAllContactsController } from '../controllers/getAllContacts.js';
import { getContactByIdController } from '../controllers/getContactById.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { createContactController } from '../controllers/contacts.js';
import { updateContactController } from '../controllers/contacts.js';
import { deleteContactController } from '../controllers/contacts.js';

const router = express.Router();

router.get('/', ctrlWrapper(getAllContactsController));

router.get('/:contactId', ctrlWrapper(getContactByIdController));

router.post('/', ctrlWrapper(createContactController));

router.patch('/:contactId', ctrlWrapper(updateContactController));
router.delete('/:contactId', ctrlWrapper(deleteContactController));

export default router;
