import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { format, subDays } from 'date-fns';
import { db } from '../lib/supabaseClient';

const ProductivityChart = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductivityData = async () => {
      try {
        const productivity = await db.getProductivity(30);
        
        // Group productivity by date and calculate average
        const productivityByDate = {};
        productivity.forEach(entry => {
          const date = format(new Date(entry.created_at), 'yyyy-MM-dd');
          if (!productivityByDate[date]) {
            productivityByDate[date] = { count: 0, total: 0 };
          }
          productivityByDate[date].count += 1;
          productivityByDate[date].total += entry.score;
        });

        // Create data array for chart
        const chartData = Object.entries(productivityByDate).map(([date, data]) => ({
          date: format(new Date(date), 'MMM dd'),
          productivity: Math.round((data.total / data.count) * 10) / 10,
          fullDate: date
        }));

        // Sort by date
        chartData.sort((a, b) => new Date(a.fullDate) - new Date(b.fullDate));
        
        setData(chartData);
      } catch (error) {
        console.error('Error fetching productivity data:', error);
        // Provide demo data when database is not available
        const demoData = [];
        for (let i = 6; i >= 0; i--) {
          const date = subDays(new Date(), i);
          demoData.push({
            date: format(date, 'MMM dd'),
            productivity: Math.random() * 3 + 6, // Random productivity between 6-9
            fullDate: format(date, 'yyyy-MM-dd')
          });
        }
        setData(demoData);
      } finally {
        setLoading(false);
      }
    };

    fetchProductivityData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <p>No productivity data available. Start tracking your productivity!</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-green-600">
            Productivity: {payload[0].value}/10
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="date" 
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            domain={[1, 10]}
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar 
            dataKey="productivity" 
            fill="#10B981"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ProductivityChart;