const mongoose = require('mongoose');

const goodDeedSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  deeds: {
    helpedSomeone: { type: Boolean, default: false },
    gaveCharity: { type: Boolean, default: false },
    kindWord: { type: Boolean, default: false },
    helpedFamily: { type: Boolean, default: false },
    smiled: { type: Boolean, default: false },
  },
});

goodDeedSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('GoodDeed', goodDeedSchema);