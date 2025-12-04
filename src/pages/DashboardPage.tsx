import { useState, useEffect } from 'react';
import { RefreshCw, Filter, TrendingUp, BarChart2, AlertCircle } from 'lucide-react';
import { EventCard } from '../components/EventCard';
import { StatusBadge } from '../components/StatusBadge';
import { fetchEvents, type Event } from '../lib/supabase';

export function DashboardPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const loadEvents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchEvents({
        category: selectedCategory !== 'all' ? selectedCategory : undefined,
        status: selectedStatus !== 'all' ? selectedStatus : undefined,
      });
      
      if (response.success) {
        setEvents(response.data.events);
        setCategories(response.data.categories);
      } else {
        setError('Gagal memuat data events');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, [selectedCategory, selectedStatus]);

  // Stats
  const totalEvents = events.length;
  const opportunityCount = events.filter(e => e.ai_prediction?.status === 'Opportunity').length;
  const riskCount = events.filter(e => e.ai_prediction?.status === 'Risk Zone').length;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            <span className="text-gradient">Dashboard</span> Events
          </h1>
          <p className="text-foreground-muted">
            Angka bergerak. Probabilitas berubah. Anda mengamati.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="data-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-neon-blue/10 flex items-center justify-center">
              <BarChart2 className="w-6 h-6 text-neon-blue" />
            </div>
            <div>
              <div className="text-2xl font-bold">{totalEvents}</div>
              <div className="text-sm text-foreground-dim">Total Events</div>
            </div>
          </div>
          
          <div className="data-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-status-opportunity/10 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-status-opportunity" />
            </div>
            <div>
              <div className="text-2xl font-bold text-status-opportunity">{opportunityCount}</div>
              <div className="text-sm text-foreground-dim">Opportunity</div>
            </div>
          </div>
          
          <div className="data-card flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-status-risk/10 flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-status-risk" />
            </div>
            <div>
              <div className="text-2xl font-bold text-status-risk">{riskCount}</div>
              <div className="text-sm text-foreground-dim">Risk Zone</div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-foreground-dim" />
            <span className="text-sm text-foreground-dim">Filter:</span>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-background-secondary border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-neon-green/50"
          >
            <option value="all">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-background-secondary border border-border rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-neon-green/50"
          >
            <option value="all">Semua Status</option>
            <option value="Opportunity">Opportunity</option>
            <option value="Balanced">Balanced</option>
            <option value="Risk Zone">Risk Zone</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={loadEvents}
            disabled={loading}
            className="ml-auto flex items-center gap-2 px-4 py-2 bg-background-tertiary border border-border rounded-lg text-sm text-foreground-muted hover:text-foreground hover:border-neon-green/30 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-4 mb-6 text-sm">
          <span className="text-foreground-dim">Status:</span>
          <StatusBadge status="Opportunity" size="sm" />
          <StatusBadge status="Balanced" size="sm" />
          <StatusBadge status="Risk Zone" size="sm" />
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="data-card animate-pulse">
                <div className="h-6 bg-background-tertiary rounded w-1/3 mb-4" />
                <div className="h-8 bg-background-tertiary rounded w-3/4 mb-4" />
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="h-20 bg-background-tertiary rounded" />
                  <div className="h-20 bg-background-tertiary rounded" />
                </div>
                <div className="h-4 bg-background-tertiary rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-status-risk mx-auto mb-4" />
            <p className="text-foreground-muted">{error}</p>
            <button
              onClick={loadEvents}
              className="mt-4 btn-secondary text-sm"
            >
              Coba Lagi
            </button>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12">
            <BarChart2 className="w-12 h-12 text-foreground-dim mx-auto mb-4" />
            <p className="text-foreground-muted">Tidak ada event yang ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
