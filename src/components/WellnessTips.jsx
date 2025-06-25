import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Lightbulb, 
  Coffee, 
  Heart, 
  Activity, 
  Moon, 
  Users,
  ArrowRight,
  CheckCircle
} from 'lucide-react';

const WellnessTips = () => {
  const [activeTip, setActiveTip] = useState(0);

  const tips = [
    {
      icon: Coffee,
      title: 'Take Regular Breaks',
      description: 'Follow the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.',
      category: 'Eye Health'
    },
    {
      icon: Activity,
      title: 'Move Your Body',
      description: 'Take a 5-minute walk every hour. Even standing up and stretching can improve your mood and productivity.',
      category: 'Physical Health'
    },
    {
      icon: Heart,
      title: 'Practice Mindfulness',
      description: 'Take 2-3 deep breaths when feeling stressed. Focus on the present moment.',
      category: 'Mental Health'
    },
    {
      icon: Moon,
      title: 'Maintain Sleep Schedule',
      description: 'Try to go to bed and wake up at the same time every day, even on weekends.',
      category: 'Sleep'
    },
    {
      icon: Users,
      title: 'Connect with Colleagues',
      description: 'Schedule virtual coffee chats or team check-ins to maintain social connections.',
      category: 'Social'
    },
    {
      icon: Lightbulb,
      title: 'Set Boundaries',
      description: 'Establish clear work hours and communicate them to your team. Respect your personal time.',
      category: 'Work-Life Balance'
    }
  ];

  const nextTip = () => {
    setActiveTip((prev) => (prev + 1) % tips.length);
  };

  const prevTip = () => {
    setActiveTip((prev) => (prev - 1 + tips.length) % tips.length);
  };

  return (
    <div className="space-y-4">
      {/* Tip Navigation */}
      <div className="flex items-center justify-between">
        <h4 className="font-medium text-gray-900">Wellness Tips</h4>
        <div className="flex items-center space-x-2">
          <button
            onClick={prevTip}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="h-4 w-4 rotate-180" />
          </button>
          <span className="text-sm text-gray-500">
            {activeTip + 1} of {tips.length}
          </span>
          <button
            onClick={nextTip}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Current Tip */}
      <motion.div
        key={activeTip}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100"
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            {(() => {
              const Icon = tips[activeTip].icon;
              return <Icon className="h-5 w-5 text-blue-600" />;
            })()}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded-full">
                {tips[activeTip].category}
              </span>
            </div>
            <h5 className="font-semibold text-gray-900 mb-2">
              {tips[activeTip].title}
            </h5>
            <p className="text-sm text-gray-600 leading-relaxed">
              {tips[activeTip].description}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="space-y-2">
        <h5 className="font-medium text-gray-900 text-sm">Quick Actions</h5>
        <div className="grid grid-cols-2 gap-2">
          <button className="flex items-center space-x-2 p-2 text-sm bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-700">Mark as Done</span>
          </button>
          <button className="flex items-center space-x-2 p-2 text-sm bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <Activity className="h-4 w-4 text-blue-600" />
            <span className="text-blue-700">Start Timer</span>
          </button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex justify-center space-x-1">
        {tips.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveTip(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === activeTip ? 'bg-blue-600' : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default WellnessTips;
