import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';

const app = express();
app.use(cors());
app.use(express.json());

const mongoUri = process.env.MONGO_URI || 'mongodb://mongo:27017/mern_deploy_lab';

mongoose.connect(mongoUri)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err.message));

app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', stack: 'MERN', timestamp: new Date() });
});

app.get('/api/technologies', (req, res) => {
  res.json(['MongoDB', 'Express', 'React', 'Node.js', 'Docker', 'Jenkins']);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
