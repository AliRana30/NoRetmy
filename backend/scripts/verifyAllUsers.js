require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function verifyAllUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const unverifiedUsers = await User.find({ isVerified: false });
    
    if (unverifiedUsers.length === 0) {
      process.exit(0);
    }

    for (const user of unverifiedUsers) {
      user.isVerified = true;
      user.verificationToken = undefined;
      user.verificationTokenExpiry = undefined;
      await user.save();
      }

    } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

verifyAllUsers();
