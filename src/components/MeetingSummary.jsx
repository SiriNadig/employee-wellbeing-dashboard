import { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { format, isToday, isYesterday, isThisWeek } from 'date-fns';

const MeetingSummary = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const checkGoogleConnection = () => {
      const accessToken = localStorage.getItem('google_access_token');
      setConnected(!!accessToken);
    };

    checkGoogleConnection();
  }, []);

  useEffect(() => {
    if (!connected) {
      setLoading(false);
      return;
    }

    const fetchMeetings = async () => {
      try {
        const accessToken = localStorage.getItem('google_access_token');
        if (!accessToken) return;

        const now = new Date();
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);

        const url = `https://www.googleapis.com/calendar/v3/calendars/primary/events?timeMin=${weekAgo.toISOString()}&timeMax=${now.toISOString()}&singleEvents=true&orderBy=startTime`;

        const response = await fetch(url, {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch meetings');
        }

        const data = await response.json();
        setMeetings(data.items || []);
      } catch (error) {
        console.error('Error fetching meetings:', error);
        // Clear invalid token
        localStorage.removeItem('google_access_token');
        setConnected(false);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, [connected]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!connected) {
    return (
      <div className="text-center py-8">
        <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Connect Google Calendar
        </h3>
        <p className="text-gray-600 mb-4">
          Connect your Google Calendar to analyze meeting patterns and detect overload.
        </p>
        <button
          onClick={() => window.location.href = '/meetings'}
          className="btn-primary"
        >
          Connect Calendar
        </button>
      </div>
    );
  }

  if (meetings.length === 0) {
    return (
      <div className="text-center py-8">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Meetings Found
        </h3>
        <p className="text-gray-600">
          Great! No meetings scheduled for the past week.
        </p>
      </div>
    );
  }

  // Calculate meeting statistics
  const meetingDays = {};
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 7);

  meetings.forEach(meeting => {
    const startTime = new Date(meeting.start.dateTime || meeting.start.date);
    const date = format(startTime, 'yyyy-MM-dd');
    
    if (!meetingDays[date]) {
      meetingDays[date] = [];
    }
    meetingDays[date].push(meeting);
  });

  const overloadDays = Object.entries(meetingDays)
    .filter(([date, dayMeetings]) => dayMeetings.length > 4)
    .map(([date, dayMeetings]) => ({
      date,
      count: dayMeetings.length,
      meetings: dayMeetings
    }));

  const totalMeetings = meetings.length;
  const avgMeetingsPerDay = totalMeetings / 7;

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">{totalMeetings}</p>
          <p className="text-sm text-gray-600">Total Meetings</p>
        </div>
        <div className="text-center p-3 bg-purple-50 rounded-lg">
          <p className="text-2xl font-bold text-purple-600">
            {Math.round(avgMeetingsPerDay * 10) / 10}
          </p>
          <p className="text-sm text-gray-600">Avg/Day</p>
        </div>
      </div>

      {/* Overload Warning */}
      {overloadDays.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center mb-2">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h4 className="font-medium text-red-800">Meeting Overload Detected</h4>
          </div>
          <p className="text-sm text-red-700 mb-3">
            You had {overloadDays.length} day{overloadDays.length > 1 ? 's' : ''} with more than 4 meetings:
          </p>
          <div className="space-y-2">
            {overloadDays.map(({ date, count }) => (
              <div key={date} className="flex justify-between items-center text-sm">
                <span className="text-red-700">
                  {format(new Date(date), 'MMM dd, yyyy')}
                </span>
                <span className="font-medium text-red-800">{count} meetings</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Meetings */}
      <div>
        <h4 className="font-medium text-gray-900 mb-3">Recent Meetings</h4>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {meetings.slice(0, 5).map((meeting) => {
            const startTime = new Date(meeting.start.dateTime || meeting.start.date);
            const endTime = new Date(meeting.end.dateTime || meeting.end.date);
            const duration = Math.round((endTime - startTime) / (1000 * 60)); // minutes
            
            return (
              <div key={meeting.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {meeting.summary || 'No title'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(startTime, 'MMM dd, h:mm a')} • {duration}min
                  </p>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Clock className="h-3 w-3 mr-1" />
                  {isToday(startTime) ? 'Today' : 
                   isYesterday(startTime) ? 'Yesterday' : 
                   isThisWeek(startTime) ? format(startTime, 'EEE') : 
                   format(startTime, 'MMM dd')}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MeetingSummary;