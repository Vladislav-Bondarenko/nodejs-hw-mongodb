import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../services/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';

async function getAllContactsControllerInternal(req, res) {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 10;
  const sortBy = req.query.sortBy || 'name';
  const sortOrder = req.query.sortOrder || 'asc';
  const type = req.query.type;
  const isFavourite = req.query.isFavourite;
  const userId = req.user._id;

  const result = await getAllContacts({
    userId,
    page,
    perPage,
    sortBy,
    sortOrder,
    type,
    isFavourite,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
}

async function getContactByIdControllerInternal(req, res) {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await getContactById(contactId, userId);

  if (!contact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

async function createContactControllerInternal(req, res) {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  const userId = req.user._id;

  if (!name || !phoneNumber || !contactType) {
    return res.status(400).json({
      status: 400,
      message: 'Missing required fields: name, phoneNumber, contactType',
    });
  }

  const newContact = await createContact(
    {
      name,
      phoneNumber,
      email,
      isFavourite,
      contactType,
    },
    userId,
  );

  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: newContact,
  });
}

async function updateContactControllerInternal(req, res) {
  const { contactId } = req.params;
  const updateData = req.body;
  const userId = req.user._id;

  const updatedContact = await updateContact(contactId, updateData, userId);

  if (!updatedContact) {
    throw createError(404, 'Contact not found');
  }

  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updatedContact,
  });
}

async function deleteContactControllerInternal(req, res) {
  const { contactId } = req.params;
  const userId = req.user._id;

  const deleted = await deleteContact(contactId, userId);

  if (!deleted) {
    throw createError(404, 'Contact not found');
  }

  res.status(204).send();
}

export const getAllContactsController = ctrlWrapper(
  getAllContactsControllerInternal,
);
export const getContactByIdController = ctrlWrapper(
  getContactByIdControllerInternal,
);
export const createContactController = ctrlWrapper(
  createContactControllerInternal,
);
export const updateContactController = ctrlWrapper(
  updateContactControllerInternal,
);
export const deleteContactController = ctrlWrapper(
  deleteContactControllerInternal,
);
