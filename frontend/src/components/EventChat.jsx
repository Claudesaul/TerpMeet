import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Send, MessageCircle } from 'lucide-react';
import { sendMessage } from '../services/api';
import { useUser } from '../context/UserContext';

const EventChat = ({ event, onMessageSent }) => {
  const { currentUser } = useUser();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const prevMessageCount = useRef(0);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    const currentCount = event?.messages?.length || 0;
    // Only scroll if there's a NEW message (count increased)
    if (currentCount > prevMessageCount.current) {
      scrollToBottom();
    }
    prevMessageCount.current = currentCount;
  }, [event?.messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!message.trim() || sending) return;

    setSending(true);
    try {
      const response = await sendMessage(event._id, currentUser._id, message.trim());
      setMessage('');
      if (onMessageSent) {
        onMessageSent(response.data);
      }
      // Keep focus in input after sending
      setTimeout(() => inputRef.current?.focus(), 100);
    } catch (err) {
      console.error('Failed to send message:', err);
    } finally {
      setSending(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <div className="glass rounded-3xl h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-bold text-gray-800">Event Chat</h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          {event?.messages?.length || 0} messages
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {(!event?.messages || event.messages.length === 0) ? (
          <div className="text-center text-gray-500 py-12">
            <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          event.messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
              className={`flex gap-3 ${msg.userId?._id === currentUser._id ? 'flex-row-reverse' : ''}`}
            >
              {/* Avatar */}
              <div className="flex-shrink-0">
                {msg.userId?.avatar ? (
                  <img
                    src={msg.userId.avatar}
                    alt={msg.userId.name}
                    className="w-8 h-8 rounded-full object-cover border-2 border-red-500"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : null}
                <div
                  className="w-8 h-8 bg-gradient-to-br from-red-600 to-yellow-600 rounded-full flex items-center justify-center text-white font-bold text-xs"
                  style={{ display: msg.userId?.avatar ? 'none' : 'flex' }}
                >
                  {msg.userId?.name?.charAt(0).toUpperCase() || '?'}
                </div>
              </div>

              {/* Message Bubble */}
              <div className={`flex-1 max-w-[70%] ${msg.userId?._id === currentUser._id ? 'text-right' : ''}`}>
                <div className={`inline-block rounded-2xl px-4 py-2 ${
                  msg.userId?._id === currentUser._id
                    ? 'bg-gradient-to-r from-red-600 to-yellow-500 text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}>
                  <p className="text-xs font-semibold mb-1 opacity-80">
                    {msg.userId?.name || 'Unknown'}
                  </p>
                  <p className="text-sm break-words">{msg.text}</p>
                </div>
                <p className="text-xs text-gray-500 mt-1 px-1">
                  {formatTime(msg.timestamp)}
                </p>
              </div>
            </motion.div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form onSubmit={handleSend} className="p-6 border-t border-gray-200">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="input-field flex-1"
            disabled={sending}
            autoFocus
          />
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={!message.trim() || sending}
            className="bg-gradient-to-r from-red-600 to-yellow-500 text-white p-3 rounded-xl hover:from-red-700 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </motion.button>
        </div>
      </form>
    </div>
  );
};

export default EventChat;
