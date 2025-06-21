const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  role: { type: String, enum: ['Teacher', 'Student', 'Admin',], required: true },

  studentRegisterNo: { type: String },

});

const User = mongoose.model('User', userSchema);

module.exports = User;
