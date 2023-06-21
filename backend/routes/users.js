const router = require('express').Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
const {getTimeInAMPMFormat, generateOTP, generatePASS, sendOTPByEmail} = require('../helper/helpers');

// Create a new user
router.route('/users/add').post((req, res) => {
  const { rfid, name, phone, email } = req.body;
  let pass = generatePASS(5);
  const newUser = new User({ rfid, name, phone, email, password: pass });

  newUser
    .save()
    .then(() => res.json('User added!'))
    .catch((err) => res.status(400).json('User already exists'));
});

// Read all users
router.route('/users').get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Read a specific user
router.route('/users/:id').get((req, res) => {
  User.findById(req.params.id)
    .then((user) => res.json(user))
    .catch((err) => res.status(400).json('Error: ' + err));
});


// Update a user
router.route('/users/rfid/:rfid').post((req, res) => {
  const { rfid } = req.params;
  User.findOne({ rfid: rfid })
    .then((user) => {
      if (!user) {
        return res.status(404).json('Access Denied');
      }
      user.lastCheckin.date = new Date();
      user.lastCheckin.time = getTimeInAMPMFormat(new Date());
      user.save()
        .then(() => res.json('Access Granted'))
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/users/phone/:phone').post((req, res) => {
  const { phone } = req.params;
  User.findOne({ phone: phone })
    .then((user) => {
      if (!user) {
        return res.status(404).json('No user found');
      }
      user.lastCheckin.date = new Date();
      user.lastCheckin.time = getTimeInAMPMFormat(new Date());
      let otp = generateOTP(6);
      user.save()
      sendOTPByEmail(user.email, otp)
        .then(() => res.json(otp))
        .catch((err) => res.status(400).json('Error: ' + err));
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

// Delete a user
router.route('/users/delete/:id').delete((req, res) => {
  User.findByIdAndDelete(req.params.id)
    .then(() => res.json('User deleted.'))
    .catch((err) => res.status(400).json('Error: ' + err));
});

module.exports = router;
