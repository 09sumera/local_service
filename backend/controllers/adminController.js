const db = require('../config/db');

const getStats = async (req, res) => {
  try {
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) as totalUsers FROM Users');
    const [[{ totalProviders }]] = await db.query('SELECT COUNT(*) as totalProviders FROM Users WHERE role = "provider"');
    const [[{ totalServices }]] = await db.query('SELECT COUNT(*) as totalServices FROM Services');
    const [[{ totalBookings }]] = await db.query('SELECT COUNT(*) as totalBookings FROM Bookings');
    const [[{ totalRevenue }]] = await db.query('SELECT SUM(amount) as totalRevenue FROM Payments WHERE status = "successful"');

    res.json({
      totalUsers,
      totalProviders,
      totalServices,
      totalBookings,
      totalRevenue: totalRevenue || 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const [users] = await db.query('SELECT id, name, email, role, created_at FROM Users ORDER BY created_at DESC');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    await db.query('DELETE FROM Users WHERE id = ?', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, s.title as service_title, u.name as customer_name 
      FROM Bookings b 
      JOIN Services s ON b.service_id = s.id 
      JOIN Users u ON b.customer_id = u.id 
      ORDER BY b.date DESC
    `);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllPayments = async (req, res) => {
  try {
    const [payments] = await db.query('SELECT * FROM Payments ORDER BY created_at DESC');
    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllReviews = async (req, res) => {
  try {
    const [reviews] = await db.query(`
      SELECT r.*, s.title as service_title, u.name as customer_name 
      FROM Reviews r 
      JOIN Services s ON r.service_id = s.id 
      JOIN Users u ON r.customer_id = u.id 
      ORDER BY r.created_at DESC
    `);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    await db.query('DELETE FROM Reviews WHERE id = ?', [req.params.id]);
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStats, getAllUsers, deleteUser, getAllBookings, getAllPayments, getAllReviews, deleteReview };
