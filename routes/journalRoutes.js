const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');
const { encrypt, decrypt } = require('../utils/encryption');
const bcrypt = require('bcrypt');

router.post('/journal', auth, async (req, res) => {
  try {
    const entry = new JournalEntry({
      user: req.userId,
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

router.get('/journal', auth, async (req, res) => {
  try {
    const entries = await JournalEntry.find({ user: req.userId });
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

router.post('/journal/:id/unlock', auth, async (req, res) => {
  try {
    const entry = await JournalEntry.findOne({ _id: req.params.id, user: req.userId });
    if (!entry) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    if (!entry.isLocked) {
      return res.status(200).json({ content: decrypt(entry.content) });
    }
    const isMatch = await bcrypt.compare(req.body.pin, entry.pin);
    if (!isMatch) {
      return res.status(400).json({ error: 'Incorrect PIN' });
    }
    res.status(200).json({ content: decrypt(entry.content) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;