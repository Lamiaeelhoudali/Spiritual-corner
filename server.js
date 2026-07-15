require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');

const app = express();
app.use(express.json());
const Port = process.env.Port || 3000;

app.get('/', (req, res) => {
  res.send('Hello from Spiritual Corner!');
});

app.use(authRoutes);
app.use(journalRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.listen(Port, () => {
  console.log(`server running on http://localhost:${Port}`);
});