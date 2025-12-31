/**
 * Script to list all users in the database
 * Usage: node scripts/listUsers.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

const listUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || process.env.MONGO);
    const users = await User.find({}, 'email fullName username role isSeller isVerified').lean();
    
    users.forEach((user, index) => {
      });

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

listUsers();
