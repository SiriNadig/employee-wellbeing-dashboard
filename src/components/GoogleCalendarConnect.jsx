import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, ExternalLink, CheckCircle, AlertCircle } from 'lucide-react';

const GoogleCalendarConnect = ({ onConnect }) => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI;
  const SCOPES = 'https://www.googleapis.com/auth/calendar.readonly';

  useEffect(() => {
    // Check if we're returning from OAuth
    const params = new URLSearchParams(window.location.hash.replace('#', '?'));
    const accessToken = params.get('access_token');
    const error = params.get('error');

    if (error) {
      setError('Failed to connect to Google Calendar. Please try again.');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (accessToken) {
      localStorage.setItem('google_access_token', accessToken);
      setConnected(true);
      if (onConnect) onConnect();
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      // Check if already connected
      const existingToken = localStorage.getItem('google_access_token');
      if (existingToken) {
        setConnected(true);
      }
    }
  }, [onConnect]);

  const handleConnect = () => {
    if (!GOOGLE_CLIENT_ID) {
      setError('Google Client ID not configured. Please check your environment variables.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&response_type=token&scope=${encodeURIComponent(SCOPES)}&prompt=consent&access_type=offline`;
      window.location.href = authUrl;
    } catch (err) {
      setError('Failed to initiate Google Calendar connection.');
      setLoading(false);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem('google_access_token');
    setConnected(false);
    if (onConnect) onConnect();
  };

  const testConnection = async () => {
    setLoading(true);
    try {
      const accessToken = localStorage.getItem('google_access_token');
      if (!accessToken) {
        throw new Error('No access token found');
      }

      const response = await fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
        headers: { Authorization: `Bearer ${accessToken}` }
      });

      if (!response.ok) {
        throw new Error('Invalid access token');
      }

      // Connection is working
      setError('');
    } catch (err) {
      setError('Connection test failed. Please reconnect your calendar.');
      localStorage.removeItem('google_access_token');
      setConnected(false);
    } finally {
      setLoading(false);
    }
  };

  if (connected) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <CheckCircle className="h-8 w-8 text-green-600" />
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Google Calendar Connected
        </h3>
        <p className="text-gray-600 mb-6">
          Your calendar is connected and ready for analysis.
        </p>
        <div className="flex justify-center space-x-3">
          <button
            onClick={testConnection}
            disabled={loading}
            className="btn-secondary flex items-center space-x-2"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
            ) : (
              <Calendar className="h-4 w-4" />
            )}
            <span>Test Connection</span>
          </button>
          <button
            onClick={handleDisconnect}
            className="btn-secondary text-red-600 hover:text-red-700"
          >
            Disconnect
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Calendar className="h-8 w-8 text-blue-600" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Connect Google Calendar
      </h3>
      
      <p className="text-gray-600 mb-6">
        Securely connect your Google Calendar to analyze meeting patterns and detect overload.
      </p>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg mb-4"
        >
          <AlertCircle className="h-4 w-4 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </motion.div>
      )}

      <motion.button
        onClick={handleConnect}
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="btn-primary flex items-center justify-center space-x-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Connecting...</span>
          </>
        ) : (
          <>
            <ExternalLink className="h-4 w-4" />
            <span>Connect Calendar</span>
          </>
        )}
      </motion.button>

      <div className="mt-6 text-sm text-gray-500">
        <p className="mb-2">What we access:</p>
        <ul className="space-y-1 text-xs">
          <li>• Calendar events and meetings</li>
          <li>• Event times and durations</li>
          <li>• Meeting titles and descriptions</li>
        </ul>
        <p className="mt-3 text-xs">
          We only read your calendar data. We never modify or create events.
        </p>
      </div>
    </div>
  );
};

export default GoogleCalendarConnect;