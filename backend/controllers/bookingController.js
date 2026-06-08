const db = require('../config/db');

const createBooking = async (req, res) => {
  const { service_id, date } = req.body;
  if (!service_id || !date) {
    return res.status(400).json({ message: 'Please provide service_id and date' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO Bookings (customer_id, service_id, date, status) VALUES (?, ?, ?, "pending")',
      [req.user.id, service_id, date]
    );
    res.status(201).json({ id: result.insertId, message: 'Booking created successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getCustomerBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
      SELECT b.*, s.title as service_title, s.price, u.name as provider_name 
      FROM Bookings b 
      JOIN Services s ON b.service_id = s.id 
      JOIN Users u ON s.provider_id = u.id 
      WHERE b.customer_id = ?
      ORDER BY b.date DESC
    `, [req.user.id]);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProviderBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(`
SELECT
b.*,
s.title AS service_title,
s.price AS price,
u.name AS customer_name,
u.email AS customer_email
FROM Bookings b
JOIN Services s ON b.service_id = s.id
JOIN Users u ON b.customer_id = u.id
WHERE s.provider_id = ?
ORDER BY b.date DESC
    `, [req.user.id]);
    
    console.log("Provider bookings from DB:", bookings);
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const [booking] = await db.query(`
      SELECT b.*, s.provider_id 
      FROM Bookings b 
      JOIN Services s ON b.service_id = s.id 
      WHERE b.id = ?
    `, [req.params.id]);

    if (booking.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking[0].provider_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    await db.query('UPDATE Bookings SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: `Booking status updated to ${status}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const makePayment = async (req, res) => {
  const { amount, method } = req.body;
  try {
    const [booking] = await db.query('SELECT * FROM Bookings WHERE id = ?', [req.params.id]);
    if (booking.length === 0) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking[0].customer_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Mock payment successful
    const transactionId = 'txn_' + Math.random().toString(36).substr(2, 9);
    await db.query(
      'INSERT INTO Payments (booking_id, amount, status, method, transaction_id) VALUES (?, ?, "successful", ?, ?)',
      [req.params.id, amount, method || 'demo_card', transactionId]
    );

    await db.query('UPDATE Bookings SET status = "paid" WHERE id = ?', [req.params.id]);

    res.json({ message: 'Payment successful', transactionId });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getCustomerBookings, getProviderBookings, updateBookingStatus, makePayment };
