const pool = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Store OTP temporarily
const otpStore = {};

exports.signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000);
    otpStore[email] = { password: hashedPassword, otp };

    await transporter.sendMail({
      from: process.env.EMAIL,
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP is ${otp}`,
    });

    res.json({ message: 'OTP sent to your email', email });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!otpStore[email]) return res.status(400).json({ error: 'No signup request found' });

  if (otpStore[email].otp != otp) return res.status(400).json({ error: 'Invalid OTP' });

  try {
    const hashedPassword = otpStore[email].password;
    await pool.query('INSERT INTO users(email, password) VALUES($1, $2)', [email, hashedPassword]);
    delete otpStore[email];
    res.json({ message: 'Signup successful' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Database error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await pool.query('SELECT * FROM users WHERE email=$1', [email]);
    if (user.rows.length === 0) return res.status(400).json({ error: 'User not found' });

    const validPass = await bcrypt.compare(password, user.rows[0].password);
    if (!validPass) return res.status(400).json({ error: 'Invalid password' });

    const token = jwt.sign({ id: user.rows[0].id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Login successful', token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Server error' });
  }
};
