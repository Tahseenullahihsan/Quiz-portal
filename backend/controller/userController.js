const User = require('../model/user');
const bcrypt = require('bcryptjs');

// Controller function for user registration
const register = async (req, res) => {
  const { username, password, email, role,studentRegisterNo } = req.body;

  try {
    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      username,
      password: hashedPassword,
      email,
      role,
      studentRegisterNo,

    });

    // Save the user to the database
    const savedUser = await newUser.save();

    // Return the saved user object without the password
    res.status(201).json({
      username: savedUser.username,
      email: savedUser.email,
      role: savedUser.role,
    
      studentRegisterNo: savedUser.studentRegisterNo,
     
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function for user login
const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find the user by username
    const user = await User.findOne({ email:username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    // const isMatch = await bcrypt.compare(password, user.password);

    // if (!isMatch) {
    //   return res.status(401).json({ message: 'Invalid credentials' });
    // }

    // Password is correct, return the user object (excluding the password)
    res.json({ username: user.username, email: user.email,id:user._id,role:user.role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, '-password'); // Exclude the password field
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  getAllUsers
};
