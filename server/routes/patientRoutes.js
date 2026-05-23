const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { bookAppointment, getMyAppointments, getDoctors } = require('../controllers/appointmentController');
const { getMyPrescriptions } = require('../controllers/prescriptionController');

router.post('/book-appointment', protect, bookAppointment);
router.get('/appointments', protect, getMyAppointments);

router.get('/prescriptions', protect, getMyPrescriptions);
router.get('/doctors', protect, getDoctors);

module.exports = router;
