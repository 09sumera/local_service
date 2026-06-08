const express = require('express');
const { createBooking, getCustomerBookings, getProviderBookings, updateBookingStatus, makePayment } = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createBooking);
router.get('/customer', protect, getCustomerBookings);
router.get('/provider', protect, authorize('provider'), getProviderBookings);
router.put('/:id/status', protect, authorize('provider', 'admin'), updateBookingStatus);
router.post('/:id/pay', protect, makePayment);

module.exports = router;
