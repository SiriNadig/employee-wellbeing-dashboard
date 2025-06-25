import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, TrendingUp, Smile, Frown, Meh } from 'lucide-react';
import { db } from '../lib/supabaseClient';
import MoodInput from '../components/MoodInput';
import MoodChart from '../components/MoodChart';

const Mood = () => {
  const [moods, setMoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalEntries: 0,
    averageMood: 0,
    currentStreak: 0,
    bestMood: 0
  });

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const moodData = await db.getMoods(50);
        setMoods(moodData);
        
        // Calculate statistics
        if (moodData.length > 0) {
          const avgMood = moodData.reduce((sum, m) => sum + m.mood, 0) / moodData.length;
          const bestMood = Math.max(...moodData.map(m => m.mood));
          
          // Calculate current streak (consecutive days with entries)
          let streak = 0;
          const today = new Date();
          const sortedMoods = moodData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          
          for (let i = 0; i < sortedMoods.length; i++) {
            const moodDate = new Date(sortedMoods[i].created_at);
            const daysDiff = Math.floor((today - moodDate) / (1000 * 60 * 60 * 24));
            
            if (daysDiff === streak) {
              streak++;
            } else {
              break;
            }
          }
          
          setStats({
            totalEntries: moodData.length,
            averageMood: Math.round(avgMood * 10) / 10,
            currentStreak: streak,
            bestMood
          });
        }
      } catch (error) {
        console.error('Error fetching mood data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  const getMoodEmoji = (mood) => {
    if (mood >= 4) return '😊';
    if (mood >= 3) return '😐';
    return '😞';
  };

  const getMoodColor = (mood) => {
    if (mood >= 4) return 'text-green-600 bg-green-100';
    if (mood >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mood Tracker</h1>
        <p className="text-gray-600 mt-2">
          Track your daily mood and emotional well-being patterns.
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
              <p className="text-sm font-medium text-gray-600">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalEntries}</p>
            </div>
            <div className="p-3 rounded-full bg-blue-100">
              <Heart className="h-6 w-6 text-blue-600" />
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
              <p className="text-sm font-medium text-gray-600">Average Mood</p>
              <p className="text-2xl font-bold text-gray-900">{stats.averageMood}/5</p>
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
              <p className="text-sm font-medium text-gray-600">Current Streak</p>
              <p className="text-2xl font-bold text-gray-900">{stats.currentStreak} days</p>
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
              <p className="text-sm font-medium text-gray-600">Best Mood</p>
              <p className="text-2xl font-bold text-gray-900">{stats.bestMood}/5</p>
            </div>
            <div className="p-3 rounded-full bg-yellow-100">
              <Smile className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Mood Input and Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How are you feeling today?</h3>
          <MoodInput onMoodSubmitted={() => window.location.reload()} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="card"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Trends</h3>
          <MoodChart />
        </motion.div>
      </div>

      {/* Recent Mood History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="card"
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Mood History</h3>
        {moods.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No mood entries yet. Start tracking your mood!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {moods.slice(0, 10).map((mood) => (
              <div key={mood.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{getMoodEmoji(mood.mood)}</span>
                  <div>
                    <p className="font-medium text-gray-900">
                      Mood: {mood.mood}/5
                    </p>
                    {mood.note && (
                      <p className="text-sm text-gray-600">{mood.note}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${getMoodColor(mood.mood)}`}>
                    {mood.mood}/5
                  </span>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(mood.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Mood;
