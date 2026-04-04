import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Navbar from './components/Navbar';
import AddTask from './pages/AddTask';
import Sidebar from './components/Sidebar';
import TaskList from './pages/TaskList';  // ✅ YE BHI
import EditTask from './pages/EditTask'; 

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-8">
    <div className="w-12 h-12 yellow-gradient rounded-full animate-spin shadow-lg"></div>
  </div>
);

// Protected Layout Component
const ProtectedLayout = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }

  return isAuthenticated ? (
    <div className="flex h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  ) : (
    <Navigate to="/login" replace />
  );
};


// App Content with Routes
const AppContent = () => {
  return (
    <Router>
      <Routes>
        {/* Public Routes - Full Screen */}
        <Route 
          path="/login" 
          element={
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
              <Login />
            </div>
          } 
        />
        <Route 
          path="/signup" 
          element={
            <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
              <Signup />
            </div>
          } 
        />
        
        {/* Protected Routes - Full Layout */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedLayout>
              <Dashboard />
            </ProtectedLayout>
          } 
        />
          <Route 
          path="/add-task" 
          element={
            <ProtectedLayout>  
              <AddTask />
            </ProtectedLayout>
          } 
        />
        <Route 
  path="/task-list" 
  element={
    <ProtectedLayout>
      <TaskList />  // ✅ Import bhi kar lena
    </ProtectedLayout>
  } 
/>
<Route path="/edit-task/:id" element={<ProtectedLayout><EditTask /></ProtectedLayout>} />
        <Route 
          path="/profile" 
          element={
            <ProtectedLayout>
              <Profile />
            </ProtectedLayout>
          } 
        />
        
        {/* Redirects */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

// Root App Component
function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <AppContent />
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;