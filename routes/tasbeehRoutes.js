const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const TasbeehLog = require('../models/TasbeehLog');

function todayString() {
  return new Date().toISOString().split('T')[0];
}

router.get('/tasbeeh/today', auth, async (req, res) => {
  try {
    const date = todayString();
    let entry = await TasbeehLog.findOne({ user: req.userId, date });
    if (!entry) {
      entry = await TasbeehLog.create({ user: req.userId, date, count: 0 });
    }
    res.json({ count: entry.count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tasbeeh/today', auth, async (req, res) => {
  try {
    const { count } = req.body;
    const date = todayString();
    const entry = await TasbeehLog.findOneAndUpdate(
      { user: req.userId, date },
      { count },
      { upsert: true, new: true }
    );
    res.json({ count: entry.count });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;