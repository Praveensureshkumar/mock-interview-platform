const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();

async function deleteAllUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    
    const result = await User.deleteMany({});
    console.log(`✅ Deleted ${result.deletedCount} users from database`);
    console.log('🆕 Database is now clean for fresh testing');
    
  } catch (error) {
    console.error('❌ Error deleting users:', error);
  } finally {
    mongoose.connection.close();
  }
}

deleteAllUsers();