const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const resetAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected...');

        // Delete existing admin
        await User.deleteOne({ email: 'admin@healthportal.com' });
        console.log('Broken Admin deleted');

        // Create new admin with PLAIN TEXT password -> Model will hash it ONCE
        await User.create({
            name: 'Super Admin',
            email: 'admin@healthportal.com',
            password: 'password123',
            role: 'admin',
            phone: '000-000-0000'
        });

        console.log('Admin User Re-Created Successfully');
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

resetAdmin();
