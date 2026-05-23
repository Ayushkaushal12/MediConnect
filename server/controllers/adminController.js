const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Doctor = require('../models/User'); // Reuse User model for Doctor

// @desc    Get all users (doctors or patients)
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res) => {
    try {
        const { role } = req.query; // ?role=doctor or ?role=patient
        const query = {};
        if (role) query.role = role;

        const users = await User.find(query).select('-password');
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Approve a doctor
// @route   PUT /api/admin/approve-doctor/:id
// @access  Private (Admin)
exports.approveDoctor = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role !== 'doctor') {
            return res.status(400).json({ message: 'User is not a doctor' });
        }

        user.isDoctorApproved = true;
        await user.save();

        res.status(200).json({ message: 'Doctor approved', user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Prevent deleting other admins (basic protection)
        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot delete admin account' });
        }

        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'User deleted' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// @desc    Get Admin Stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
exports.getStats = async (req, res) => {
    try {
        const totalPatients = await User.countDocuments({ role: 'patient' });
        const totalDoctors = await User.countDocuments({ role: 'doctor' });
        const totalAppointments = await Appointment.countDocuments();
        const pendingDoctors = await User.countDocuments({ role: 'doctor', isDoctorApproved: false });

        res.status(200).json({
            totalPatients,
            totalDoctors,
            totalAppointments,
            pendingDoctors
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
