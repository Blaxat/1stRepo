const mongoose = require('mongoose');
const { getTimeInAMPMFormat } = require('../helper/helpers');

const checkInSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now,
  },
  time: {
    type: String,
  },
});

const userSchema = new mongoose.Schema({
  rfid: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  registrationDate: {
    date: {
      type: Date,
      default: Date.now,
    },
    time: {
      type: String,
    },
  },
  lastCheckin: {
    date: {
      type: Date,
      default: null,
    },
    time: {
      type: String,
    },
  },
  previousCheckins: [checkInSchema],
});

userSchema.pre('save', function (next) {
  if (this.isNew) {
    const now = new Date();
    this.registrationDate.date = now;
    this.registrationDate.time = getTimeInAMPMFormat(now);
  }

  const now = new Date();
  if (!isNaN(now)) {
    this.lastCheckin.date = now;
    this.lastCheckin.time = getTimeInAMPMFormat(now);
    this.previousCheckins.push({
      date: now,
      time: getTimeInAMPMFormat(now),
    });
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;

