require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const journalRoutes = require('./routes/journalRoutes');
const trackerRoutes = require('./routes/trackerRoutes');
const app = express();
app.use(cors());
app.use(express.json());
const Port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Hello from Spiritual Corner!');
});

app.use(authRoutes);
app.use(journalRoutes);
app.use(trackerRoutes);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.listen(Port, () => {
  console.log(`server running on http://localhost:${Port}`);
});