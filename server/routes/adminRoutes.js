const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    getAllUsers,
    approveDoctor,
    deleteUser,
    getStats
} = require('../controllers/adminController');

// All routes are protected and admin-only
router.use(protect);
router.use(adminOnly);

router.get('/users', getAllUsers);
router.put('/approve-doctor/:id', approveDoctor);
router.delete('/users/:id', deleteUser);
router.get('/stats', getStats);

module.exports = router;
