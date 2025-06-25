import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download,
  Filter,
  RefreshCw,
  Eye,
  Share2
} from 'lucide-react';
import { db } from '../lib/supabaseClient';
import MoodChart from '../components/MoodChart';
import ProductivityChart from '../components/ProductivityChart';
import MeetingSummary from '../components/MeetingSummary';

const Reports = () => {
  const [timeRange, setTimeRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalMoods: 0,
    avgMood: 0,
    totalProductivity: 0,
    avgProductivity: 0,
    totalMeetings: 0,
    overloadDays: 0,
    moodTrend: 'stable',
    productivityTrend: 'stable'
  });

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [moods, productivity, meetings] = await Promise.all([
          db.getMoods(parseInt(timeRange)),
          db.getProductivity(parseInt(timeRange)),
          db.getMeetings(parseInt(timeRange))
        ]);

        const avgMood = moods.length > 0 
          ? moods.reduce((sum, m) => sum + m.mood, 0) / moods.length 
          : 0;

        const avgProductivity = productivity.length > 0 
          ? productivity.reduce((sum, p) => sum + p.score, 0) / productivity.length 
          : 0;

        const meetingDays = {};
        meetings.forEach(meeting => {
          const date = new Date(meeting.start_time).toDateString();
          meetingDays[date] = (meetingDays[date] || 0) + 1;
        });
        const overloadDays = Object.values(meetingDays).filter(count => count > 4).length;

        const moodTrend = avgMood > 3.5 ? 'up' : avgMood < 3 ? 'down' : 'stable';
        const productivityTrend = avgProductivity > 6 ? 'up' : avgProductivity < 5 ? 'down' : 'stable';

        setStats({
          totalMoods: moods.length,
          avgMood: Math.round(avgMood * 10) / 10,
          totalProductivity: productivity.length,
          avgProductivity: Math.round(avgProductivity * 10) / 10,
          totalMeetings: meetings.length,
          overloadDays,
          moodTrend,
          productivityTrend
        });
      } catch (error) {
        console.error('Error fetching report data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, [timeRange]);

  const exportReport = () => {
    const reportData = {
      generatedAt: new Date().toISOString(),
      timeRange: `${timeRange} days`,
      stats,
      summary: `Well-being Report for the last ${timeRange} days`
    };

    const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `wellbeing-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-2">
            Comprehensive insights into your well-being and productivity patterns.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="input-field w-auto"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>
          <button
            onClick={exportReport}
            className="btn-secondary flex items-center space-x-2"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="card"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Mood</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgMood}/5</p>
              <div className="flex items-center mt-1">
                <TrendingUp className={`h-4 w-4 mr-1 ${
                  stats.moodTrend === 'up' ? 'text-green-500' : 
                  stats.moodTrend === 'down' ? 'text-red-500' : 'text-gray-400'
                }`} />
                <span className={`text-xs ${
                  stats.moodTrend === 'up' ? 'text-green-600' : 
                  stats.moodTrend === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stats.moodTrend === 'up' ? 'Improving' : 
                   stats.moodTrend === 'down' ? 'Declining' : 'Stable'}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <BarChart3 className="h-6 w-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Productivity Score</p>
              <p className="text-2xl font-bold text-gray-900">{stats.avgProductivity}/10</p>
              <div className="flex items-center mt-1">
                <TrendingUp className={`h-4 w-4 mr-1 ${
                  stats.productivityTrend === 'up' ? 'text-green-500' : 
                  stats.productivityTrend === 'down' ? 'text-red-500' : 'text-gray-400'
                }`} />
                <span className={`text-xs ${
                  stats.productivityTrend === 'up' ? 'text-green-600' : 
                  stats.productivityTrend === 'down' ? 'text-red-600' : 'text-gray-500'
                }`}>
                  {stats.productivityTrend === 'up' ? 'Improving' : 
                   stats.productivityTrend === 'down' ? 'Declining' : 'Stable'}
                </span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
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
              <p className="text-sm font-medium text-gray-600">Total Meetings</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalMeetings}</p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.overloadDays} overload days
              </p>
            </div>
            <div className="p-3 rounded-full bg-purple-100">
              <Calendar className="h-6 w-6 text-purple-600" />
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
              <p className="text-sm font-medium text-gray-600">Data Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.totalMoods + stats.totalProductivity}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {stats.totalMoods} moods, {stats.totalProductivity} productivity
              </p>
            </div>
            <div className="p-3 rounded-full bg-orange-100">
              <Eye className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Mood Trends</h3>
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <MoodChart />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Productivity Trends</h3>
            <Filter className="h-5 w-5 text-gray-400" />
          </div>
          <ProductivityChart />
        </motion.div>
      </div>

      {/* Meeting Analysis */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="card"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Meeting Analysis</h3>
          <RefreshCw className="h-5 w-5 text-gray-400" />
        </div>
        <MeetingSummary />
      </motion.div>

      {/* Insights and Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="grid grid-cols-1 lg:grid-cols-2 gap-6"
      >
        {/* Key Insights */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h3>
          <div className="space-y-4">
            {stats.avgMood < 3 && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="font-medium text-red-800">Mood Alert</p>
                <p className="text-sm text-red-700">
                  Your average mood is below 3/5. Consider taking breaks and practicing self-care.
                </p>
              </div>
            )}
            
            {stats.avgProductivity < 6 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="font-medium text-yellow-800">Productivity Opportunity</p>
                <p className="text-sm text-yellow-700">
                  Your productivity score suggests room for improvement. Try time-blocking techniques.
                </p>
              </div>
            )}
            
            {stats.overloadDays > 0 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <p className="font-medium text-orange-800">Meeting Overload</p>
                <p className="text-sm text-orange-700">
                  You had {stats.overloadDays} days with more than 4 meetings. Consider reducing meeting frequency.
                </p>
              </div>
            )}
            
            {stats.avgMood >= 4 && stats.avgProductivity >= 7 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="font-medium text-green-800">Great Performance!</p>
                <p className="text-sm text-green-700">
                  You're maintaining excellent mood and productivity levels. Keep up the great work!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Recommendations */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recommendations</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">
              <BarChart3 className="h-4 w-4 text-blue-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Track Consistently</p>
                <p className="text-sm text-gray-600">
                  Regular tracking helps identify patterns and improve well-being
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <TrendingUp className="h-4 w-4 text-green-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Set Goals</p>
                <p className="text-sm text-gray-600">
                  Establish achievable targets for mood and productivity improvement
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">
              <Calendar className="h-4 w-4 text-purple-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Optimize Schedule</p>
                <p className="text-sm text-gray-600">
                  Balance meetings with focused work time for better productivity
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
              <Share2 className="h-4 w-4 text-orange-500 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Share Insights</p>
                <p className="text-sm text-gray-600">
                  Discuss patterns with your team to improve collective well-being
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Reports;