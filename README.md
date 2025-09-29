# Mock Interview Platform

A full-stack MERN application for conducting mock interviews with real-time feedback and assessment.

## 🚀 Features

- **Interactive Interview Platform**: Conduct mock interviews with real-time interaction
- **User Authentication**: Secure login and registration system
- **Interview Management**: Schedule, manage, and review interviews
- **Real-time Communication**: Live video/audio communication during interviews
- **Performance Analytics**: Track and analyze interview performance
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern JavaScript library for building user interfaces
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API requests
- **Headless UI** - Unstyled, accessible UI components

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **CORS** - Cross-origin resource sharing middleware

## 📋 Prerequisites

Before running this application, make sure you have the following installed:
- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/mock-interview-platform.git
cd mock-interview-platform
```

### 2. Install dependencies

#### For the server:
```bash
cd server
npm install
```

#### For the client:
```bash
cd client
npm install
```

### 3. Environment Setup

Create a `.env` file in the `server` directory:
```env
MONGO_URI=mongodb://localhost:27017/mockInterviewDB
PORT=5000
```

### 4. Start the application

#### Start the backend server:
```bash
cd server
npm run dev
```

#### Start the frontend client:
```bash
cd client
npm start
```

The application will be running on:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📁 Project Structure

```
mock-interview-platform/
├── client/                 # React frontend
│   ├── public/            # Public assets
│   ├── src/               # Source files
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── utils/         # Utility functions
│   │   └── App.js         # Main App component
│   └── package.json       # Frontend dependencies
├── server/                # Node.js backend
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
├── .gitignore             # Git ignore rules
└── README.md              # Project documentation
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📧 Contact

Your Name - your.email@example.com

Project Link: [https://github.com/your-username/mock-interview-platform](https://github.com/your-username/mock-interview-platform)

---

⭐ If you found this project helpful, please give it a star!