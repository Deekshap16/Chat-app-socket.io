import User from '../models/User.js';

// @desc    Get all users
// @route   GET /api/users
// @access  Private
export const getUsers = async (req, res) => {
  try {
    const currentUserId = req.user._id;
    const search = req.query.search || '';

    const query = {
      _id: { $ne: currentUserId },
    };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const users = await User.find(query)
      .select('name email avatar isOnline lastSeen')
      .sort({ name: 1 })
      .limit(50);

    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Server error fetching users' });
  }
};

// @desc    Get specific user
// @route   GET /api/users/:userId
// @access  Private
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select(
      'name email avatar isOnline lastSeen createdAt'
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error fetching user' });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const { name, avatar } = req.body;
    const userId = req.user._id;

    const updateData = {};
    if (name) updateData.name = name;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password');

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      isOnline: user.isOnline,
      lastSeen: user.lastSeen,
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};




