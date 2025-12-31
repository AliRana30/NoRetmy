/**
 * Script to update a user's role to admin
 * Run with: node scripts/makeAdmin.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const EMAIL_TO_MAKE_ADMIN = 'alimahmoodrana82@gmail.com';

// All available admin permissions
const ALL_ADMIN_PERMISSIONS = [
  'user_management',
  'order_management', 
  'payment_management',
  'system_settings',
  'analytics_view',
  'content_moderation',
  'seller_management',
  'promotion_management'
];

async function makeUserAdmin() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // Find the user
    const user = await User.findOne({ email: EMAIL_TO_MAKE_ADMIN });

    if (!user) {
      process.exit(1);
    }

    // Update user to admin
    user.role = 'admin';
    user.permissions = ALL_ADMIN_PERMISSIONS;
    
    // Save without triggering password rehash
    await User.updateOne(
      { _id: user._id },
      { 
        $set: { 
          role: 'admin',
          permissions: ALL_ADMIN_PERMISSIONS 
        }
      }
    );

    // Verify the update
    const updatedUser = await User.findOne({ email: EMAIL_TO_MAKE_ADMIN });
    } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

makeUserAdmin();
