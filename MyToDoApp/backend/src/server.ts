import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import notesRouter from './routes/notes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
if (uri) {
  mongoose.connect(uri)
    .then(() => console.log("MongoDB database connection established successfully"))
    .catch(err => console.log("MongoDB connection error: ", err));
} else {
  console.error("ATLAS_URI is not defined in the environment variables");
}

app.use('/api/notes', notesRouter);

app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});