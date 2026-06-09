const db = require('../config/db');

const getStats = async (req, res) => {
  try {
    const query = `
      SELECT 
        (SELECT COUNT(*) FROM Users) as totalUsers,
        (SELECT COUNT(*) FROM Users WHERE role = 'provider') as totalProviders,
        (SELECT COUNT(*) FROM Bookings) as totalBookings,
        (SELECT COALESCE(SUM(amount), 0) FROM Payments WHERE status = 'successful') as totalRevenue
    `;
    const [[stats]] = await db.query(query);

    res.json({
      totalUsers: Number(stats.totalUsers) || 0,
      totalProviders: Number(stats.totalProviders) || 0,
      totalBookings: Number(stats.totalBookings) || 0,
      totalRevenue: Number(stats.totalRevenue) || 0
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
