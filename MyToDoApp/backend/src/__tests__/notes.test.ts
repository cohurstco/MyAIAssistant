import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import notesRouter from '../routes/notes';
import Note from '../models/note.model';

const app = express();
app.use(express.json());
app.use('/api/notes', notesRouter);

describe('Notes API', () => {
  beforeEach(async () => {
    await Note.deleteMany({});
  });

  it('GET /api/notes --> array of notes', async () => {
    const response = await request(app).get('/api/notes');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBeTruthy();
  });

  it('POST /api/notes --> create note', async () => {
    const response = await request(app)
      .post('/api/notes')
      .send({
        title: 'Test Note',
        content: 'This is a test note',
        author: 'Tester'
      });
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('_id');
    expect(response.body.title).toBe('Test Note');
  });

  it('GET /api/notes/:id --> specific note by ID', async () => {
    const note = new Note({ title: 'Test Note', content: 'This is a test note', author: 'Tester' });
    await note.save();

    const response = await request(app).get(`/api/notes/${note._id}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Test Note');
  });

  it('PUT /api/notes/:id --> update note', async () => {
    const note = new Note({ title: 'Test Note', content: 'This is a test note', author: 'Tester' });
    await note.save();

    const response = await request(app)
      .put(`/api/notes/${note._id}`)
      .send({
        title: 'Updated Test Note',
        content: 'This is an updated test note',
        author: 'Updater'
      });
    expect(response.status).toBe(200);
    expect(response.body.title).toBe('Updated Test Note');
  });

  it('DELETE /api/notes/:id --> delete note', async () => {
    const note = new Note({ title: 'Test Note', content: 'This is a test note', author: 'Tester' });
    await note.save();

    const response = await request(app).delete(`/api/notes/${note._id}`);
    expect(response.status).toBe(200);

    const deletedNote = await Note.findById(note._id);
    expect(deletedNote).toBeNull();
  });
});