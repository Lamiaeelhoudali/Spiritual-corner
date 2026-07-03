require('dotenv').config();
const express= require('express');
const mongoose= require ('mongoose');
const app= express();
const Port = 3000;

app.get('/',(req,res) =>{
    res.send('Hello from Spiritual Corner!');
});
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log(`Connected to MongoDB`))
.catch((err) => console.log('MongoDB connection error:', err));
app.listen(Port,() => {
    console.log(`server running on http://localhost:${Port}`)
});