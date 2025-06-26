import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Heart, 
  Calendar, 
  Activity,
  Users,
  Clock,
  Target
} from 'lucide-react';
import { db } from '../lib/supabaseClient';
import MoodChart from '../components/MoodChart';
import ProductivityChart from '../components/ProductivityChart';
import MeetingSummary from '../components/MeetingSummary';
import WellnessTips from '../components/WellnessTips';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalMoods: 0,
    avgMood: 0,
    totalProductivity: 0,
    avgProductivity: 0,
    totalMeetings: 0,
    overloadDays: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [moods, productivity, meetings] = await Promise.all([
          db.getMoods(30),
          db.getProductivity(30),
          db.getMeetings(30)
        ]);

        const avgMood = moods.length > 0 
          ? moods.reduce((sum, m) => sum + m.mood, 0) / moods.length 
          : 0;
        
        const avgProductivity = productivity.length > 0 
          ? productivity.reduce((sum, p) => sum + p.score, 0) / productivity.length 
          : 0;

        // Calculate meeting overload (days with >4 meetings)
        const meetingDays = {};
        meetings.forEach(meeting => {
          const date = new Date(meeting.start_time).toDateString();
          meetingDays[date] = (meetingDays[date] || 0) + 1;
        });
        const overloadDays = Object.values(meetingDays).filter(count => count > 4).length;

        setStats({
          totalMoods: moods.length,
          avgMood: Math.round(avgMood * 10) / 10,
          totalProductivity: productivity.length,
          avgProductivity: Math.round(avgProductivity * 10) / 10,
          totalMeetings: meetings.length,
          overloadDays
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Provide demo data when database is not available
        setStats({
          totalMoods: 15,
          avgMood: 7.2,
          totalProductivity: 12,
          avgProductivity: 8.1,
          totalMeetings: 8,
          overloadDays: 2
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: 'Average Mood',
      value: stats.avgMood,
      change: '+0.2',
      changeType: 'positive',
      icon: Heart,
      color: 'blue'
    },
    {
      title: 'Productivity Score',
      value: stats.avgProductivity,
      change: '+0.5',
      changeType: 'positive',
      icon: Activity,
      color: 'green'
    },
    {
      title: 'Meetings This Week',
      value: stats.totalMeetings,
      change: '-2',
      changeType: 'negative',
      icon: Calendar,
      color: 'purple'
    },
    {
      title: 'Overload Days',
      value: stats.overloadDays,
      change: '-1',
      changeType: 'positive',
      icon: Clock,
      color: 'orange'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-soft bg-offwhite dark:bg-dm-offblack min-h-screen transition-all duration-200">
      <div className="space-y-8 px-4 md:px-12">
        {/* Header */}
        <div className="mb-2">
          <h1 className="text-4xl font-bold text-lavender dark:text-dm-lavender mb-2">Dashboard</h1>
          <p className="text-mint dark:text-dm-mint text-lg mt-2">
            Welcome back! Here's your well-being overview.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {statCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card flex flex-col justify-between h-full bg-babyblue dark:bg-dm-babyblue rounded-2xl shadow-soft p-8 transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-base font-medium text-mint dark:text-dm-mint mb-1">{card.title}</p>
                    <p className="text-3xl font-bold text-lavender dark:text-dm-lavender">{card.value}</p>
                  </div>
                  <div className="p-4 rounded-full bg-cream dark:bg-dm-cream shadow-soft">
                    <Icon className="h-7 w-7 text-lavender dark:text-dm-lavender" />
                  </div>
                </div>
                <div className="mt-6 flex items-center">
                  {card.changeType === 'positive' ? (
                    <TrendingUp className="h-5 w-5 text-mint dark:text-dm-mint mr-2" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-blush dark:text-dm-blush mr-2" />
                  )}
                  <span className={`text-base font-medium ${
                    card.changeType === 'positive' ? 'text-mint dark:text-dm-mint' : 'text-blush dark:text-dm-blush'
                  }`}>
                    {card.change} from last week
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="card bg-mint dark:bg-dm-mint rounded-2xl shadow-soft p-8 transition-all duration-200"
          >
            <h3 className="text-xl font-semibold text-lavender dark:text-dm-lavender mb-4">Mood Trends</h3>
            <MoodChart />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="card bg-lavender dark:bg-dm-lavender rounded-2xl shadow-soft p-8 transition-all duration-200"
          >
            <h3 className="text-xl font-semibold text-mint dark:text-dm-mint mb-4">Productivity Trends</h3>
            <ProductivityChart />
          </motion.div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="card bg-babyblue dark:bg-dm-babyblue rounded-2xl shadow-soft p-8 transition-all duration-200"
          >
            <h3 className="text-xl font-semibold text-lavender dark:text-dm-lavender mb-4">Meeting Analysis</h3>
            <MeetingSummary />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="card bg-babyblue dark:bg-dm-babyblue rounded-2xl shadow-soft p-8 transition-all duration-200"
          >
            <h3 className="text-xl font-semibold text-lavender dark:text-dm-lavender mb-4">Wellness Tips</h3>
            <WellnessTips />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
