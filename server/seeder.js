const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

dotenv.config();

const doctors = [
    { name: 'Dr. Aarav Mehta', gender: 'Male', specialization: 'Cardiologist' },
    { name: 'Dr. Ananya Iyer', gender: 'Female', specialization: 'Gynecologist' },
    { name: 'Dr. Rohit Sharma', gender: 'Male', specialization: 'Orthopedic Surgeon' },
    { name: 'Dr. Pooja Verma', gender: 'Female', specialization: 'Dermatologist' },
    { name: 'Dr. Kunal Malhotra', gender: 'Male', specialization: 'Neurologist' },
    { name: 'Dr. Sneha Kulkarni', gender: 'Female', specialization: 'Pediatrician' },
    { name: 'Dr. Vikram Singh Rathore', gender: 'Male', specialization: 'General Surgeon' },
    { name: 'Dr. Neha Banerjee', gender: 'Female', specialization: 'Psychiatrist' },
    { name: 'Dr. Aditya Nair', gender: 'Male', specialization: 'Pulmonologist' },
    { name: 'Dr. Ritika Choudhary', gender: 'Female', specialization: 'Endocrinologist' },
    { name: 'Dr. Siddharth Jain', gender: 'Male', specialization: 'Gastroenterologist' },
    { name: 'Dr. Megha Patel', gender: 'Female', specialization: 'Radiologist' },
    { name: 'Dr. Arjun Kapoor', gender: 'Male', specialization: 'Urologist' },
    { name: 'Dr. Kavita Joshi', gender: 'Female', specialization: 'Ophthalmologist' },
    { name: 'Dr. Nitin Agarwal', gender: 'Male', specialization: 'Nephrologist' },
    { name: 'Dr. Shalini Saxena', gender: 'Female', specialization: 'Oncologist' },
    { name: 'Dr. Manish Bansal', gender: 'Male', specialization: 'ENT Specialist' },
    { name: 'Dr. Aishwarya Deshpande', gender: 'Female', specialization: 'Anesthesiologist' },
    { name: 'Dr. Praveen Reddy', gender: 'Male', specialization: 'Diabetologist' },
    { name: 'Dr. Sunita Malhotra', gender: 'Female', specialization: 'Internal Medicine' },
    { name: 'Dr. Rhea Chakraborty', gender: 'Female', specialization: 'Rheumatologist' },
    { name: 'Dr. Siddhant Verma', gender: 'Male', specialization: 'Neurosurgeon' },
    { name: 'Dr. Isha Khurana', gender: 'Female', specialization: 'Allergist' },
    { name: 'Dr. Kabir Bhatia', gender: 'Male', specialization: 'Orthopedic Spine Surgeon' },
    { name: 'Dr. Maya Kapoor', gender: 'Female', specialization: 'Sports Medicine' },
    { name: 'Dr. Varun Grover', gender: 'Male', specialization: 'Cardiothoracic Surgeon' },
    { name: 'Dr. Leena Thomas', gender: 'Female', specialization: 'Hematologist' },
    { name: 'Dr. Arpit Kulkarni', gender: 'Male', specialization: 'Plastic Surgeon' },
    { name: 'Dr. Nisha Mehra', gender: 'Female', specialization: 'Infectious Disease' },
    { name: 'Dr. Harsh Malhotra', gender: 'Male', specialization: 'Geriatric Medicine' }
];

const seedDoctors = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Optional: clear existing doctors to avoid duplicates if running multiple times?
        // Let's not delete all users, just maybe these ones? Or just append. 
        // User asked to "add", implies appending. I'll just create them.

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const doctorUsers = doctors.map(doc => {
            const emailName = doc.name.split(' ').slice(1).join('.').toLowerCase();
            return {
                name: doc.name,
                email: `${emailName}@healthportal.com`,
                password: hashedPassword, // Manually hashed to bypass pre-save hook for bulk op? 
                // Actually insertMany doesn't trigger pre('save') hooks properly in some versions or needs manual loop.
                // Better to use a loop to be safe or pre-hash. I pre-hashed above.
                role: 'doctor',
                gender: doc.gender,
                specialization: doc.specialization,
                isDoctorApproved: true, // Auto approve these seeded doctors
                phone: '123-456-7890'
            };
        });

        // Create Admin User
        const adminExists = await User.findOne({ email: 'admin@healthportal.com' });
        if (!adminExists) {
            await User.create({
                name: 'Super Admin',
                email: 'admin@healthportal.com',
                password: hashedPassword, // Uses same hash 'password123'
                role: 'admin',
                phone: '000-000-0000'
            });
            console.log('Admin User Created');
        } else {
            console.log('Admin User Already Exists');
        }

        // Loop and create to ensure validation? or insertMany. insertMany is faster.
        // But since we manually hashed, insertMany is fine.
        // Wait, User schema required fields... looks good.

        // Let's filter out if they already exist to be safe
        for (const doc of doctorUsers) {
            const exists = await User.findOne({ email: doc.email });
            if (!exists) {
                await User.create({
                    ...doc,
                    password: 'password123' // Let the pre-save hook handle hashing!
                });
                console.log(`Added ${doc.name}`);
            } else {
                console.log(`Skipped ${doc.name} (Already exists)`);
            }
        }

        console.log('Doctors Seeded Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDoctors();
