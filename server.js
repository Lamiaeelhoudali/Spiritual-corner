require('dotenv').config();
const express= require('express');
const mongoose= require ('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
const JournalEntry = require('./models/JournalEntry');
const { encrypt, decrypt } = require('./utils/encryption');
const app= express();
app.use(express.json());
const Port = 3000;

app.get('/',(req,res) =>{
    res.send('Hello from Spiritual Corner!');
});

app.post('/users', async (req,res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
        } catch (err) {
            res.status(400).json({ error: err.message });
        }
});
         app.post('/login', async (req, res) => {
        try { 
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }
        res.status(200).json({ message: 'Login successful', name: user.name });
            } catch (err) {
                res.status(500).json({ erroe: err.message });

            }
        }); 
        app.post('/journal', async (req, res) => {
  try {
    const entry = new JournalEntry({
      user: req.body.user,
      title: req.body.title,
      content: encrypt(req.body.content),
      isLocked: req.body.isLocked,
      pin: req.body.pin,
    });
    await entry.save();
    res.status(201).json({ message: 'Journal entry created', id: entry._id });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
app.get('/journal/:userId', async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.params.userId });
    const decrypted = entries.map((entry) => ({
      id: entry._id,
      title: entry.title,
      content: entry.isLocked ? '[locked]' : decrypt(entry.content),
      isLocked: entry.isLocked,
      createdAt: entry.createdAt,
    }));
    res.status(200).json(decrypted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
    
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(`Connected to MongoDB`))
.catch((err) => console.log('MongoDB connection error:', err));
app.listen(Port,() => {
    console.log(`server running on http://localhost:${Port}`)
});