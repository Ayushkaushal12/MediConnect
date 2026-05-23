const Prescription = require('../models/Prescription');

// @desc    Get my prescriptions
// @route   GET /api/patient/prescriptions
// @access  Private (Patient)
exports.getMyPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patientId: req.user.id })
            .populate('doctorId', 'name')
            .populate('appointmentId', 'date')
            .sort({ date: -1 });

        res.status(200).json(prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
