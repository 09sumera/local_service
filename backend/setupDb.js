require('dotenv').config({ path: __dirname + '/.env' });
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function setupDatabase() {
  try {
    // Connect without database first to create it
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
    });

    const dbName = process.env.DB_NAME || 'local_service_booking';

    console.log(`Creating database ${dbName} if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
    await connection.query(`USE \`${dbName}\`;`);

    console.log('Creating Users table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('customer', 'provider', 'admin') DEFAULT 'customer',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Creating Services table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Services (
        id INT AUTO_INCREMENT PRIMARY KEY,
        provider_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(100) NOT NULL,
        price DECIMAL(10,2) NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (provider_id) REFERENCES Users(id) ON DELETE CASCADE
      );
    `);

    console.log('Creating Bookings table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Bookings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        customer_id INT NOT NULL,
        service_id INT NOT NULL,
        status ENUM('pending', 'accepted', 'rejected', 'completed', 'paid') DEFAULT 'pending',
        date DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES Users(id) ON DELETE CASCADE,
        FOREIGN KEY (service_id) REFERENCES Services(id) ON DELETE CASCADE
      );
    `);

    console.log('Creating Payments table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Payments (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id INT NOT NULL,
        amount DECIMAL(10,2) NOT NULL,
        status ENUM('successful', 'failed') DEFAULT 'successful',
        method VARCHAR(50) DEFAULT 'demo_card',
        transaction_id VARCHAR(100),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (booking_id) REFERENCES Bookings(id) ON DELETE CASCADE
      );
    `);

    console.log('Creating Reviews table...');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS Reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        service_id INT NOT NULL,
        customer_id INT NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (service_id) REFERENCES Services(id) ON DELETE CASCADE,
        FOREIGN KEY (customer_id) REFERENCES Users(id) ON DELETE CASCADE
      );
    `);

    // Insert Admin User
    const [adminRows] = await connection.query('SELECT id FROM Users WHERE email = ?', ['admin@gmail.com']);
    if (adminRows.length === 0) {
      console.log('Creating default admin user...');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await connection.query(
        'INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
        ['Admin', 'admin@gmail.com', hashedPassword, 'admin']
      );
      console.log('Admin user created: admin@gmail.com / admin123');
    } else {
      console.log('Admin user already exists.');
    }

    console.log('Database setup complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
