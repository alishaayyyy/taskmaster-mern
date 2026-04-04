import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signup(formData.name, formData.email, formData.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="w-24 h-24 yellow-gradient rounded-2xl mx-auto mb-6 glow"></div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-2">
            TaskMaster
          </h1>
          <p className="text-gray-400">Create your account to get started.</p>
        </div>

        <div className="black-card p-8">
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* ✅ Name Field - SAME SIZE */}
            <div className="mb-6">
              <div className="relative">
                <FaUser className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Full Name"
                  className="input-field pl-12 pr-12 py-4 w-full"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* ✅ Email Field - SAME SIZE */}
            <div className="mb-6">
              <div className="relative">
                <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 w-5 h-5" />
                <input
                  type="email"
                  placeholder="Email"
                  className="input-field pl-12 pr-12 py-4 w-full"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* ✅ Password Field - SAME SIZE + VISIBLE EYE */}
            <div className="mb-6">
              <div className="relative">
                <FaLock className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  className="input-field pl-12 pr-12 py-4 w-full"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-yellow-400 hover:text-yellow-300 transition-colors p-1 rounded"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                </button>
              </div>
            </div>

            {/* ✅ Button PERFECT MATCH */}
            <button 
              type="submit" 
              disabled={loading}
              className="w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-bold text-lg rounded-2xl shadow-2xl hover:shadow-yellow-500/25 hover:scale-[1.02] transition-all duration-200 border border-yellow-500/50 black-card-glow disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-400">
            Already have an account? <Link to="/login" className="text-yellow-400 hover:text-yellow-300 font-medium">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;