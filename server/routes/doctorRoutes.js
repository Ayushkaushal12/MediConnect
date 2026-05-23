const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
    getDoctorAppointments,
    updateAppointmentStatus,
    issuePrescription,
    getMyPatients
} = require('../controllers/doctorController');

router.get('/appointments', protect, getDoctorAppointments);
router.put('/appointments/:id', protect, updateAppointmentStatus);
router.post('/prescriptions', protect, issuePrescription);
router.get('/patients', protect, getMyPatients);

module.exports = router;
