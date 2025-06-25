import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { format, subDays } from 'date-fns';
import { db } from '../lib/supabaseClient';

const MoodChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const moods = await db.getMoods(30);
        
        // Group moods by date and calculate average
        const moodByDate = {};
        moods.forEach(mood => {
          const date = format(new Date(mood.created_at), 'yyyy-MM-dd');
          if (!moodByDate[date]) {
            moodByDate[date] = { count: 0, total: 0 };
          }
          moodByDate[date].count += 1;
          moodByDate[date].total += mood.mood;
        });

        // Create data array for chart
        const chartData = Object.entries(moodByDate).map(([date, data]) => ({
          date: format(new Date(date), 'MMM dd'),
          mood: Math.round((data.total / data.count) * 10) / 10,
          fullDate: date
        }));

        // Sort by date
        chartData.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
        
        setData(chartData);
      } catch (error) {
        console.error('Error fetching mood data:', error);
        // Provide demo data when database is not available
        const demoData = [];
        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i);
          demoData.push({
            date: format(date, 'MMM dd'),
            mood: Math.random() * 2 + 3.5, // Random mood between 3.5-5.5
            fullDate: format(date, 'yyyy-MM-dd')
          });
        }
        setData(demoData);
      } finally {
        setLoading(false);
      }
    };

    fetchMoodData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No mood data available. Start tracking your mood!</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-blue-600">
            Mood: {payload[0].value}/5
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <defs>
            <linearGradient id="moodGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={[1, 5]}
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="mood"
            stroke="#3B82F6"
            strokeWidth={2}
            fill="url(#moodGradient)"
            dot={{ fill: '#3B82F6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3B82F6', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;
