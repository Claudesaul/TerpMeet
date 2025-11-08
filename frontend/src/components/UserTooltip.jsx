import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, BookOpen, Heart } from 'lucide-react';

const UserTooltip = ({ user, children }) => {
  return (
    <div className="relative group">
      {children}

      {/* Tooltip */}
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          whileHover={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.95 }}
          className="absolute left-0 top-full mt-2 z-50 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200"
        >
          <div className="glass rounded-xl p-4 shadow-2xl min-w-[280px]">
            {/* Avatar */}
            <div className="flex items-center gap-3 mb-3">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-red-500"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
              ) : null}
              <div
                className="w-12 h-12 bg-gradient-to-br from-red-600 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-lg"
                style={{ display: user.avatar ? 'none' : 'flex' }}
              >
                {user.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div>
                <h3 className="font-bold text-gray-800">{user.name}</h3>
                <p className="text-xs text-gray-600">@{user.username}</p>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <BookOpen className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <p className="text-gray-700">{user.majorYear}</p>
              </div>

              {user.interests && (
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                  <p className="text-gray-700">{user.interests}</p>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default UserTooltip;
