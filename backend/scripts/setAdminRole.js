/**
 * Script to set a user's role to admin in the database
 * 
 * Usage: node scripts/setAdminRole.js <email>
 * Example: node scripts/setAdminRole.js admin@example.com
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const setAdminRole = async (email) => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGO);
    // Find user by email
    const user = await User.findOne({ email: email });
    
    if (!user) {
      console.error(`❌ User with email "${email}" not found.`);
      process.exit(1);
    }

    // Update role to admin and add all permissions
    user.role = 'admin';
    user.permissions = [
      'user_management',
      'order_management',
      'payment_management',
      'system_settings',
      'analytics_view',
      'content_moderation',
      'seller_management',
      'promotion_management'
    ];

    // Save without triggering password hashing (password not modified)
    await user.save();

    // Also update via updateOne to be sure
    await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          role: 'admin',
          permissions: user.permissions
        }
      }
    );
    
    } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

// Get email from command line argument
const email = process.argv[2];

if (!email) {
  process.exit(1);
}

setAdminRole(email);
