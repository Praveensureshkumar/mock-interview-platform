const mongoose = require('mongoose');
const User = require('./models/User');
const Question = require('./models/Question');
const InterviewResult = require('./models/InterviewResult');
require('dotenv').config();

class DatabaseViewer {
  async connect() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('📊 Connected to MongoDB Atlas');
  }

  async disconnect() {
    await mongoose.disconnect();
    console.log('📊 Disconnected from MongoDB');
  }

  async viewUsers() {
    console.log('\n👥 USERS TABLE:');
    console.log('='.repeat(80));
    
    const users = await User.find({}).sort({ createdAt: -1 });
    
    if (users.length === 0) {
      console.log('   No users found');
      return;
    }

    users.forEach((user, index) => {
      console.log(`${index + 1}. ID: ${user._id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Email Verified: ${user.isEmailVerified ? '✅' : '❌'}`);
      console.log(`   Profile Picture: ${user.profilePicture || 'None'}`);
      console.log(`   Created: ${user.createdAt.toLocaleString()}`);
      console.log(`   Updated: ${user.updatedAt.toLocaleString()}`);
      console.log('-'.repeat(40));
    });
  }

  async viewQuestions() {
    console.log('\n❓ QUESTIONS TABLE:');
    console.log('='.repeat(80));
    
    const questions = await Question.find({}).limit(10);
    
    if (questions.length === 0) {
      console.log('   No questions found');
      return;
    }

    questions.forEach((q, index) => {
      console.log(`${index + 1}. ${q.question.substring(0, 60)}...`);
      console.log(`   Type: ${q.testType} | Difficulty: ${q.difficulty}`);
      console.log(`   Category: ${q.category}`);
      console.log('-'.repeat(40));
    });
    
    const totalQuestions = await Question.countDocuments();
    console.log(`\n📊 Total Questions: ${totalQuestions}`);
  }

  async viewInterviewResults() {
    console.log('\n📝 INTERVIEW RESULTS:');
    console.log('='.repeat(80));
    
    const results = await InterviewResult.find({})
      .populate('userId', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);
    
    if (results.length === 0) {
      console.log('   No interview results found');
      return;
    }

    results.forEach((result, index) => {
      console.log(`${index + 1}. User: ${result.userId?.name || 'Unknown'} (${result.userId?.email || 'N/A'})`);
      console.log(`   Test Type: ${result.testType} | Difficulty: ${result.difficulty}`);
      console.log(`   Score: ${result.overallScore}%`);
      console.log(`   Questions: ${result.questions.length}`);
      console.log(`   Date: ${result.createdAt.toLocaleString()}`);
      console.log('-'.repeat(40));
    });
  }

  async viewDatabaseStats() {
    console.log('\n📊 DATABASE STATISTICS:');
    console.log('='.repeat(80));
    
    const userCount = await User.countDocuments();
    const questionCount = await Question.countDocuments();
    const resultCount = await InterviewResult.countDocuments();
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });
    
    console.log(`👥 Total Users: ${userCount}`);
    console.log(`✅ Verified Users: ${verifiedUsers}`);
    console.log(`❓ Total Questions: ${questionCount}`);
    console.log(`📝 Interview Results: ${resultCount}`);
    
    // Questions by type
    const questionTypes = await Question.aggregate([
      { $group: { _id: "$testType", count: { $sum: 1 } } }
    ]);
    
    console.log('\n📋 Questions by Type:');
    questionTypes.forEach(type => {
      console.log(`   ${type._id}: ${type.count}`);
    });
  }

  async searchUser(email) {
    console.log(`\n🔍 SEARCHING FOR USER: ${email}`);
    console.log('='.repeat(80));
    
    const user = await User.findOne({ 
      email: { $regex: email, $options: 'i' } 
    });
    
    if (!user) {
      console.log('   User not found');
      return;
    }

    console.log(`ID: ${user._id}`);
    console.log(`Name: ${user.name}`);
    console.log(`Email: ${user.email}`);
    console.log(`Email Verified: ${user.isEmailVerified ? '✅' : '❌'}`);
    console.log(`Profile Picture: ${user.profilePicture || 'None'}`);
    console.log(`Email Verification Token: ${user.emailVerificationToken || 'None'}`);
    console.log(`Password Reset Token: ${user.passwordResetToken || 'None'}`);
    console.log(`Created: ${user.createdAt.toLocaleString()}`);
    console.log(`Updated: ${user.updatedAt.toLocaleString()}`);

    // Get user's interview results
    const results = await InterviewResult.find({ userId: user._id });
    console.log(`\n📝 Interview Results: ${results.length}`);
    
    results.forEach((result, index) => {
      console.log(`   ${index + 1}. ${result.testType} (${result.difficulty}) - Score: ${result.overallScore}%`);
    });
  }
}

async function main() {
  const viewer = new DatabaseViewer();
  
  try {
    await viewer.connect();
    
    const command = process.argv[2];
    const param = process.argv[3];
    
    switch (command) {
      case 'users':
        await viewer.viewUsers();
        break;
      case 'questions':
        await viewer.viewQuestions();
        break;
      case 'results':
        await viewer.viewInterviewResults();
        break;
      case 'stats':
        await viewer.viewDatabaseStats();
        break;
      case 'search':
        if (!param) {
          console.log('❌ Please provide email to search: node view-database.js search user@example.com');
          break;
        }
        await viewer.searchUser(param);
        break;
      case 'all':
        await viewer.viewDatabaseStats();
        await viewer.viewUsers();
        await viewer.viewQuestions();
        await viewer.viewInterviewResults();
        break;
      default:
        console.log('\n🗄️  DATABASE VIEWER');
        console.log('='.repeat(40));
        console.log('Commands:');
        console.log('  node view-database.js users       # View all users');
        console.log('  node view-database.js questions   # View questions');
        console.log('  node view-database.js results     # View interview results');
        console.log('  node view-database.js stats       # View database statistics');
        console.log('  node view-database.js search user@example.com # Search user');
        console.log('  node view-database.js all         # View everything');
        break;
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await viewer.disconnect();
  }
}

main();