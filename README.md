# Employee Well-Being Dashboard

A comprehensive web application for tracking and analyzing employee well-being, productivity, and meeting patterns in remote teams. Built with React, Supabase, and Google Calendar integration.

## 🌟 Features

### Core Functionality
- **Mood Tracking**: Daily mood logging with notes and trend analysis
- **Productivity Monitoring**: Productivity scoring and performance insights
- **Meeting Analysis**: Google Calendar integration for meeting overload detection
- **Wellness Tips**: Personalized wellness recommendations
- **Comprehensive Reports**: Analytics and insights across all metrics

### Technical Features
- **Real-time Data**: Live updates with Supabase real-time subscriptions
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Modern UI**: Smooth animations with Framer Motion
- **Secure Authentication**: Google OAuth integration
- **Data Visualization**: Interactive charts with Recharts

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Google Cloud Console account (for Calendar API)

### 1. Clone and Install
```bash
git clone <repository-url>
cd employee-wellbeing-dashboard
npm install
```

### 2. Environment Setup
Copy the environment example file:
```bash
cp env.example .env
```

Fill in your environment variables:
```env
# Supabase Configuration
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Google Calendar API Configuration
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_GOOGLE_CLIENT_SECRET=your-google-client-secret
VITE_GOOGLE_REDIRECT_URI=http://localhost:5173/meetings
```

### 3. Supabase Setup

#### Create Database Tables
Run these SQL commands in your Supabase SQL editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- moods table
CREATE TABLE moods (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- productivity table
CREATE TABLE productivity (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
  note TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- meetings table
CREATE TABLE meetings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users NOT NULL,
  event_id TEXT NOT NULL,
  summary TEXT,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);
```

#### Enable Row Level Security
```sql
-- Enable RLS
ALTER TABLE moods ENABLE ROW LEVEL SECURITY;
ALTER TABLE productivity ENABLE ROW LEVEL SECURITY;
ALTER TABLE meetings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert/select their own moods"
  ON moods FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert/select their own productivity"
  ON productivity FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert/select their own meetings"
  ON meetings FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

#### Configure Authentication
1. Go to Supabase Dashboard > Authentication > Settings
2. Enable Google provider
3. Add your Google OAuth credentials

### 4. Google Calendar API Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `http://localhost:5173/meetings` (development)
   - `https://your-domain.com/meetings` (production)

### 5. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see your application.

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx      # Application header
│   ├── Sidebar.jsx     # Navigation sidebar
│   ├── Layout.jsx      # Main layout wrapper
│   ├── MoodInput.jsx   # Mood tracking form
│   ├── MoodChart.jsx   # Mood visualization
│   ├── ProductivityInput.jsx
│   ├── ProductivityChart.jsx
│   ├── MeetingSummary.jsx
│   ├── GoogleCalendarConnect.jsx
│   ├── WellnessTips.jsx
│   └── LoadingSpinner.jsx
├── pages/              # Page components
│   ├── Login.jsx       # Authentication page
│   ├── Dashboard.jsx   # Main dashboard
│   ├── Mood.jsx        # Mood tracking page
│   ├── Meetings.jsx    # Meeting analysis
│   ├── Productivity.jsx
│   └── Reports.jsx     # Analytics and reports
├── context/            # React context providers
│   └── AuthContext.jsx # Authentication state
├── lib/                # Utility libraries
│   └── supabaseClient.js # Supabase configuration
└── styles/             # CSS and styling
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The app can be deployed to any static hosting service:
- Netlify
- Railway
- Render
- AWS S3 + CloudFront

## 🔧 Configuration

### Customization
- **Colors**: Modify Tailwind config in `tailwind.config.cjs`
- **Charts**: Customize chart styles in chart components
- **Features**: Add new tracking metrics in database and components

### Environment Variables
| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Supabase project URL | Yes |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous key | Yes |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth client ID | Yes |
| `VITE_GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Yes |
| `VITE_GOOGLE_REDIRECT_URI` | OAuth redirect URI | Yes |

## 📊 Data Flow

1. **Authentication**: Google OAuth → Supabase Auth
2. **Mood Tracking**: User input → Supabase moods table
3. **Productivity**: User input → Supabase productivity table
4. **Meetings**: Google Calendar API → Analysis → Display
5. **Reports**: Aggregate data → Charts and insights

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- User data isolation
- Secure OAuth flow
- Environment variable protection
- Input validation and sanitization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments

## 🔮 Future Enhancements

- [ ] Slack integration for sentiment analysis
- [ ] Team analytics and comparisons
- [ ] Advanced reporting and exports
- [ ] Mobile app version
- [ ] AI-powered insights and recommendations
- [ ] Integration with other productivity tools

---

**Built with ❤️ for better remote work experiences**
