const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const User = require('../models/User');

// @desc    Book an appointment
// @route   POST /api/patient/book-appointment
// @access  Private (Patient)
exports.bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, time, reason } = req.body;

        const appointment = await Appointment.create({
            patientId: req.user.id,
            doctorId,
            date,
            time,
            reason,
            status: 'pending' // Default status
        });

        res.status(201).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get my appointments
// @route   GET /api/patient/appointments
// @access  Private (Patient)
exports.getMyAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ patientId: req.user.id })
            .populate('doctorId', 'name email specialization')
            .sort({ date: 1, time: 1 });

        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get all doctors
// @route   GET /api/patient/doctors
// @access  Private (Patient)
exports.getDoctors = async (req, res) => {
    try {
        // Ideally filter by approved doctors only if we had that flag working fully
        const doctors = await User.find({ role: 'doctor' }).select('-password');
        res.status(200).json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
