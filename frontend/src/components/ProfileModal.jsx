import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, User, BookOpen, Heart, Image } from 'lucide-react';
import { updateUser } from '../services/api';
import { useUser } from '../context/UserContext';

const ProfileModal = ({ onClose }) => {
  const { currentUser, setCurrentUser } = useUser();
  const [formData, setFormData] = useState({
    name: currentUser.name || '',
    majorYear: currentUser.majorYear || '',
    interests: currentUser.interests || '',
    avatar: currentUser.avatar || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const response = await updateUser(currentUser._id, formData);
      setCurrentUser(response.data);
      onClose();
    } catch (err) {
      setError('Failed to update profile. Please try again.');
      console.error('Profile update error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="glass rounded-3xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">🐢</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
              Edit Profile
            </h2>
          </div>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all"
          >
            <X className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <User className="w-4 h-4 text-red-600" />
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              placeholder="Your full name"
              required
            />
          </div>

          {/* Major/Year */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <BookOpen className="w-4 h-4 text-red-600" />
              Major & Year
            </label>
            <input
              type="text"
              name="majorYear"
              value={formData.majorYear}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Computer Science, Junior"
              required
            />
          </div>

          {/* Interests */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Heart className="w-4 h-4 text-red-600" />
              Interests
            </label>
            <textarea
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="What are you interested in?"
              rows="3"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Image className="w-4 h-4 text-red-600" />
              Avatar URL
            </label>
            <input
              type="url"
              name="avatar"
              value={formData.avatar}
              onChange={handleChange}
              className="input-field"
              placeholder="https://example.com/avatar.png"
            />
            {formData.avatar && (
              <div className="mt-3 flex items-center gap-3">
                <img
                  src={formData.avatar}
                  alt="Avatar preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-red-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div
                  className="w-16 h-16 bg-gradient-to-br from-red-600 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-2xl"
                  style={{ display: formData.avatar ? 'none' : 'flex' }}
                >
                  {formData.name?.charAt(0).toUpperCase() || '?'}
                </div>
                <p className="text-xs text-gray-600">Preview</p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              onClick={onClose}
              className="btn-secondary"
            >
              Cancel
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ProfileModal;
