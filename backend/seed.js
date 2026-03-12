const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const existing = await User.findOne({ email: 'admin@mouflow.com' });
    if (existing) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    await User.create({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@mouflow.com',
      password: 'admin123',
      company: 'MOUFlow Systems',
      role: 'admin'
    });

    console.log('✅ Admin user created: admin@mouflow.com / admin123');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

seedAdmin();
