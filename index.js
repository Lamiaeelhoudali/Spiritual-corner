require('dotenv').config();
const express= require('express');
const mongoose= require ('mongoose');
const User = require('./models/User');
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

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(`Connected to MongoDB`))
.catch((err) => console.log('MongoDB connection error:', err));
app.listen(Port,() => {
    console.log(`server running on http://localhost:${Port}`)
});