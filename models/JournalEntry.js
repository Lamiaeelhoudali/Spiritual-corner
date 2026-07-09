const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const journalEntrySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  isLocked: { type: Boolean, default: false },
  pin: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

journalEntrySchema.pre('save', async function () {
  if (this.pin && this.isModified('pin')) {
    this.pin = await bcrypt.hash(this.pin, 10);
  }
});

module.exports = mongoose.model('JournalEntry', journalEntrySchema);