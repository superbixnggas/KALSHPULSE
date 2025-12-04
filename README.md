# Kalshi Pulse - Prediction Market Analytics Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-green)](https://yse17yyy2zam.space.minimax.io)

**Kalshi Pulse** adalah layer analitik canggih yang duduk di atas platform prediction market Kalshi. Sistem ini membaca data event dari Kalshi, menganalisis pergerakan probabilitas, dan menggunakan AI untuk memberikan insight dan prediksi dengan status risiko yang jelas.

## 🌟 Fitur Utama

### 🎯 Analisis Real-Time
- Data market Kalshi real-time dengan probabilitas YES/NO
- Historical data dan trend analysis
- Volume tracking dan 24h price movement

### 🤖 AI-Powered Predictions  
- Integrasi dengan AI MiniMax untuk analisis mendalam
- Prediksi probabilitas berdasarkan data historis dan market trends
- Status risiko: **Opportunity**, **Balanced**, **Risk Zone**

### 📊 Visual Analytics
- Grafik pergerakan probabilitas real-time
- Event dashboard dengan filtering capabilities
- Insight analysis dengan faktor pendukung dan hambatan

### ⚡ Smart Status System
- **Opportunity**: Market dan AI bergerak ke arah yang sama
- **Balanced**: Kedua sisi masih seimbang
- **Risk Zone**: Probabilitas tidak berpihak pada satu sisi

## 🏗️ Tech Stack

### Frontend
- **React 18** + **TypeScript**
- **Vite** untuk build tooling
- **TailwindCSS** untuk styling
- **ECharts** untuk data visualization
- **Lucide React** untuk icons

### Backend
- **Supabase** (PostgreSQL + Edge Functions)
- **Deno** runtime untuk Edge Functions
- **Cron Jobs** untuk scheduled data updates
- **Real-time subscriptions**

### External APIs
- **Kalshi API** untuk market data
- **MiniMax AI** untuk prediction analysis

## 📁 Project Structure

```
KALSHPULSE/
├── 📁 src/                          # Frontend React application
│   ├── 📁 components/              # React components
│   │   ├── EventCard.tsx          # Event card component
│   │   ├── Navbar.tsx             # Navigation bar
│   │   ├── ProbabilityChart.tsx   # Chart component
│   │   └── StatusBadge.tsx        # Status indicator
│   ├── 📁 pages/                   # Page components
│   │   ├── LandingPage.tsx        # Landing page
│   │   ├── DashboardPage.tsx      # Events dashboard
│   │   ├── EventDetailPage.tsx    # Event detail page
│   │   └── HowItWorksPage.tsx     # How it works explanation
│   ├── 📁 lib/                     # Utilities
│   │   ├── supabase.ts           # Supabase client
│   │   └── utils.ts              # Helper functions
│   └── 📁 hooks/                   # Custom React hooks
├── 📁 supabase/                     # Backend infrastructure
│   ├── 📁 functions/               # Edge Functions
│   │   ├── kalshi-data-fetcher/   # Data fetch scheduler
│   │   ├── ai-prediction/         # AI prediction engine
│   │   ├── get-events/            # Events API endpoint
│   │   └── get-event-detail/      # Event detail API
│   ├── 📁 migrations/              # Database migrations
│   ├── 📁 tables/                  # Table schemas
│   └── 📁 cron_jobs/               # Scheduled tasks
├── 📁 public/                       # Static assets
└── 📄 package.json                  # Dependencies
```

## 🗄️ Database Schema

### Events Table
```sql
CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    source_event_id TEXT UNIQUE,
    title TEXT NOT NULL,
    category TEXT,
    deadline TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true
);
```

### Market Snapshots
```sql
CREATE TABLE event_market_snapshot (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT REFERENCES events(id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    yes_probability DECIMAL(5,2),
    no_probability DECIMAL(5,2),
    volume INTEGER,
    change_24h DECIMAL(5,2),
    raw_data JSONB
);
```

### AI Predictions
```sql
CREATE TABLE event_ai_prediction (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT REFERENCES events(id),
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    market_yes_probability DECIMAL(5,2),
    market_no_probability DECIMAL(5,2),
    ai_yes_probability DECIMAL(5,2),
    ai_winner TEXT CHECK (ai_winner IN ('YES', 'NO')),
    status TEXT CHECK (status IN ('Opportunity', 'Balanced', 'Risk Zone')),
    insight_faktor_pendukung TEXT,
    insight_faktor_hambatan TEXT,
    insight_risiko TEXT
);
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm/yarn/pnpm
- Supabase account
- Kalshi API access

### Installation

1. **Clone repository**
```bash
git clone https://github.com/superbixnggas/KALSHPULSE.git
cd KALSHPULSE
```

2. **Install dependencies**
```bash
npm install
# atau
pnpm install
```

3. **Setup environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local`:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. **Setup Supabase**
```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref your_project_ref

# Apply migrations
supabase db push
```

5. **Deploy Edge Functions**
```bash
# Deploy all functions
supabase functions deploy kalshi-data-fetcher
supabase functions deploy ai-prediction
supabase functions deploy get-events
supabase functions deploy get-event-detail
```

6. **Start development server**
```bash
npm run dev
```

Visit `http://localhost:5173`

## 🔧 Configuration

### Environment Variables

Create `.env.local`:
```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key

# AI Integration (optional)
MINIMAX_API_KEY=your_minimax_key

# Kalshi API (public - no key needed)
KALSHI_API_BASE=https://api.elections.kalshi.com/trade-api/v2
```

### Supabase Setup

1. **Create tables**: Use migration files in `supabase/migrations/`
2. **Configure RLS policies**: Enable Row Level Security
3. **Deploy edge functions**: Use Supabase CLI
4. **Setup cron jobs**: Configure automated data updates

## 🔄 Automated Data Updates

### Scheduler Configuration
- **Frequency**: Every 10 minutes
- **Tasks**:
  - Fetch active events from Kalshi API
  - Update market snapshots
  - Generate AI predictions for significant changes
  - Store historical data for trend analysis

### API Endpoints

- `GET /api/events` - List all events with filters
- `GET /api/events/:id` - Get event details with history
- `GET /api/events/:id/ai-history` - Get AI prediction history

## 🤖 AI Integration

### MiniMax AI Prompt Template
```
Analisa data berikut.
Event: {{event_title}}
Market Yes Probability: {{market_yes}} persen
Market No Probability: {{market_no}} persen
Volume: {{volume}}
Price movement 24h: {{change_24h}} persen
Historical trend: {{historical_pattern}}
Deadline: {{deadline}}

Instruksi:
1. Hitung probabilitas outcome berdasarkan data
2. Tentukan prediksi YES atau NO
3. Tentukan status: Opportunity/Balanced/Risk Zone
4. Berikan insight berbasis data

Format output:
Prediction: YES/NO
AI Probability: {{angka_persen}}
Status: Opportunity/Balanced/Risk Zone
Insight:
• Faktor pendukung
• Faktor hambatan  
• Risiko/variabel penting
```

## 📊 Analytics Features

### Market Analysis
- Real-time probability tracking
- Volume and price movement analysis
- Historical trend visualization

### Risk Assessment
- **Opportunity**: High probability alignment between market and AI
- **Balanced**: Equal probability distribution
- **Risk Zone**: Low confidence in current trends

### Visual Insights
- Interactive probability charts
- Event filtering and sorting
- Mobile-responsive design

## 🛠️ Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### Code Structure

#### Frontend Components
- **LandingPage**: Brand introduction and navigation
- **DashboardPage**: Events list with filtering
- **EventDetailPage**: Detailed event analysis
- **HowItWorksPage**: Platform explanation

#### Backend Functions
- **kalshi-data-fetcher**: Scheduled data collection
- **ai-prediction**: AI analysis and prediction
- **get-events**: REST API for events
- **get-event-detail**: Event details API

## 🚀 Deployment

### Frontend Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

### Backend Deployment
```bash
# Deploy via Supabase CLI
supabase functions deploy --no-verify-jwt

# Or deploy manually via Supabase Dashboard
```

## 📈 Performance

### Optimization Features
- Code splitting and lazy loading
- Efficient API caching
- Real-time subscriptions
- Optimized bundle size
- Mobile-first responsive design

### Monitoring
- Error boundary components
- API error handling
- Loading states for better UX
- Performance monitoring ready

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- [Kalshi](https://kalshi.com) for prediction market data API
- [Supabase](https://supabase.com) for backend infrastructure
- [MiniMax](https://www.minimaxi.com) for AI prediction capabilities
- [React](https://reactjs.org) for frontend framework
- [TailwindCSS](https://tailwindcss.com) for styling

## 📞 Support

- **Live Demo**: https://yse17yyy2zam.space.minimax.io
- **GitHub Issues**: Create an issue for bugs or feature requests
- **Documentation**: This README and inline code comments

---

**Built with ❤️ by the Kalshi Pulse Team**

*Future moves. Pulse reads it.*