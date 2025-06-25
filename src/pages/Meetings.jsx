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
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Meeting Analysis</h1>
        <p className="text-gray-600 mt-2">
          Analyze your meeting patterns and detect overload to improve work-life balance.
        </p>
      </div>

      {/* Connection Status */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-full ${connected ? 'bg-green-100' : 'bg-gray-100'}`}>
              <Calendar className={`h-6 w-6 ${connected ? 'text-green-600' : 'text-gray-400'}`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">
                Google Calendar {connected ? 'Connected' : 'Not Connected'}
              </h3>
              <p className="text-sm text-gray-600">
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
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </button>
              <button className="btn-secondary flex items-center space-x-2">
                <Settings className="h-4 w-4" />
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
          className="card"
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
          className="card"
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
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {/* Meeting Patterns */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Meeting Patterns</h3>
              <BarChart3 className="h-5 w-5 text-gray-400" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Most Active Day</p>
                  <p className="text-sm text-gray-600">Tuesday</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-600">5</p>
                  <p className="text-xs text-gray-500">meetings</p>
                </div>
              </div>
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Average Duration</p>
                  <p className="text-sm text-gray-600">45 minutes</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-600">45</p>
                  <p className="text-xs text-gray-500">min</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Recommendations</h3>
              <AlertTriangle className="h-5 w-5 text-orange-400" />
            </div>
            <div className="space-y-3">
              <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-orange-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Reduce Tuesday Meetings</p>
                  <p className="text-sm text-gray-600">
                    Consider moving some meetings to less busy days
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Clock className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Set Meeting Limits</p>
                  <p className="text-sm text-gray-600">
                    Try to keep meetings under 30 minutes when possible
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Block Focus Time</p>
                  <p className="text-sm text-gray-600">
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
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How it works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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