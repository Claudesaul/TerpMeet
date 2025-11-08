import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Heart } from 'lucide-react';

const UserTooltip = ({ user, children }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {children}

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="absolute left-0 top-full mt-1 z-50"
            style={{ pointerEvents: 'auto' }}
          >
            <div className="glass rounded-xl p-4 shadow-2xl min-w-[280px] border-2 border-red-100">
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserTooltip;
