import { getContactById } from '../services/contacts.js';
import createError from 'http-errors';

export async function getContactByIdController(req, res, next) {
  try {
    const { contactId } = req.params;

    const contact = await getContactById(contactId);

    if (!contact) {
      throw createError(404, 'Contact not found');
    }

    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}
