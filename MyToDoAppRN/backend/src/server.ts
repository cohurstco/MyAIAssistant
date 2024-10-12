import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import notesRouter from './routes/notes';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  const uri = process.env.ATLAS_URI;
  if (!uri) {
    console.error("ATLAS_URI is not defined in the environment variables");
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log("MongoDB database connection established successfully");
  } catch (error) {
    console.error("MongoDB connection error: ", error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/notes', notesRouter);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ error: 'Not Found' });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});

export default app;
