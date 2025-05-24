const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../lib/prisma');

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET must be defined in your environment variables');
}

// Create new user
exports.signupUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('❌ Signup error:', err);
    res.status(500).json({ error: 'Failed to create user' });
  }
};

// Authenticate user and return token
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });

    const { password: _, ...safeUser } = user;

    res.json({ message: 'Login successful', token, user: safeUser });
  } catch (err) {
    console.error('❌ Login error:', err);
    res.status(500).json({ error: 'Failed to login' });
  }
};

// Return profile of logged-in user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const totalFavorites = await prisma.favorite.count({
      where: { userId: user.id }
    });

    res.json({ ...user, totalFavorites });
  } catch (err) {
    console.error('❌ Get user profile error:', err);
    res.status(500).json({ error: 'Failed to fetch user profile' });
  }
};

// Update logged-in user's name/email
exports.updateUserProfile = async (req, res) => {
  const { name, email } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const updated = await prisma.user.update({
      where: { id: req.user.userId },
      data: {
        name: name || user.name,
        email: email || user.email
      }
    });

    const { password: _, ...safeUser } = updated;
    res.json(safeUser);
  } catch (err) {
    console.error('❌ Update profile error:', err);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

// Update password for logged-in user
exports.changeUserPassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashed }
    });

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error('❌ Password change error:', err);
    res.status(500).json({ error: 'Failed to update password.' });
  }
};

// Delete the logged-in user
exports.deleteUserAccount = async (req, res) => {
  try {
    const userId = req.user.userId;

    // Remove associated favorites
    await prisma.favorite.deleteMany({ where: { userId } });

    // Delete user account
    await prisma.user.delete({ where: { id: userId } });

    res.json({ message: 'Account deleted successfully.' });
  } catch (err) {
    console.error('❌ Delete user error:', err);
    res.status(500).json({ error: 'Failed to delete account.' });
  }
};
