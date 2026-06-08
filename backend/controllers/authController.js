const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET || 'super_secret_key_change_in_production',
    { expiresIn: '30d' }
  );
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Please provide all required fields'
    });
  }

  try {
    const [existingUsers] = await db.query(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({
        message: 'User already exists'
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userRole =
      role === 'provider' ? 'provider' : 'customer';

    const [result] = await db.query(
      'INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, userRole]
    );

    res.status(201).json({
      id: result.insertId,
      name,
      email,
      role: userRole,
      token: generateToken(result.insertId, userRole)
    });
  } catch (error) {
    console.error('Register Error:', error);
    res.status(500).json({
      message: error.message
    });
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [users] = await db.query(
      'SELECT * FROM Users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    const user = users[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(401).json({
        message: 'Invalid credentials'
      });
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user.id, user.role)
    });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({
      message: error.message
    });
  }
};

const getMe = async (req, res) => {
  try {
    const [users] = await db.query(
      'SELECT id, name, email, role, created_at FROM Users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        message: 'User not found'
      });
    }

    res.json(users[0]);
  } catch (error) {
    console.error('GetMe Error:', error);
    res.status(500).json({
      message: error.message
    });
  }
};

const updateProfile = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    let query =
      'UPDATE Users SET name = ?, email = ?';
    const params = [name, email];

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);

      query += ', password_hash = ?';
      params.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    params.push(req.user.id);

    await db.query(query, params);

    const [users] = await db.query(
      'SELECT id, name, email, role FROM Users WHERE id = ?',
      [req.user.id]
    );

    res.json(users[0]);
  } catch (error) {
    console.error('Update Profile Error:', error);
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getMe,
  updateProfile
};