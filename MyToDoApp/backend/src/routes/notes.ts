import express, { Router, Request, Response, NextFunction } from 'express';
import { body, param, validationResult } from 'express-validator';
import * as noteController from '../controllers/noteController';

const router: Router = express.Router();

// Validation middleware
const validateNoteInput = [
  body('title').notEmpty().withMessage('Title is required'),
  body('content').notEmpty().withMessage('Content is required'),
  body('author').notEmpty().withMessage('Author is required'),
];

const validateObjectId = [
  param('id').isMongoId().withMessage('Invalid note ID'),
];

// Validation error handler
const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// Apply validation and call controller methods
router.get('/', noteController.getAllNotes);

router.post('/', validateNoteInput, handleValidationErrors, noteController.createNote);

router.get('/:id', validateObjectId, handleValidationErrors, noteController.getNoteById);

router.put('/:id', validateObjectId, validateNoteInput, handleValidationErrors, noteController.updateNote);

router.delete('/:id', validateObjectId, handleValidationErrors, noteController.deleteNote);

export default router;
