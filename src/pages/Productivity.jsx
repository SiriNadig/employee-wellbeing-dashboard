import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Target, 
  Calendar, 
  Activity,
  BarChart3,
  Clock,
  Zap,
  Award
} from 'lucide-react';
import { db } from '../lib/supabaseClient';
import ProductivityInput from '../components/ProductivityInput';
import ProductivityChart from '../components/ProductivityChart';

const Productivity = () => {
  const [productivity, setProductivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntries: 0,
    averageProductivity: 0,
    currentStreak: 0,
    bestScore: 0,
    weeklyAverage: 0
  });

  useEffect(() => {
    const fetchProductivityData = async () => {
      try {
        const productivityData = await db.getProductivity(50);
        setProductivity(productivityData);
        
        // Calculate statistics
        if (productivityData.length > 0) {
          const avgProductivity = productivityData.reduce((sum, p) => sum + p.score, 0) / productivityData.length;
          const bestScore = Math.max(...productivityData.map(p => p.score));
          
          // Calculate current streak (consecutive days with entries)
          let streak = 0;
          const today = new Date();
          const sortedProductivity = productivityData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          
          for (let i = 0; i < sortedProductivity.length; i++) {
            const productivityDate = new Date(sortedProductivity[i].created_at);
            const daysDiff = Math.floor((today - productivityDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === streak) {
              streak++;
            } else {
              break;
            }
          }

          // Calculate weekly average (last 7 entries)
          const weeklyData = productivityData.slice(0, 7);
          const weeklyAverage = weeklyData.length > 0 
            ? weeklyData.reduce((sum, p) => sum + p.score, 0) / weeklyData.length 
            : 0;
          
          setStats({
            totalEntries: productivityData.length,
            averageProductivity: Math.round(avgProductivity * 10) / 10,
            currentStreak: streak,
            bestScore,
            weeklyAverage: Math.round(weeklyAverage * 10) / 10
          });
        }
      } catch (error) {
        console.error('Error fetching productivity data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductivityData();
  }, []);

  const getProductivityLevel = (score) => {
    if (score >= 8) return { level: 'Excellent', color: 'text-green-600', bg: 'bg-green-100' };
    if (score >= 6) return { level: 'Good', color: 'text-blue-600', bg: 'bg-blue-100' };
    if (score >= 4) return { level: 'Fair', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Poor', color: 'text-red-600', bg: 'bg-red-100' };
  };

  const getProductivityEmoji = (score) => {
    if (score >= 8) return '🚀';
    if (score >= 6) return '💪';
    if (score >= 4) return '😐';
    return '😴';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Productivity Tracker</h1>
        <p className="text-gray-600 mt-2">
          Monitor your daily productivity and identify patterns to optimize your work performance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageProductivity}/10</p>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Weekly Average</p>
              <p className="text-2xl font-bold text-gray-900">{stats.weeklyAverage}/10</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.currentStreak} days</p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Zap className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Best Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.bestScore}/10</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Award className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Productivity Input and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Rate Your Productivity</h3>
          <ProductivityInput onProductivitySubmitted={() => window.location.reload()} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Productivity Trends</h3>
          <ProductivityChart />
        </motion.div>
      </div>

      {/* Productivity Insights */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Performance Level */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Level</h3>
          <div className="space-y-4">
            {(() => {
              const level = getProductivityLevel(stats.averageProductivity);
              return (
                <div className={`p-4 rounded-lg ${level.bg}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-gray-900">{level.level}</p>
                      <p className="text-sm text-gray-600">
                        Average score: {stats.averageProductivity}/10
                      </p>
                    </div>
                    <span className="text-2xl">{getProductivityEmoji(stats.averageProductivity)}</span>
                  </div>
                </div>
              );
            })()}
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Poor (1-3)</span>
                <span className="text-gray-600">Excellent (8-10)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 h-2 rounded-full"
                  style={{ width: `${(stats.averageProductivity / 10) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Tips for Improvement */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Improvement</h3>
          <div className="space-y-3">
            {stats.averageProductivity < 6 && (
              <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
                <Activity className="h-4 w-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Set Clear Goals</p>
                  <p className="text-sm text-gray-600">
                    Break down tasks into smaller, manageable chunks
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <Clock className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Time Blocking</p>
                <p className="text-sm text-gray-600">
                  Schedule focused work periods without interruptions
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <BarChart3 className="h-4 w-4 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Track Progress</p>
                <p className="text-sm text-gray-600">
                  Monitor your productivity patterns to identify peak hours
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Productivity History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Productivity History</h3>
        {productivity.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No productivity entries yet. Start tracking your productivity!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {productivity.slice(0, 10).map((entry) => {
              const level = getProductivityLevel(entry.score);
              return (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{getProductivityEmoji(entry.score)}</span>
                    <div>
                      <p className="font-medium text-gray-900">
                        Productivity: {entry.score}/10
                      </p>
                      {entry.note && (
                        <p className="text-sm text-gray-600">{entry.note}</p>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${level.color} ${level.bg}`}>
                      {entry.score}/10
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Productivity;