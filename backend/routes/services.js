const express = require('express');
const { getAllServices, getServiceById, createService, updateService, deleteService, getProviderServices, addReview } = require('../controllers/serviceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', getAllServices);
router.get('/provider', protect, authorize('provider'), getProviderServices);
router.get('/:id', getServiceById);
router.post('/', protect, authorize('provider'), createService);
router.put('/:id', protect, authorize('provider', 'admin'), updateService);
router.delete('/:id', protect, authorize('provider', 'admin'), deleteService);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
