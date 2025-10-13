const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Function to list all users
async function listAllUsers() {
  try {
    const users = await User.find({}, 'email name createdAt isEmailVerified').sort({ createdAt: -1 });
    console.log('\n📋 All users in database:');
    console.log('═'.repeat(80));
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      users.forEach((user, index) => {
        const verifiedStatus = user.isEmailVerified ? '✅ Verified' : '❌ Not Verified';
        console.log(`${index + 1}. Email: ${user.email}`);
        console.log(`   Name: ${user.name || 'Not provided'}`);
        console.log(`   Status: ${verifiedStatus}`);
        console.log(`   Created: ${new Date(user.createdAt).toLocaleString()}`);
        console.log('─'.repeat(40));
      });
    }
    
    console.log(`\n📊 Total users: ${users.length}`);
  } catch (error) {
    console.error('Error fetching users:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the function
listAllUsers();