import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";


const moodData = [
  { date: "Mon", mood: 3 },
  { date: "Tue", mood: 4 },
  { date: "Wed", mood: 2 },
  { date: "Thu", mood: 5 },
  { date: "Fri", mood: 3 },
];

export default function MoodTracker() {
  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">Mood Trend</h2>
      <LineChart width={300} height={200} data={moodData}>
        <CartesianGrid stroke="#ccc" />
        <XAxis dataKey="date" />
        <YAxis domain={[1, 5]} />
        <Tooltip />
        <Line type="monotone" dataKey="mood" stroke="#8884d8" />
      </LineChart>
    </div>
  );
}
