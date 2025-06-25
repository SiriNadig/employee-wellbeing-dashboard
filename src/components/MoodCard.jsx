import { useState } from 'react';

const moods = [
  { emoji: '😄', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😔', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
];

const MoodCard = () => {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleSelectMood = (mood) => {
    setSelectedMood(mood);
  };

  const today = new Date().toLocaleDateString();

  return (
    <div className="bg-white rounded-2xl shadow p-6">
      <h2 className="text-lg font-semibold mb-2">How are you feeling today?</h2>
      <p className="text-sm text-gray-500 mb-4">{today}</p>
      <div className="flex justify-between">
        {moods.map((mood) => (
          <button
            key={mood.label}
            onClick={() => handleSelectMood(mood.label)}
            className={`text-3xl p-3 rounded-full transition-all duration-200 ${
              selectedMood === mood.label
                ? 'bg-blue-100 ring-2 ring-blue-500'
                : 'hover:bg-gray-100'
            }`}
          >
            {mood.emoji}
          </button>
        ))}
      </div>
      {selectedMood && (
        <p className="mt-4 text-sm text-blue-600">
          You selected: <strong>{selectedMood}</strong>
        </p>
      )}
    </div>
  );
};

export default MoodCard;
