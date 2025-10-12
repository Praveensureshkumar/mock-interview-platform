const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Script to delete existing users for testing
async function deleteUser() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📊 Connected to MongoDB');

    // Get email from command line argument or prompt for it
    const email = process.argv[2];
    
    if (!email) {
      console.log('❌ Please provide an email address');
      console.log('Usage: node delete-user.js user@example.com');
      process.exit(1);
    }

    // Find and delete the user
    const deletedUser = await User.findOneAndDelete({ email: email.toLowerCase() });
    
    if (deletedUser) {
      console.log(`✅ Successfully deleted user: ${deletedUser.email}`);
      console.log(`   Name: ${deletedUser.name}`);
      console.log(`   Created: ${deletedUser.createdAt}`);
      console.log(`   Email Verified: ${deletedUser.isEmailVerified}`);
    } else {
      console.log(`❌ User not found with email: ${email}`);
    }

  } catch (error) {
    console.error('❌ Error deleting user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Alternative: Delete ALL users (use with caution!)
async function deleteAllUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📊 Connected to MongoDB');

    // Count users first
    const userCount = await User.countDocuments();
    console.log(`⚠️  Found ${userCount} users in database`);
    
    if (userCount === 0) {
      console.log('✅ Database is already empty');
      return;
    }

    // Delete ALL users
    const result = await User.deleteMany({});
    console.log(`🗑️  Successfully deleted ${result.deletedCount} users`);
    console.log('✅ All users have been removed from the database');

  } catch (error) {
    console.error('❌ Error deleting all users:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Alternative: Delete all test users
async function deleteAllTestUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📊 Connected to MongoDB');

    // Delete users with test emails
    const result = await User.deleteMany({
      email: { 
        $regex: /(test|demo|example|temp)/, 
        $options: 'i' 
      }
    });

    console.log(`✅ Deleted ${result.deletedCount} test users`);

  } catch (error) {
    console.error('❌ Error deleting test users:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Alternative: List all users
async function listAllUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📊 Connected to MongoDB');

    const users = await User.find({}, 'name email isEmailVerified createdAt').sort({ createdAt: -1 });
    
    console.log(`\n📋 Found ${users.length} users:`);
    console.log('='.repeat(80));
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
      console.log(`   Email Verified: ${user.isEmailVerified ? '✅' : '❌'}`);
      console.log(`   Created: ${user.createdAt.toLocaleDateString()}`);
      console.log('-'.repeat(40));
    });

  } catch (error) {
    console.error('❌ Error listing users:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Check command line arguments
const command = process.argv[2];

if (command === 'list') {
  listAllUsers();
} else if (command === 'delete-test') {
  deleteAllTestUsers();
} else if (command === 'delete-all') {
  deleteAllUsers();
} else if (command && command.includes('@')) {
  deleteUser();
} else {
  console.log('\n🗑️  USER MANAGEMENT SCRIPT');
  console.log('='.repeat(40));
  console.log('Usage:');
  console.log('  node delete-user.js user@example.com     # Delete specific user');
  console.log('  node delete-user.js list                 # List all users');
  console.log('  node delete-user.js delete-test          # Delete all test users');
  console.log('  node delete-user.js delete-all           # Delete ALL users (⚠️  CAUTION!)');
  console.log('\nExamples:');
  console.log('  node delete-user.js john@example.com');
  console.log('  node delete-user.js test@gmail.com');
  process.exit(1);
}