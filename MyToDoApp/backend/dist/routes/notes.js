"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const note_model_1 = __importDefault(require("../models/note.model"));
const router = express_1.default.Router();
router.route('/').get((req, res) => {
    note_model_1.default.find()
        .then((notes) => res.json(notes))
        .catch((err) => res.status(400).json({ error: err.message }));
});
router.route('/').post((req, res) => {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
        return res.status(400).json({ error: 'Missing required fields' });
    }
    const newNote = new note_model_1.default({
        title,
        content,
        author
    });
    newNote.save()
        .then((note) => res.status(201).json(note))
        .catch((err) => res.status(400).json({ error: err.message }));
});
router.route('/:id').get((req, res) => {
    note_model_1.default.findById(req.params.id)
        .then((note) => {
        if (note) {
            res.json(note);
        }
        else {
            res.status(404).json({ error: 'Note not found' });
        }
    })
        .catch((err) => res.status(400).json({ error: err.message }));
});
router.route('/:id').put((req, res) => {
    note_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true })
        .then((note) => {
        if (note) {
            res.json(note);
        }
        else {
            res.status(404).json({ error: 'Note not found' });
        }
    })
        .catch((err) => res.status(400).json({ error: err.message }));
});
router.route('/:id').delete((req, res) => {
    note_model_1.default.findByIdAndDelete(req.params.id)
        .then((note) => {
        if (note) {
            res.json({ message: 'Note deleted successfully' });
        }
        else {
            res.status(404).json({ error: 'Note not found' });
        }
    })
        .catch((err) => res.status(400).json({ error: err.message }));
});
exports.default = router;
