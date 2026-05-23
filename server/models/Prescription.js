const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment',
        required: true
    },
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    diagnosis: {
        type: String,
        required: true
    },
    medicines: [{
        name: String,
        dosage: String,
        frequency: String,
        duration: String
    }],
    notes: {
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
