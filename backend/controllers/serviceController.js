const db = require('../config/db');

const getAllServices = async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = `
      SELECT s.*, u.name as provider_name 
      FROM Services s 
      JOIN Users u ON s.provider_id = u.id
    `;
    const queryParams = [];

    if (category || search) {
      query += ' WHERE';
      const conditions = [];
      if (category) {
        conditions.push(' s.category = ?');
        queryParams.push(category);
      }
      if (search) {
        conditions.push(' (s.title LIKE ? OR s.description LIKE ?)');
        queryParams.push(`%${search}%`, `%${search}%`);
      }
      query += conditions.join(' AND');
    }

    const [services] = await db.query(query, queryParams);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getServiceById = async (req, res) => {
  try {
    const [services] = await db.query(`
      SELECT s.*, u.name as provider_name 
      FROM Services s 
      JOIN Users u ON s.provider_id = u.id 
      WHERE s.id = ?
    `, [req.params.id]);

    if (services.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    // Get reviews
    const [reviews] = await db.query(`
      SELECT r.*, u.name as customer_name 
      FROM Reviews r 
      JOIN Users u ON r.customer_id = u.id 
      WHERE r.service_id = ?
    `, [req.params.id]);

    res.json({ ...services[0], reviews });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createService = async (req, res) => {
  const { title, description, category, price, image_url } = req.body;
  if (!title || !description || !category || !price) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO Services (provider_id, title, description, category, price, image_url) VALUES (?, ?, ?, ?, ?, ?)',
      [req.user.id, title, description, category, price, image_url || null]
    );
    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateService = async (req, res) => {
  const { title, description, category, price, image_url } = req.body;
  
  try {
    const [service] = await db.query('SELECT * FROM Services WHERE id = ?', [req.params.id]);
    if (service.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service[0].provider_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this service' });
    }

    await db.query(
      'UPDATE Services SET title = ?, description = ?, category = ?, price = ?, image_url = ? WHERE id = ?',
      [title, description, category, price, image_url || null, req.params.id]
    );
    res.json({ message: 'Service updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteService = async (req, res) => {
  try {
    const [service] = await db.query('SELECT * FROM Services WHERE id = ?', [req.params.id]);
    if (service.length === 0) {
      return res.status(404).json({ message: 'Service not found' });
    }

    if (service[0].provider_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this service' });
    }

    await db.query('DELETE FROM Services WHERE id = ?', [req.params.id]);
    res.json({ message: 'Service removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProviderServices = async (req, res) => {
  try {
    const [services] = await db.query('SELECT * FROM Services WHERE provider_id = ?', [req.user.id]);
    res.json(services);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addReview = async (req, res) => {
  const { rating, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Valid rating between 1 and 5 is required' });
  }

  try {
    // Check if user has booked this service and it's completed or paid
    const [bookings] = await db.query(
      'SELECT * FROM Bookings WHERE customer_id = ? AND service_id = ? AND status IN ("completed", "paid")',
      [req.user.id, req.params.id]
    );

    if (bookings.length === 0 && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'You can only review services you have completed' });
    }

    await db.query(
      'INSERT INTO Reviews (service_id, customer_id, rating, comment) VALUES (?, ?, ?, ?)',
      [req.params.id, req.user.id, rating, comment]
    );
    res.status(201).json({ message: 'Review added successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAllServices, getServiceById, createService, updateService, deleteService, getProviderServices, addReview };
