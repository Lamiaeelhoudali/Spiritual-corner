const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const PrayerLog = require('../models/PrayerLog');

function todayString() {
  return new Date().toISOString().split('T')[0];
}

router.get('/tracker/today', auth, async (req, res) => {
  try {
    const date = todayString();
    let log = await PrayerLog.findOne({ user: req.userId, date });
    if (!log) {
      log = new PrayerLog({ user: req.userId, date });
      await log.save();
    }
    res.status(200).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/tracker/today', auth, async (req, res) => {
  try {
    const date = todayString();
    const { prayer, completed } = req.body;
    let log = await PrayerLog.findOne({ user: req.userId, date });
    if (!log) {
      log = new PrayerLog({ user: req.userId, date });
    }
    log.prayers[prayer] = completed;
    await log.save();
    res.status(200).json(log);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;