# 🚀 Kalshi Pulse - Deployment Guide

Panduan lengkap untuk deploy Kalshi Pulse ke production environment.

## 📋 Prerequisites

- Node.js 18+
- npm/yarn/pnpm
- Git
- Supabase account & project
- (Optional) MiniMax API key untuk AI features

## 🔧 Backend Setup (Supabase)

### 1. Create Supabase Project

```bash
# Install Supabase CLI
npm install -g @supabase/cli

# Login to Supabase
supabase login

# Create new project or use existing one
supabase projects create kalshi-pulse
```

### 2. Database Setup

```bash
# Link your local project to Supabase
supabase link --project-ref your-project-ref

# Apply database migrations
supabase db push

# Or manually run SQL files:
# 1. supabase/tables/events.sql
# 2. supabase/tables/event_market_snapshot.sql  
# 3. supabase/tables/event_ai_prediction.sql
# 4. supabase/migrations/1764871884_setup_rls_and_indexes.sql
```

### 3. Deploy Edge Functions

```bash
# Deploy all edge functions
supabase functions deploy kalshi-data-fetcher
supabase functions deploy ai-prediction  
supabase functions deploy get-events
supabase functions deploy get-event-detail

# Set environment variables for functions
supabase secrets set MINIMAX_API_KEY=your_minimax_key
```

### 4. Setup Cron Jobs

```bash
# Enable PostgreSQL extension for cron
psql -h your-db-host -U postgres -c "CREATE EXTENSION IF NOT EXISTS pg_cron;"

# Create scheduled jobs for data updates (every 10 minutes)
# Job 1: Fetch data from Kalshi API
psql -h your-db-host -U postgres -c "
SELECT cron.schedule(
  'kalshi-data-fetch',
  '*/10 * * * *',
  'SELECT net.http_post(
    url := ''https://your-project-ref.supabase.co/functions/v1/kalshi-data-fetcher'',
    headers := jsonb_build_object(''Authorization'', ''Bearer '' || current_setting(''app.service_role_key''))
  );'
);"

# Job 2: Generate AI predictions (every 30 minutes for changed events)
psql -h your-db-host -U postgres -c "
SELECT cron.schedule(
  'ai-predictions',
  '*/30 * * * *', 
  'SELECT net.http_post(
    url := ''https://your-project-ref.supabase.co/functions/v1/ai-prediction'',
    headers := jsonb_build_object(''Authorization'', ''Bearer '' || current_setting(''app.service_role_key''))
  );'
);"
```

## 🌐 Frontend Deployment

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set environment variables in Vercel dashboard:
# VITE_SUPABASE_URL
# VITE_SUPABASE_ANON_KEY
```

### Option 2: Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build project
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Set environment variables in Netlify dashboard
```

### Option 3: Traditional VPS/Server

```bash
# Build for production
npm run build

# Upload dist/ folder to your server
# Configure nginx/apache to serve static files
# Set up reverse proxy for API calls if needed
```

## 🔐 Environment Variables

### Required Variables

```bash
# .env.production
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key
MINIMAX_API_KEY=your_minimax_key  # Optional
```

### Supabase Edge Function Environment

```bash
# Set via Supabase dashboard or CLI
supabase secrets set MINIMAX_API_KEY=your_key
supabase secrets set KALSHI_API_KEY=public_key_if_needed
```

## 📊 Monitoring & Maintenance

### Health Checks

```bash
# Check if edge functions are responding
curl -X POST https://your-project-ref.supabase.co/functions/v1/get-events \
  -H "Authorization: Bearer YOUR_ANON_KEY"

# Check database connectivity
# (This will be handled by Supabase automatically)
```

### Log Monitoring

```bash
# View edge function logs
supabase functions logs kalshi-data-fetcher
supabase functions logs ai-prediction

# View database logs (via Supabase dashboard)
```

### Backup Strategy

```bash
# Database backup (automatic with Supabase Pro)
# Manual export via Supabase dashboard
# Consider setting up automated backups for critical data
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Edge Function Not Responding
```bash
# Check function logs
supabase functions logs function-name

# Redeploy if needed
supabase functions deploy function-name --no-verify-jwt
```

#### 2. Database Connection Issues
- Verify Supabase URL and keys
- Check RLS policies are correctly configured
- Ensure table schemas match expected structure

#### 3. CORS Issues
- Verify allowed origins in Edge Functions
- Check CORS headers are properly set
- Ensure frontend domain is whitelisted

#### 4. AI Prediction Not Working
- Verify MiniMax API key is set
- Check API quota/rate limits
- Review AI prompt template for formatting issues

### Performance Optimization

#### Frontend
- Enable gzip compression
- Use CDN for static assets
- Implement proper caching headers
- Optimize bundle size with code splitting

#### Backend
- Monitor Supabase usage quotas
- Optimize database queries
- Use connection pooling
- Implement proper indexing

## 🔒 Security Checklist

- [ ] RLS policies enabled and tested
- [ ] Environment variables secured
- [ ] API rate limiting configured
- [ ] CORS properly configured
- [ ] HTTPS enforced
- [ ] Supabase service role key kept secure
- [ ] Regular security updates

## 📈 Scaling Considerations

### Database Scaling
- Monitor connection limits
- Consider read replicas for heavy read operations
- Optimize queries with proper indexing
- Use connection pooling

### Function Scaling
- Monitor edge function execution time
- Consider function optimization for heavy workloads
- Implement proper error handling and retries
- Monitor Supabase function limits

### Traffic Scaling
- Use CDN for global distribution
- Implement proper caching strategies
- Consider load balancing for high traffic
- Monitor and set up alerts

## 🆘 Support & Maintenance

### Regular Tasks
- Monitor Supabase dashboard for usage
- Check function execution logs weekly
- Update dependencies monthly
- Review and optimize slow queries
- Backup verification

### Emergency Procedures
- Have rollback plan ready
- Know how to disable problematic functions
- Keep contact information for Supabase support
- Document all custom configurations

---

**Need Help?** 
- Check the main [README.md](./README.md) for general setup
- Review [Supabase Documentation](https://supabase.com/docs)
- Monitor [GitHub Issues](https://github.com/superbixnggas/KALSHPULSE/issues)

*Last updated: December 2024*