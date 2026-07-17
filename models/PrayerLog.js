const mongoose = require('mongoose');

const prayerLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true },
  prayers: {
    Fajr: { type: Boolean, default: false },
    Dhuhr: { type: Boolean, default: false },
    Asr: { type: Boolean, default: false },
    Maghrib: { type: Boolean, default: false },
    Isha: { type: Boolean, default: false },
  },
});

module.exports = mongoose.model('PrayerLog', prayerLogSchema);