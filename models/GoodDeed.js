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
      entry = await GoodDeed.create({ user: req.userId, date, deeds: [] });
    }
    res.json({ deeds: entry.deeds });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/gooddeeds/add', auth, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: 'Deed text is required' });
    }
    const date = todayString();
    let entry = await GoodDeed.findOne({ user: req.userId, date });
    if (!entry) {
      entry = await GoodDeed.create({ user: req.userId, date, deeds: [] });
    }
    entry.deeds.push({ text: text.trim(), completed: false });
    await entry.save();
    res.json({ deeds: entry.deeds });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/gooddeeds/toggle', auth, async (req, res) => {
  try {
    const { deedId } = req.body;
    const date = todayString();
    const entry = await GoodDeed.findOne({ user: req.userId, date });
    if (!entry) {
      return res.status(404).json({ error: 'No entry found for today' });
    }
    const deed = entry.deeds.id(deedId);
    if (!deed) {
      return res.status(404).json({ error: 'Deed not found' });
    }
    deed.completed = !deed.completed;
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