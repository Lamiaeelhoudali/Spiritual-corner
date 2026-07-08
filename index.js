require('dotenv').config();
const express= require('express');
const mongoose= require ('mongoose');
const User = require('./models/User');
const bcrypt = require('bcrypt');
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
    
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(`Connected to MongoDB`))
.catch((err) => console.log('MongoDB connection error:', err));
app.listen(Port,() => {
    console.log(`server running on http://localhost:${Port}`)
});