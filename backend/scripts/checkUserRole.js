const mongoose = require('mongoose');
require('dotenv').config();

const User = require('../models/User');

async function checkAndFixUserRole(email) {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // Find the user
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ User with email "${email}" not found`);
      process.exit(1);
    }

    // Check if user needs to be fixed
    if (user.role !== 'freelancer' && user.isSeller !== true) {
      user.role = 'freelancer';
      user.isSeller = true;
      await user.save();
      
      } else {
      }

    await mongoose.connection.close();
    } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  process.exit(1);
}

checkAndFixUserRole(email);
