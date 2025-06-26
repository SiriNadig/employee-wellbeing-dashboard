import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ExternalLink,
  RefreshCw,
  Settings,
  BarChart3
} from 'lucide-react';
import GoogleCalendarConnect from '../components/GoogleCalendarConnect';
import MeetingSummary from '../components/MeetingSummary';

const Meetings = () => {
  const [connected, setConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkConnection = () => {
      const accessToken = localStorage.getItem('google_access_token');
      setConnected(!!accessToken);
      setLoading(false);
    };

    checkConnection();
  }, []);

  const handleConnect = () => {
    setConnected(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-soft bg-offwhite dark:bg-dm-offblack min-h-screen transition-all duration-200">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-4xl font-bold text-lavender dark:text-dm-lavender mb-2">Meeting Analysis</h1>
        <p className="text-mint dark:text-dm-mint text-lg mt-2">
          Analyze your meeting patterns and detect overload to improve work-life balance.
        </p>
      </div>

      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card bg-babyblue dark:bg-dm-babyblue rounded-2xl shadow-soft p-8 transition-all duration-200"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-4 rounded-full ${connected ? 'bg-mint dark:bg-dm-mint' : 'bg-cream dark:bg-dm-cream'} shadow-soft`}>
              <Calendar className={`h-7 w-7 ${connected ? 'text-lavender dark:text-dm-lavender' : 'text-mint dark:text-dm-mint'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-lavender dark:text-dm-lavender text-lg">
                Google Calendar {connected ? 'Connected' : 'Not Connected'}
              </h3>
              <p className="text-base text-mint dark:text-dm-mint">
                {connected 
                  ? 'Your calendar is connected and being analyzed'
                  : 'Connect your Google Calendar to analyze meeting patterns'
                }
              </p>
            </div>
          </div>
          {connected && (
            <div className="flex items-center space-x-2">
              <button className="btn-secondary flex items-center space-x-2">
                <RefreshCw className="h-5 w-5" />
                <span>Refresh</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Connection Component */}
      {!connected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card bg-mint dark:bg-dm-mint rounded-2xl shadow-soft p-8 transition-all duration-200"
        >
          <GoogleCalendarConnect onConnect={handleConnect} />
        </motion.div>
      )}

      {/* Meeting Analysis */}
      {connected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card bg-lavender dark:bg-dm-lavender rounded-2xl shadow-soft p-8 transition-all duration-200"
        >
          <MeetingSummary />
        </motion.div>
      )}

      {/* Meeting Insights */}
      {connected && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Meeting Patterns */}
          <div className="card bg-babyblue dark:bg-dm-babyblue rounded-2xl shadow-soft p-8 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-lavender dark:text-dm-lavender">Meeting Patterns</h3>
              <BarChart3 className="h-6 w-6 text-mint dark:text-dm-mint" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-mint dark:bg-dm-mint rounded-2xl">
                <div>
                  <p className="font-medium text-lavender dark:text-dm-lavender">Most Active Day</p>
                  <p className="text-base text-mint dark:text-dm-mint">Tuesday</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-lavender dark:text-dm-lavender">5</p>
                  <p className="text-xs text-mint dark:text-dm-mint">meetings</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-blush dark:bg-dm-blush rounded-2xl">
                <div>
                  <p className="font-medium text-lavender dark:text-dm-lavender">Average Duration</p>
                  <p className="text-base text-mint dark:text-dm-mint">45 minutes</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-lavender dark:text-dm-lavender">45</p>
                  <p className="text-xs text-mint dark:text-dm-mint">min</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card bg-mint dark:bg-dm-mint rounded-2xl shadow-soft p-8 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-lavender dark:text-dm-lavender">Recommendations</h3>
              <AlertTriangle className="h-6 w-6 text-blush dark:text-dm-blush" />
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-4 p-4 bg-blush dark:bg-dm-blush rounded-2xl">
                <AlertTriangle className="h-5 w-5 text-blush dark:text-dm-blush mt-1" />
                <div>
                  <p className="font-medium text-lavender dark:text-dm-lavender">Reduce Tuesday Meetings</p>
                  <p className="text-base text-mint dark:text-dm-mint">
                    Consider moving some meetings to less busy days
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-babyblue dark:bg-dm-babyblue rounded-2xl">
                <Clock className="h-5 w-5 text-mint dark:text-dm-mint mt-1" />
                <div>
                  <p className="font-medium text-lavender dark:text-dm-lavender">Set Meeting Limits</p>
                  <p className="text-base text-mint dark:text-dm-mint">
                    Try to keep meetings under 30 minutes when possible
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4 p-4 bg-lavender dark:bg-dm-lavender rounded-2xl">
                <CheckCircle className="h-5 w-5 text-mint dark:text-dm-mint mt-1" />
                <div>
                  <p className="font-medium text-lavender dark:text-dm-lavender">Block Focus Time</p>
                  <p className="text-base text-mint dark:text-dm-mint">
                    Schedule 2-hour blocks for deep work
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Help Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="card bg-cream dark:bg-dm-cream rounded-2xl shadow-soft p-8 transition-all duration-200"
      >
        <h3 className="text-xl font-semibold text-lavender dark:text-dm-lavender mb-4">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Connect Calendar</h4>
            <p className="text-sm text-gray-600">
              Securely connect your Google Calendar to analyze meeting patterns
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-green-600 font-bold">2</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Automatic Analysis</h4>
            <p className="text-sm text-gray-600">
              We analyze your meetings for overload patterns and productivity impact
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-purple-600 font-bold">3</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Get Insights</h4>
            <p className="text-sm text-gray-600">
              Receive personalized recommendations to improve your work-life balance
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Meetings;