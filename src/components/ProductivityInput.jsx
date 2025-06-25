import { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Send, Zap, Target, Activity } from 'lucide-react';
import { db } from '../lib/supabaseClient';

const ProductivityInput = ({ onProductivitySubmitted }) => {
  const [score, setScore] = useState(5);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const productivityOptions = [
    { value: 1, emoji: '😴', label: 'Very Low', color: 'text-red-600' },
    { value: 2, emoji: '😕', label: 'Low', color: 'text-orange-600' },
    { value: 3, emoji: '😐', label: 'Below Average', color: 'text-yellow-600' },
    { value: 4, emoji: '🙂', label: 'Average', color: 'text-blue-600' },
    { value: 5, emoji: '😊', label: 'Above Average', color: 'text-indigo-600' },
    { value: 6, emoji: '💪', label: 'Good', color: 'text-purple-600' },
    { value: 7, emoji: '🔥', label: 'Very Good', color: 'text-pink-600' },
    { value: 8, emoji: '🚀', label: 'Excellent', color: 'text-green-600' },
    { value: 9, emoji: '⚡', label: 'Outstanding', color: 'text-emerald-600' },
    { value: 10, emoji: '🏆', label: 'Perfect', color: 'text-teal-600' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      await db.addProductivity(score, note);
      setSubmitted(true);
      setNote('');
      if (onProductivitySubmitted) {
        onProductivitySubmitted();
      }
      
      // Reset after showing success
      setTimeout(() => {
        setSubmitted(false);
      }, 2000);
    } catch (error) {
      console.error('Error submitting productivity:', error);
      alert('Failed to submit productivity. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProductivityIcon = (scoreValue) => {
    if (scoreValue >= 8) return <Zap className="h-6 w-6" />;
    if (scoreValue >= 6) return <Target className="h-6 w-6" />;
    if (scoreValue >= 4) return <Activity className="h-6 w-6" />;
    return <TrendingUp className="h-6 w-6" />;
  };

  const getProductivityLevel = (scoreValue) => {
    if (scoreValue >= 8) return 'Excellent';
    if (scoreValue >= 6) return 'Good';
    if (scoreValue >= 4) return 'Fair';
    return 'Poor';
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-8"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <TrendingUp className="h-8 w-8 text-green-600" />
        </motion.div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Productivity Submitted!
        </h3>
        <p className="text-gray-600">
          Thank you for tracking your productivity today.
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Productivity Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          How productive were you today?
        </label>
        <div className="grid grid-cols-5 gap-2">
          {productivityOptions.map((option) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => setScore(option.value)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                score === option.value
                  ? 'bg-green-100 border-2 border-green-300'
                  : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
              }`}
            >
              <span className="text-lg">{option.emoji}</span>
              <span className={`text-xs font-medium ${option.color}`}>
                {option.value}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Productivity Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Productivity Level</span>
          <span className="text-sm font-medium text-gray-900">{score}/10</span>
        </div>
        <input
          type="range"
          min="1"
          max="10"
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #ef4444 0%, #f97316 10%, #eab308 20%, #3b82f6 30%, #8b5cf6 40%, #ec4899 50%, #10b981 60%, #059669 70%, #0d9488 80%, #14b8a6 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>😴</span>
          <span>😐</span>
          <span>💪</span>
          <span>🚀</span>
          <span>🏆</span>
        </div>
      </div>

      {/* Current Level Display */}
      <div className="p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900">
              {getProductivityLevel(score)} Level
            </p>
            <p className="text-xs text-gray-600">
              {productivityOptions.find(opt => opt.value === score)?.label}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            {getProductivityIcon(score)}
            <span className="text-2xl">
              {productivityOptions.find(opt => opt.value === score)?.emoji}
            </span>
          </div>
        </div>
      </div>

      {/* Note Input */}
      <div>
        <label htmlFor="productivity-note" className="block text-sm font-medium text-gray-700 mb-2">
          Add a note (optional)
        </label>
        <textarea
          id="productivity-note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="What contributed to your productivity today? Any challenges or achievements?"
          rows={3}
          className="input-field resize-none"
          maxLength={500}
        />
        <div className="flex justify-between items-center mt-1">
          <span className="text-xs text-gray-500">
            {note.length}/500 characters
          </span>
          {note.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center space-x-1"
            >
              {getProductivityIcon(score)}
              <span className="text-xs text-gray-600">
                {getProductivityLevel(score)}
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={loading}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Submit Productivity</span>
          </>
        )}
      </motion.button>
    </form>
  );
};

export default ProductivityInput;