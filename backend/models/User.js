const mongoose = require('mongoose');
const {getTimeInAMPMFormat} = require('../helper/helpers');
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
  email: {
    type: String,
    required: true,
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
});


userSchema.pre('save', function (next) {
  if (this.isNew) {
    const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
    this.registrationDate.date = now;
    this.registrationDate.time = getTimeInAMPMFormat(now);
  }
  
  const now = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
  this.lastCheckin.date = now;
  this.lastCheckin.time = getTimeInAMPMFormat(now);

  next();
});


const User = mongoose.model('User', userSchema);

module.exports = User;
