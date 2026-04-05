A full-stack task management application built with the MERN stack (MongoDB, Express.js, React, Node.js). Create, manage, and organize your tasks with a modern dark-themed UI.

🌐 Live Demo
Service	URL
Frontend	https://taskmaster-mern-rho.vercel.app
Backend API	https://taskmaster-mern-last.vercel.app

✨ Features
🔐 User Authentication — Secure signup & login with JWT
✅ Task CRUD — Create, read, update, and delete tasks
📊 Dashboard — View and manage all your tasks in one place
🌙 Dark Theme — Sleek dark UI with golden accent colors
🔒 Protected Routes — Only authenticated users can access the dashboard
📱 Responsive Design — Works on desktop and mobile devices
🚀 Deployed on Vercel — Both frontend and backend hosted on Vercel


🛠️ Tech Stack
Frontend
React (with Vite / CRA)
React Router DOM — Client-side routing
Context API — Global auth state management
CSS — Custom styling with dark theme
Backend
Node.js — Runtime environment
Express.js — Web framework
MongoDB — NoSQL database (via Mongoose)
JWT — JSON Web Tokens for authentication
bcrypt — Password hashing




 Project Structure
Backend
Backend/
├── config/
│   └── db.js                 # MongoDB connection setup
├── controllers/
│   ├── taskController.js     # Task CRUD logic
│   └── userController.js     # Auth (register/login) logic
├── middleware/
│   └── auth.js               # JWT authentication middleware
├── models/
│   ├── taskModel.js          # Mongoose Task schema
│   └── userModel.js          # Mongoose User schema
├── routes/
│   ├── taskRoute.js          # Task API endpoints
│   └── userRoute.js          # Auth API endpoints
├── .env                      # Environment variables
├── package.json
├── server.js                 # Express app entry point
└── vercel.json               # Vercel deployment config

  Frontend
Frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   ├── Login.jsx     # Login form component
│   │   │   └── Signup.jsx    # Signup form component
│   │   ├── Dashboard/
│   │   │   ├── TaskList.jsx  # List of all tasks
│   │   │   ├── TaskForm.jsx  # Add/edit task form
│   │   │   └── TaskItem.jsx  # Individual task card
│   │   └── Layout/
│   │       ├── Navbar.jsx    # Top navigation bar
│   │       └── Sidebar.jsx   # Side navigation
│   ├── context/
│   │   └── AuthContext.jsx   # Authentication context provider
│   ├── pages/
│   │   ├── LoginPage.jsx     # Login page
│   │   ├── SignupPage.jsx    # Signup page
│   │   └── DashboardPage.jsx # Main dashboard page
│   ├── App.jsx               # Main app with routes
│   ├── main.jsx              # React entry point
│   └── index.css             # Global styles
├── package.json
└── vercel.json               # Vercel SPA rewrite config


🚀 Getting Started
Prerequisites
Node.js (v16+)
npm or yarn
MongoDB (local or Atlas cloud)


Backend Setup
cd Backend
npm install
Create a .env file in the Backend/ folder:

PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Start the backend server:

npm start
The API will be running at http://localhost:3000

3. Frontend Setup
cd Frontend
npm install
Update the API base URL in your frontend code to point to your backend:

http://localhost:3000/api
Start the frontend:

npm run dev
The app will be running at http://localhost:5173 (Vite)

📡 API Endpoints
Auth Routes (/api/users)
Method	Endpoint	Description	Auth Required
POST	/register	Register a new user	❌
POST	/login	Login & get token	❌
Task Routes (/api/tasks)
Method	Endpoint	Description	Auth Required
GET	/	Get all user tasks	✅
POST	/	Create a new task	✅
PUT	/:id	Update a task	✅
DELETE	/:id	Delete a task	✅
☁️ Deployment (Vercel)
Backend vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
Frontend vercel.json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
⚠️ The frontend vercel.json is essential to fix 404 errors on page refresh. It tells Vercel to serve index.html for all routes, allowing React Router to handle client-side navigation.


🤝 Contributing
Fork the repository
Create your feature branch (git checkout -b feature/amazing-feature)
Commit your changes (git commit -m 'Add amazing feature')
Push to the branch (git push origin feature/amazing-feature)
Open a Pull Request
📄 License
This project is open source and available under the MIT License.

👤 Author: Alisha Amir
Made with ❤️ using the MERN Stack

⭐ Star this repo if you found it helpful!
1. Clone the Repository
git clone https://github.com/your-username/taskmaster-mern.git
cd taskmaster-mern
