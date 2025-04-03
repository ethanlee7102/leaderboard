const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config()

const app = express();
const SECRET = 'supersecret';
app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }).then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

const UserSchema = new mongoose.Schema({
    username: { type: String, unique: true },
    passwordHash: String,
    pressCount: { type: Number, default: 0 }
});

const User = mongoose.model('User', UserSchema);

app.post('/register', async(req, res) => {
    try{
        const { username, password } = req.body;
        const existing = await User.findOne({ username });
        if (existing) return res.status(409).send({ error: 'Username already exists' });

        const passwordHash = await bcrypt.hash(password, 10);
        const user = new User({ username, passwordHash });
        await user.save();
        res.send({ success: true });
    }
    catch(e){
        res.status(500).send({ error: 'Server error' });
    }
    

    
});

app.post('/login',  async(req, res) => {
    const {username, password} = req.body;
    const user = await User.findOne({username});
    if (user && await bcrypt.compare(password, user.passwordHash)){
        const token = jwt.sign({ username }, SECRET);
        res.send({ token }); // places {token: ...} in res.data and sends it back to frontend
    } else{
        res.status(401).send({ error: 'Invalid credentials' });
    }
});

app.post('/increment',  async(req, res) => {
    const { token } = req.body;
    try{
        const {username} = jwt.verify(token, SECRET);
        const user = await User.findOne({ username });
        user.pressCount += 1;
        await user.save();
        res.send({ pressCount: user.pressCount });
    } catch{
        res.status(401).send({ error: 'Unauthorized' });
    }
});

app.get('/leaderboard', async(req, res) => {
    const users = await User.find().sort({ pressCount: -1 }).limit(10);
    res.send(users.map(u => ({ username: u.username, pressCount: u.pressCount })));
})

app.get('/me', async (req, res) => {
    console.log("GET /me hit");
    const token = req.headers.authorization?.split(' ')[1];
    console.log("Received token:", token);
    if (!token) return res.status(401).send({ error: 'Missing token' });
  
    try {
      const { username } = jwt.verify(token, SECRET);
      console.log("Verified username:", username);
      const user = await User.findOne({ username });
      if (!user) {
        console.log("User not found:", username);
        return res.status(404).send({ error: 'User not found' });
      }
      res.send({ pressCount: user.pressCount , username});
    } catch (err) {
      console.error("Error verifying token:", err);
      res.status(401).send({ error: 'Invalid token' });
    }
  });
  
  app.use((req, res) => {
    res.status(404).send({ error: 'Not found', path: req.originalUrl });
  });

app.listen(3000, () => console.log('Server running on port 3000'));