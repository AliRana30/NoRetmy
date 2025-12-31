require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const User = require('../models/User');

async function updateUserRole() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    // Get email/username from command line argument
    const userIdentifier = process.argv[2];
    
    if (!userIdentifier) {
      const allUsers = await User.find({}, 'email username role').limit(10);
      allUsers.forEach(u => {
        });
      await mongoose.connection.close();
      return;
    }

    // Find user by email or username
    const user = await User.findOne({ 
      $or: [
        { email: userIdentifier },
        { username: userIdentifier }
      ]
    });

    if (!user) {
      const allUsers = await User.find({}, 'email username role').limit(10);
      allUsers.forEach(u => {
        });
      
      await mongoose.connection.close();
      return;
    }

    // Update role to admin
    user.role = 'admin';
    await user.save();

    await mongoose.connection.close();
    } catch (error) {
    console.error('❌ Error updating user role:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

updateUserRole();
