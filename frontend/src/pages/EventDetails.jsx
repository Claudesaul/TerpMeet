import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Calendar, MapPin, Users, Clock, User, Sparkles
} from 'lucide-react';
import { getEvent, attendEvent, leaveEvent } from '../services/api';
import { useUser } from '../context/UserContext';

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useUser();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEvent();
  }, [id]);

  const loadEvent = async () => {
    try {
      const response = await getEvent(id);
      setEvent(response.data);
    } catch (err) {
      console.error('Failed to load event:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAttend = async () => {
    try {
      const response = await attendEvent(id, currentUser._id);
      setEvent(response.data);
    } catch (err) {
      console.error('Failed to attend event:', err);
    }
  };

  const handleLeave = async () => {
    try {
      const response = await leaveEvent(id, currentUser._id);
      setEvent(response.data);
    } catch (err) {
      console.error('Failed to leave event:', err);
    }
  };

  const isAttending = () => {
    return event?.attendees.some(a => a._id === currentUser._id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Event not found</h2>
          <button onClick={() => navigate('/dashboard')} className="btn-primary">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass sticky top-0 z-40 border-b border-white/20"
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate('/dashboard')}
            className="p-2 hover:bg-gray-100 rounded-xl transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </motion.button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Event Details
            </h1>
          </div>
        </div>
      </motion.header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-3xl p-8 mb-6"
        >
          {/* Event Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 flex items-center gap-2">
                <User className="w-4 h-4" />
                Created by {event.creatorId?.name || 'Unknown'}
              </p>
            </div>
            {isAttending() && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold"
              >
                You're Attending
              </motion.div>
            )}
          </div>

          {/* Event Info */}
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
              <Clock className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Date & Time</p>
                <p className="font-semibold text-gray-800">
                  {new Date(event.time).toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-4 bg-pink-50 rounded-xl">
              <MapPin className="w-8 h-8 text-pink-600" />
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-semibold text-gray-800">{event.place}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{event.description}</p>
          </div>

          {/* Action Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={isAttending() ? handleLeave : handleAttend}
            className={`w-full py-4 rounded-xl font-semibold text-lg transition-all ${
              isAttending()
                ? 'bg-red-50 text-red-600 hover:bg-red-100'
                : 'btn-primary'
            }`}
          >
            {isAttending() ? 'Leave Event' : 'Join Event'}
          </motion.button>
        </motion.div>

        {/* Attendees */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass rounded-3xl p-8"
        >
          <div className="flex items-center gap-2 mb-6">
            <Users className="w-6 h-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">
              Attendees ({event.attendees.length})
            </h3>
          </div>

          {event.attendees.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No one is attending yet. Be the first!
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.attendees.map((attendee, index) => (
                <motion.div
                  key={attendee._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                    {attendee.name?.charAt(0).toUpperCase() || '?'}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{attendee.name}</p>
                    <p className="text-sm text-gray-600">{attendee.majorYear}</p>
                    {attendee.interests && (
                      <p className="text-xs text-purple-600 mt-1">
                        {attendee.interests}
                      </p>
                    )}
                  </div>
                  {attendee._id === currentUser._id && (
                    <div className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                      You
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default EventDetails;
