import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Calendar, MapPin, Users, Plus, LogOut, User, Clock,
  Sparkles, TrendingUp
} from 'lucide-react';
import { getAllEvents, attendEvent, leaveEvent } from '../services/api';
import { useUser } from '../context/UserContext';
import CreateEventModal from '../components/CreateEventModal';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { currentUser, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/');
      return;
    }
    loadEvents();
  }, [currentUser, navigate]);

  const loadEvents = async () => {
    try {
      const response = await getAllEvents();
      setEvents(response.data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAttend = async (eventId) => {
    try {
      const response = await attendEvent(eventId, currentUser._id);
      setEvents(events.map(e => e._id === eventId ? response.data : e));
    } catch (err) {
      console.error('Failed to attend event:', err);
    }
  };

  const handleLeave = async (eventId) => {
    try {
      const response = await leaveEvent(eventId, currentUser._id);
      setEvents(events.map(e => e._id === eventId ? response.data : e));
    } catch (err) {
      console.error('Failed to leave event:', err);
    }
  };

  const isAttending = (event) => {
    return event.attendees.some(a => a._id === currentUser._id);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
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

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="glass sticky top-0 z-40 border-b border-white/20"
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                TerpMeet
              </h1>
              <p className="text-sm text-gray-600">Welcome, {currentUser.name}!</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-3 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-all"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Total Events</p>
                <p className="text-3xl font-bold text-purple-600">{events.length}</p>
              </div>
              <Calendar className="w-12 h-12 text-purple-600 opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Attending</p>
                <p className="text-3xl font-bold text-pink-600">
                  {events.filter(e => isAttending(e)).length}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-pink-600 opacity-50" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="glass rounded-2xl p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-semibold">Your Profile</p>
                <p className="text-lg font-bold text-purple-600">{currentUser.majorYear}</p>
              </div>
              <User className="w-12 h-12 text-purple-600 opacity-50" />
            </div>
          </motion.div>
        </div>

        {/* Events Grid */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Upcoming Events</h2>

        {events.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-12 text-center"
          >
            <Calendar className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No events yet</h3>
            <p className="text-gray-600 mb-6">Be the first to create an event!</p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary"
            >
              Create First Event
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {events.map((event, index) => (
                <motion.div
                  key={event._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                  className="glass rounded-2xl p-6 cursor-pointer"
                  onClick={() => navigate(`/event/${event._id}`)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800 flex-1">
                      {event.title}
                    </h3>
                    {isAttending(event) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold"
                      >
                        Attending
                      </motion.div>
                    )}
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {new Date(event.time).toLocaleString()}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      {event.place}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {event.attendees.length} attending
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      isAttending(event) ? handleLeave(event._id) : handleAttend(event._id);
                    }}
                    className={`w-full py-3 rounded-xl font-semibold transition-all ${
                      isAttending(event)
                        ? 'bg-red-50 text-red-600 hover:bg-red-100'
                        : 'btn-primary'
                    }`}
                  >
                    {isAttending(event) ? 'Leave Event' : 'Join Event'}
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Create Event Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateEventModal
            onClose={() => setShowCreateModal(false)}
            onEventCreated={loadEvents}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;
