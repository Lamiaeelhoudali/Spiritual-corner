const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const GoodDeed = require('../models/GoodDeed');

function todayString() {
  return new Date().toISOString().split('T')[0];
}

router.get('/gooddeeds/today', auth, async (req, res) => {
  try {
    const date = todayString();
    let entry = await GoodDeed.findOne({ user: req.userId, date });
    if (!entry) {
      entry = await GoodDeed.create({ user: req.userId, date });
    }
    res.json({ deeds: entry.deeds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/gooddeeds/today', auth, async (req, res) => {
  try {
    const { deed, completed } = req.body;
    const date = todayString();
    let entry = await GoodDeed.findOne({ user: req.userId, date });
    if (!entry) {
      entry = await GoodDeed.create({ user: req.userId, date });
    }
    entry.deeds[deed] = completed;
    await entry.save();
    res.json({ deeds: entry.deeds });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/gooddeeds/week', auth, async (req, res) => {
  try {
    const entries = await GoodDeed.find({ user: req.userId })
      .sort({ date: -1 })
      .limit(7);
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;