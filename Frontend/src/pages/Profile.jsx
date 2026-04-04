import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { authService } from '../services/auth';
import { 
  FaSignOutAlt,
  FaUser,
  FaLock,
  FaCheck,
  FaEdit
} from "react-icons/fa"; 

const Profile = () => {
  const { user, logout } = useAuth();
  const { rawTasks } = useTasks();
  
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const stats = {
    total: rawTasks.length,
    completed: rawTasks.filter(t => t.completed).length,
    pending: rawTasks.filter(t => !t.completed).length
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await authService.updateProfile(formData.name, formData.email);
      setEditMode(false);
      window.location.reload();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setError('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters!');
      return;
    }
    
    setLoading(true);
    try {
      await authService.updatePassword(
        passwordData.currentPassword, 
        passwordData.newPassword
      );
      setChangePasswordMode(false);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return <div className="p-8 text-center text-gray-400">Loading...</div>;
  }

  return (
    <div className="space-y-10 p-6 md:p-8 lg:p-12 min-h-screen">
      {/* Hero + Stats - UNCHANGED */}
      <div className="text-center">
        <div className="w-32 h-32 bg-gradient-to-br from-yellow-500/30 to-orange-500/30 rounded-full mx-auto mb-6 ring-4 ring-yellow-500/20 shadow-2xl flex items-center justify-center">
          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full shadow-xl flex items-center justify-center font-bold text-2xl text-black">
            {user.name.charAt(0).toUpperCase()}
          </div>
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 bg-clip-text text-transparent mb-3 drop-shadow-2xl">
          {user.name}
        </h1>
        <p className="text-xl text-gray-400 font-medium">{user.email}</p>
        <p className="text-sm text-gray-500 mt-2">Member since {new Date().toLocaleDateString()}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-card p-8 text-center hover:scale-105 transition-all">
          <div className="text-3xl font-bold text-yellow-400 mb-2">{stats.total}</div>
          <div className="text-gray-400 text-lg font-medium">Total Tasks</div>
        </div>
        <div className="glass-card p-8 text-center hover:scale-105 transition-all">
          <div className="text-3xl font-bold text-green-400 mb-2">{stats.completed}</div>
          <div className="text-gray-400 text-lg font-medium">Completed</div>
        </div>
        <div className="glass-card p-8 text-center hover:scale-105 transition-all">
          <div className="text-3xl font-bold text-orange-400 mb-2">{stats.pending}</div>
          <div className="text-gray-400 text-lg font-medium">Pending</div>
        </div>
      </div>

      {/* ✅ FIXED INPUTS - WHITE TEXT VISIBLE */}
      <div className="glass-card p-8 lg:p-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            Profile Information
          </h2>
          {!editMode && (
            <button 
              onClick={() => setEditMode(true)}
              className="bg-gradient-to-r from-yellow-500/90 to-orange-500/90 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-8 py-3 rounded-2xl shadow-xl hover:shadow-yellow-500/50 transition-all flex items-center space-x-2 text-lg border border-yellow-500/50"
            >
              <FaEdit className="w-4 h-4" />
              <span>Edit Profile</span>
            </button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleProfileUpdate} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-300 text-center animate-pulse">
                {error}
              </div>
            )}
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Full Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="input-field w-full p-4 rounded-2xl text-white bg-gray-900/80 border border-gray-700/50 focus:ring-4 focus:ring-yellow-500/40 focus:border-yellow-500/50 placeholder-gray-500"
                placeholder="Enter your name"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-3">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="input-field w-full p-4 rounded-2xl text-white bg-gray-900/80 border border-gray-700/50 focus:ring-4 focus:ring-yellow-500/40 focus:border-yellow-500/50 placeholder-gray-500"
                placeholder="Enter your email"
                required
                disabled={loading}
              />
            </div>
            
            <div className="flex gap-4 pt-4">
              <button 
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setFormData({ name: user?.name || '', email: user?.email || '' });
                  setError('');
                }}
                className="flex-1 bg-gray-800/70 hover:bg-gray-700 border border-gray-600 py-4 px-8 rounded-2xl font-bold text-gray-200 hover:text-white transition-all shadow-lg"
                disabled={loading}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold py-4 px-8 rounded-2xl shadow-xl hover:shadow-yellow-500/50 transition-all disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-6 h-6 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <FaCheck />
                    <span>Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 p-8 bg-gray-900/50 rounded-3xl border border-gray-800/50">
            <div>
              <span className="text-yellow-400 font-bold text-lg block mb-2">Name</span>
              <p className="text-2xl font-bold text-white">{formData.name}</p>
            </div>
            <div>
              <span className="text-yellow-400 font-bold text-lg block mb-2">Email</span>
              <p className="text-xl font-medium text-gray-200 break-all">{formData.email}</p>
            </div>
          </div>
        )}
      </div>

      {/* ✅ FIXED PASSWORD INPUTS - WHITE TEXT */}
      <div className="glass-card p-8 lg:p-12">
        <h2 className="text-3xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Change Password
        </h2>
        
        <form onSubmit={handlePasswordChange} className="space-y-6 max-w-md">
          {error && (
            <div className="p-4 bg-red-500/20 border border-red-500/50 rounded-2xl text-red-300 text-center animate-pulse">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Current Password</label>
            <input
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              className="input-field w-full p-4 rounded-2xl text-white bg-gray-900/80 border border-gray-700/50 focus:ring-4 focus:ring-purple-500/40 focus:border-purple-500/50 placeholder-gray-500"
              placeholder="Enter current password"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">New Password</label>
            <input
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
              className="input-field w-full p-4 rounded-2xl text-white bg-gray-900/80 border border-gray-700/50 focus:ring-4 focus:ring-purple-500/40 focus:border-purple-500/50 placeholder-gray-500"
              placeholder="Enter new password (min 8 chars)"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-300 mb-3">Confirm New Password</label>
            <input
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
              className="input-field w-full p-4 rounded-2xl text-white bg-gray-900/80 border border-gray-700/50 focus:ring-4 focus:ring-purple-500/40 focus:border-purple-500/50 placeholder-gray-500"
              placeholder="Confirm new password"
              required
              disabled={loading}
            />
          </div>
          
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-5 px-8 rounded-2xl shadow-2xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 flex items-center justify-center space-x-2 text-xl"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Updating...</span>
              </>
            ) : (
              <>
                <FaLock />
                <span>Change Password</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Logout - UNCHANGED */}
      <div className="text-center pt-12 pb-8">
        <button
          onClick={logout}
          className="inline-flex items-center space-x-3 px-12 py-4 bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-gray-300 border border-gray-700 rounded-2xl font-bold text-lg shadow-xl hover:shadow-gray-500/30 transition-all hover:scale-105 backdrop-blur-sm"
        >
          <FaSignOutAlt />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Profile;