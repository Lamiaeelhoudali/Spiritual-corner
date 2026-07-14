const express = require('express');
const router = express.Router();
const JournalEntry = require('../models/JournalEntry');
const { encrypt, decrypt } = require('../utils/encryption');

router.post('/journal', async (req, res) => {
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

router.get('/journal/:userId', async (req, res) => {
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

module.exports = router;