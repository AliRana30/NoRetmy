const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/User');
const UserProfile = require('../models/UserProfile');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    process.exit(1);
  }
};

const setupRoleBasedSystem = async () => {
  try {
    // Step 1: Migrate existing users to new role system
    const usersToUpdate = await User.find({
      $or: [
        { role: { $exists: false } },
        { role: null }
      ]
    });

    for (const user of usersToUpdate) {
      // Determine role based on existing isSeller field
      let newRole = 'client'; // default
      if (user.isSeller === true) {
        newRole = 'freelancer';
      }

      // Update user with new role
      await User.findByIdAndUpdate(user._id, {
        role: newRole,
        permissions: [] // Empty permissions for regular users
      });

      }

    // Step 2: Create initial admin user
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@noretmy.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin123!@#';
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminFullName = process.env.ADMIN_FULLNAME || 'System Administrator';

    // Check if admin already exists
    const existingAdmin = await User.findOne({ 
      $or: [
        { email: adminEmail },
        { role: 'admin' }
      ]
    });

    if (existingAdmin) {
      } else {
      // Create admin user
      const adminUser = new User({
        email: adminEmail,
        password: adminPassword, // Will be hashed by pre-save hook
        fullName: adminFullName,
        username: adminUsername,
        role: 'admin',
        permissions: [
          'user_management',
          'order_management', 
          'payment_management',
          'system_settings',
          'analytics_view',
          'content_moderation',
          'seller_management',
          'promotion_management'
        ],
        isVerified: true,
        isSeller: false,
        isCompany: false,
      });

      await adminUser.save();

      // Create admin profile
      const adminProfile = new UserProfile({
        userId: adminUser._id,
        isCompany: false,
      });

      await adminProfile.save();

      }

    // Step 3: Display role statistics
    const roleStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    roleStats.forEach(stat => {
      });

    // Step 4: Validation checks
    const usersWithoutRole = await User.countDocuments({ 
      $or: [
        { role: { $exists: false } },
        { role: null }
      ]
    });

    const adminCount = await User.countDocuments({ role: 'admin' });
    const verificationIssues = await User.countDocuments({ 
      role: { $ne: 'admin' },
      isVerified: false 
    });

    if (usersWithoutRole === 0 && adminCount > 0) {
      } else {
      }

    // Step 5: Show next steps
    } catch (error) {
    console.error('❌ Error during role-based system setup:', error);
    throw error;
  }
};

// Helper function to create additional admin users
const createAdminUser = async (email, password, fullName, username, permissions = []) => {
  try {
    const existingUser = await User.findOne({ 
      $or: [{ email }, { username }] 
    });
    
    if (existingUser) {
      throw new Error('User with this email or username already exists');
    }

    const adminUser = new User({
      email,
      password, // Will be hashed by pre-save hook
      fullName,
      username,
      role: 'admin',
      permissions: permissions.length > 0 ? permissions : [
        'user_management',
        'order_management',
        'system_settings',
        'analytics_view'
      ],
      isVerified: true,
      isSeller: false,
      isCompany: false,
    });

    await adminUser.save();

    const adminProfile = new UserProfile({
      userId: adminUser._id,
      isCompany: false,
    });

    await adminProfile.save();

    return adminUser;
  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
    throw error;
  }
};

// Main execution
const main = async () => {
  await connectDB();
  
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    if (command === 'setup') {
      await setupRoleBasedSystem();
    } else if (command === 'create-admin') {
      const email = args[1];
      const password = args[2];
      const fullName = args[3] || 'Admin User';
      const username = args[4] || email.split('@')[0];
      
      if (!email || !password) {
        process.exit(1);
      }
      
      await createAdminUser(email, password, fullName, username);
    } else {
      }
  } catch (error) {
    console.error('❌ Script execution failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    }
};

// Execute if run directly
if (require.main === module) {
  main();
}

module.exports = {
  setupRoleBasedSystem,
  createAdminUser
}; 