import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, Send, Smile, Meh, Frown } from 'lucide-react'
import { db } from '../lib/supabaseClient'

const MoodInput = ({ onMoodSubmitted }) => {
  const [mood, setMood] = useState(3)
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const moodOptions = [
    { value: 1, emoji: '🥺', label: 'Very Bad', color: 'text-blush dark:text-dm-blush' },
    { value: 2, emoji: '😟', label: 'Bad', color: 'text-lavender dark:text-dm-lavender' },
    { value: 3, emoji: '😐', label: 'Okay', color: 'text-mint dark:text-dm-mint' },
    { value: 4, emoji: '🙂', label: 'Good', color: 'text-babyblue dark:text-dm-babyblue' },
    { value: 5, emoji: '🌸', label: 'Great', color: 'text-cream dark:text-dm-cream' }
  ]

  const handleSubmit = async e => {
    e.preventDefault()
    if (loading) return

    setLoading(true)
    try {
      await db.addMood(mood, note)
      setSubmitted(true)
      setNote('')
      if (onMoodSubmitted) {
        onMoodSubmitted()
      }
      
      // Reset after showing success
      setTimeout(() => {
        setSubmitted(false)
      }, 2000)
    } catch (error) {
      console.error('Error submitting mood:', error)
      alert('Failed to submit mood. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getMoodIcon = (moodValue) => {
    if (moodValue >= 4) return <Smile className="h-6 w-6" />
    if (moodValue >= 3) return <Meh className="h-6 w-6" />
    return <Frown className="h-6 w-6" />
  }

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
          className="w-16 h-16 bg-mint dark:bg-dm-mint rounded-full flex items-center justify-center mx-auto mb-4"
        >
          <Heart className="h-8 w-8 text-babyblue dark:text-dm-babyblue" />
        </motion.div>
        <h3 className="text-lg font-semibold text-mint dark:text-dm-mint mb-2">
          Mood Submitted!
        </h3>
        <p className="text-mint dark:text-dm-mint">
          Thank you for tracking your mood today.
        </p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Mood Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-4">
          How are you feeling today?
        </label>
        <div className="flex justify-between items-center">
          {moodOptions.map((option) => (
            <motion.button
              key={option.value}
              type="button"
              onClick={() => setMood(option.value)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`flex flex-col items-center space-y-2 p-3 rounded-2xl font-soft transition-all duration-200 shadow-soft focus:outline-none focus:ring-2 focus:ring-babyblue dark:focus:ring-dm-babyblue ${
                mood === option.value
                  ? 'bg-babyblue dark:bg-dm-babyblue border-2 border-mint dark:border-dm-mint'
                  : 'bg-cream dark:bg-dm-cream hover:bg-mint dark:hover:bg-dm-mint border-2 border-transparent'
              }`}
            >
              <span className="text-2xl animate-pulse">{option.emoji}</span>
              <span className={`text-xs font-medium ${option.color}`}>{option.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Mood Slider */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-600">Mood Level</span>
          <span className="text-sm font-medium text-gray-900">{mood}/5</span>
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={mood}
          onChange={(e) => setMood(Number(e.target.value))}
          className="w-full h-2 bg-mint dark:bg-dm-mint rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, #FADBD8 0%, #D5F5E3 50%, #D6EAF8 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>🥺</span>
          <span>��</span>
          <span>🌸</span>
        </div>
      </div>

      {/* Note Input */}
      <div>
        <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
          Add a note (optional)
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="How was your day? Any specific feelings or events?"
          rows={3}
          className="input-field resize-none font-soft"
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
              {getMoodIcon(mood)}
              <span className="text-xs text-gray-600">
                {moodOptions.find(opt => opt.value === mood)?.label}
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
        className="w-full btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed font-soft rounded-2xl shadow-soft"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            <span>Submitting...</span>
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            <span>Submit Mood</span>
          </>
        )}
      </motion.button>
    </form>
  )
}

export default MoodInput
