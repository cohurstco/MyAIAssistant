import { Request, Response, NextFunction } from 'express';
import Note, { INote } from '../models/note.model';

export const getAllNotes = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes: INote[] = await Note.find();
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

export const createNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, content, author } = req.body;
    const newNote: INote = new Note({ title, content, author });
    const savedNote: INote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
};

export const getNoteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const note: INote | null = await Note.findById(req.params.id);
    if (note) {
      res.json(note);
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const updateNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedNote: INote | null = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (updatedNote) {
      res.json(updatedNote);
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteNote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedNote: INote | null = await Note.findByIdAndDelete(req.params.id);
    if (deletedNote) {
      res.json({ message: 'Note deleted successfully' });
    } else {
      res.status(404).json({ error: 'Note not found' });
    }
  } catch (error) {
    next(error);
  }
};
