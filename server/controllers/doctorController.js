const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');
const User = require('../models/User');

// @desc    Get doctor's appointments
// @route   GET /api/doctor/appointments
// @access  Private (Doctor)
exports.getDoctorAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find({ doctorId: req.user.id })
            .populate('patientId', 'name email phone gender')
            .sort({ date: 1, time: 1 });

        res.status(200).json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Update appointment status
// @route   PUT /api/doctor/appointments/:id
// @access  Private (Doctor)
exports.updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findById(req.params.id);

        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' });
        }

        if (appointment.doctorId.toString() !== req.user.id) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        appointment.status = status;
        await appointment.save();

        res.status(200).json(appointment);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Issue Prescription
// @route   POST /api/doctor/prescriptions
// @access  Private (Doctor)
exports.issuePrescription = async (req, res) => {
    try {
        const { appointmentId, patientId, diagnosis, medicines, notes } = req.body;

        const prescription = await Prescription.create({
            appointmentId,
            patientId,
            doctorId: req.user.id,
            diagnosis,
            medicines,
            notes
        });

        // Auto-complete appointment if prescription is issued? Optional logic.
        // await Appointment.findByIdAndUpdate(appointmentId, { status: 'completed' });

        res.status(201).json(prescription);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get my patients (based on appointment history)
// @route   GET /api/doctor/patients
// @access  Private (Doctor)
exports.getMyPatients = async (req, res) => {
    try {
        // Find all matching appointments
        const appointments = await Appointment.find({ doctorId: req.user.id }).populate('patientId', 'name email phone gender');

        // Extract unique patients
        const patientMap = new Map();
        appointments.forEach(apt => {
            if (apt.patientId) {
                patientMap.set(apt.patientId._id.toString(), apt.patientId);
            }
        });

        const patients = Array.from(patientMap.values());
        res.status(200).json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
