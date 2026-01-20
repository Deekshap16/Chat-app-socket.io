import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log('📝 Registration attempt:', { name, email });

    // Validation
    if (!name || !email || !password) {
      console.warn('❌ Missing fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Please provide all fields (name, email, password)' });
    }

    // Email format validation
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      console.warn('❌ Invalid email format:', email);
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Password length validation
    if (password.length < 6) {
      console.warn('❌ Password too short:', password.length);
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      console.warn('❌ User already exists:', email);
      return res.status(409).json({ message: 'Email is already registered. Please login or use a different email.' });
    }

    // Create user
    console.log('🔄 Creating new user...');
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
    });

    if (user) {
      console.log('✅ User created successfully:', user._id);
      const token = generateToken(user._id);
      
      res.status(201).json({
        success: true,
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        token: token,
      });
    } else {
      console.error('❌ User creation failed - invalid data');
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.log(error)
    console.error('❌ Registration error:', {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });

    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({ 
        message: `This ${field} is already registered. Please login or use a different ${field}.` 
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }

    // Generic server error
    res.status(500).json({ 
      message: 'Server error during registration. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('🔐 Login attempt:', email);

    // Validation
    if (!email || !password) {
      console.warn('❌ Missing email or password');
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // Check for user and include password for comparison
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      console.warn('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      console.warn('❌ Invalid password for user:', email);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update online status
    user.isOnline = true;
    user.lastSeen = new Date();
    await user.save();

    console.log('✅ Login successful:', user._id);

    const token = generateToken(user._id);
    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token: token,
    });
  } catch (error) {
    console.error('❌ Login error:', {
      message: error.message,
      name: error.name,
      stack: error.stack,
    });
    res.status(500).json({ 
      message: 'Server error during login. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
    });
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




