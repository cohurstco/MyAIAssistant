import express, { Router, Request, Response } from 'express';
import Note, { INote } from '../models/note.model';

const router: Router = express.Router();

router.route('/').get((req: Request, res: Response) => {
  Note.find()
    .then((notes: INote[]) => res.json(notes))
    .catch((err: Error) => res.status(400).json('Error: ' + err));
});

router.route('/').post((req: Request, res: Response) => {
  const { title, content, author } = req.body;

  const newNote: INote = new Note({
    title,
    content,
    author
  });

  newNote.save()
    .then((note: INote) => res.status(201).json(note))
    .catch((err: Error) => res.status(400).json('Error: ' + err));
});

router.route('/:id').get((req: Request, res: Response) => {
  Note.findById(req.params.id)
    .then((note: INote | null) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).json('Note not found');
      }
    })
    .catch((err: Error) => res.status(400).json('Error: ' + err));
});

router.route('/:id').put((req: Request, res: Response) => {
  Note.findByIdAndUpdate(req.params.id, req.body, { new: true })
    .then((note: INote | null) => {
      if (note) {
        res.json(note);
      } else {
        res.status(404).json('Note not found');
      }
    })
    .catch((err: Error) => res.status(400).json('Error: ' + err));
});

router.route('/:id').delete((req: Request, res: Response) => {
  Note.findByIdAndDelete(req.params.id)
    .then((note: INote | null) => {
      if (note) {
        res.json('Note deleted.');
      } else {
        res.status(404).json('Note not found');
      }
    })
    .catch((err: Error) => res.status(400).json('Error: ' + err));
});

export default router;