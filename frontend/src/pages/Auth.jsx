import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { UserPlus, LogIn, Calendar, Users } from 'lucide-react';
import { createUser, loginUser } from '../services/api';
import { useUser } from '../context/UserContext';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    majorYear: '',
    interests: '',
    avatar: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const user = await loginUser(formData.username, formData.password);
        if (user) {
          login(user);
          navigate('/dashboard');
        } else {
          setError('Invalid username or password');
        }
      } else {
        const response = await createUser(formData);
        login(response.data);
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute top-20 left-20 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [90, 0, 90],
          }}
          transition={{ duration: 15, repeat: Infinity }}
          className="absolute bottom-20 right-20 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-3xl p-8 md:p-12 max-w-md w-full relative z-10"
      >
        {/* Logo and Title */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', bounce: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-600 to-yellow-600 rounded-2xl mb-4 shadow-lg">
            <span className="text-4xl">🐢</span>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent mb-2">
            TerpMeet
          </h1>
          <p className="text-gray-600">Connect. Attend. Make Friends.</p>
        </motion.div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              isLogin
                ? 'bg-white shadow-md text-red-600'
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <LogIn className="inline w-5 h-5 mr-2" />
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              !isLogin
                ? 'bg-white shadow-md text-red-600'
                : 'text-gray-600 hover:text-red-600'
            }`}
          >
            <UserPlus className="inline w-5 h-5 mr-2" />
            Sign Up
          </button>
        </div>

        {/* Form */}
        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="input-field"
                placeholder="Enter password"
              />
            </div>

            {!isLogin && (
              <>
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="John Doe"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Major & Year
                  </label>
                  <input
                    type="text"
                    name="majorYear"
                    required={!isLogin}
                    value={formData.majorYear}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Computer Science - Freshman"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Interests
                  </label>
                  <input
                    type="text"
                    name="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="Basketball, Gaming, Coding"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Avatar URL (optional)
                  </label>
                  <input
                    type="url"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    className="input-field"
                    placeholder="https://..."
                  />
                </motion.div>
              </>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 text-red-600 p-3 rounded-lg text-sm"
              >
                {error}
              </motion.div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"
                  />
                  Processing...
                </span>
              ) : isLogin ? (
                'Login'
              ) : (
                'Create Account'
              )}
            </motion.button>
          </motion.form>
        </AnimatePresence>

        {/* Features */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <Calendar className="w-8 h-8 mx-auto text-red-600 mb-2" />
              <p className="text-xs text-gray-600">Join Events</p>
            </div>
            <div>
              <Users className="w-8 h-8 mx-auto text-yellow-600 mb-2" />
              <p className="text-xs text-gray-600">Make Friends</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
