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
        .catch((err) => res.status(400).json('Error: ' + err));
});
router.route('/add').post((req, res) => {
    const title = req.body.title;
    const content = req.body.content;
    const newNote = new note_model_1.default({
        title,
        content,
    });
    newNote.save()
        .then(() => res.json('Note added!'))
        .catch((err) => res.status(400).json('Error: ' + err));
});
router.route('/:id').get((req, res) => {
    note_model_1.default.findById(req.params.id)
        .then((note) => res.json(note))
        .catch((err) => res.status(400).json('Error: ' + err));
});
router.route('/:id').delete((req, res) => {
    note_model_1.default.findByIdAndDelete(req.params.id)
        .then(() => res.json('Note deleted.'))
        .catch((err) => res.status(400).json('Error: ' + err));
});
router.route('/update/:id').post((req, res) => {
    note_model_1.default.findById(req.params.id)
        .then((note) => {
        if (note) {
            note.title = req.body.title;
            note.content = req.body.content;
            note.save()
                .then(() => res.json('Note updated!'))
                .catch((err) => res.status(400).json('Error: ' + err));
        }
        else {
            res.status(404).json('Note not found');
        }
    })
        .catch((err) => res.status(400).json('Error: ' + err));
});
exports.default = router;
