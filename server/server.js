import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI;

if (!mongoUri) {
  console.error('MONGO_URI is not configured. Add your MongoDB Atlas connection string.');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB Atlas connected successfully'))
  .catch(err => {
    console.error('MongoDB Atlas connection error:', err.message);
    process.exit(1);
  });

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', database: 'MongoDB Atlas', stack: 'MERN', timestamp: new Date() });
});

app.get('/api/technologies', (req, res) => {
  res.json(['MongoDB Atlas', 'Express', 'React', 'Node.js', 'Docker', 'Jenkins']);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
