import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Calendar, MapPin, FileText, Clock } from 'lucide-react';
import { updateEvent } from '../services/api';

const EditEventModal = ({ event, onClose, onEventUpdated }) => {
  const [formData, setFormData] = useState({
    title: event.title || '',
    time: event.time ? new Date(event.time).toISOString().slice(0, 16) : '',
    place: event.place || '',
    description: event.description || ''
  });
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

    try {
      const response = await updateEvent(event._id, {
        ...formData,
        time: new Date(formData.time)
      });
      onEventUpdated(response.data);
      onClose();
    } catch (err) {
      setError('Failed to update event. Please try again.');
      console.error('Event update error:', err);
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
        className="glass rounded-3xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-yellow-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-4xl">🐢</span>
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent">
              Edit Event
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
          {/* Title */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <FileText className="w-4 h-4 text-red-600" />
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., Study Session, Game Night"
              required
            />
          </div>

          {/* Time */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Clock className="w-4 h-4 text-red-600" />
              Date & Time
            </label>
            <input
              type="datetime-local"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          {/* Place */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 text-red-600" />
              Location
            </label>
            <input
              type="text"
              name="place"
              value={formData.place}
              onChange={handleChange}
              className="input-field"
              placeholder="e.g., McKeldin Library, Stamp Student Union"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
              <Calendar className="w-4 h-4 text-red-600" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field resize-none"
              placeholder="What's this event about?"
              rows="4"
              required
            />
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
              className="btn-primary flex-1"
            >
              Save Changes
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

export default EditEventModal;
