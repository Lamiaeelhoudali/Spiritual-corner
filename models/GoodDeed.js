const mongoose = require('mongoose');

const goodDeedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  deeds: [
    {
      text: { type: String, required: true },
      completed: { type: Boolean, default: false },
    },
  ],
});

goodDeedSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('GoodDeed', goodDeedSchema);