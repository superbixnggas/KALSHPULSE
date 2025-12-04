import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Clock,
  Volume2,
  TrendingUp,
  TrendingDown,
  Brain,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
} from 'lucide-react';
import { StatusBadge } from '../components/StatusBadge';
import { ProbabilityChart } from '../components/ProbabilityChart';
import { fetchEventDetail, triggerAIPrediction, type EventDetail } from '../lib/supabase';

export function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatingPrediction, setGeneratingPrediction] = useState(false);

  const loadEventDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetchEventDetail(parseInt(id));
      if (response.success) {
        setData(response.data);
      } else {
        setError('Gagal memuat detail event');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat memuat data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePrediction = async () => {
    if (!id) return;
    setGeneratingPrediction(true);
    try {
      await triggerAIPrediction(parseInt(id));
      await loadEventDetail();
    } catch (err) {
      console.error(err);
    } finally {
      setGeneratingPrediction(false);
    }
  };

  useEffect(() => {
    loadEventDetail();
  }, [id]);

  const formatDate = (date: string | null) => {
    if (!date) return 'Tidak ditentukan';
    return new Date(date).toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="animate-pulse">
            <div className="h-8 bg-background-tertiary rounded w-1/4 mb-4" />
            <div className="h-12 bg-background-tertiary rounded w-3/4 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="h-48 bg-background-tertiary rounded" />
              <div className="h-48 bg-background-tertiary rounded" />
            </div>
            <div className="h-96 bg-background-tertiary rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-status-risk mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-2">Terjadi Kesalahan</h2>
          <p className="text-foreground-muted mb-4">{error || 'Event tidak ditemukan'}</p>
          <Link to="/dashboard" className="btn-secondary">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const { event, market_data, ai_prediction, chart_data } = data;
  const change24h = market_data?.change_24h ?? 0;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-foreground-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Kembali ke Dashboard
        </Link>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
            <div>
              <span className="text-sm text-foreground-dim uppercase tracking-wider">
                {event.category}
              </span>
              <h1 className="text-2xl md:text-3xl font-bold mt-1">{event.title}</h1>
            </div>
            {ai_prediction && <StatusBadge status={ai_prediction.status} size="lg" />}
          </div>
          <div className="flex flex-wrap items-center gap-4 text-sm text-foreground-dim">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Deadline: {formatDate(event.deadline)}
            </span>
            {market_data && (
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-4 h-4" />
                Volume: {formatNumber(market_data.volume)}
              </span>
            )}
          </div>
        </div>

        {/* Data Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Market Data Card */}
          <div className="data-card">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-neon-green" />
              Data Market
            </h2>
            {market_data ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  {/* Market Yes */}
                  <div className="bg-background-tertiary rounded-lg p-4">
                    <div className="text-sm text-foreground-dim mb-2">Market Yes</div>
                    <div className="text-4xl font-bold text-neon-green">
                      {market_data.yes_probability.toFixed(1)}%
                    </div>
                  </div>
                  {/* Market No */}
                  <div className="bg-background-tertiary rounded-lg p-4">
                    <div className="text-sm text-foreground-dim mb-2">Market No</div>
                    <div className="text-4xl font-bold text-status-risk">
                      {market_data.no_probability.toFixed(1)}%
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Volume */}
                  <div className="bg-background-tertiary rounded-lg p-4">
                    <div className="text-sm text-foreground-dim mb-2">Volume</div>
                    <div className="text-2xl font-semibold">{formatNumber(market_data.volume)}</div>
                  </div>
                  {/* 24h Change */}
                  <div className="bg-background-tertiary rounded-lg p-4">
                    <div className="text-sm text-foreground-dim mb-2">Perubahan 24 Jam</div>
                    <div className={`text-2xl font-semibold flex items-center gap-2 ${
                      change24h > 0 ? 'text-status-opportunity' : change24h < 0 ? 'text-status-risk' : ''
                    }`}>
                      {change24h > 0 ? <TrendingUp className="w-5 h-5" /> : change24h < 0 ? <TrendingDown className="w-5 h-5" /> : null}
                      {change24h > 0 ? '+' : ''}{change24h.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-foreground-muted">Tidak ada data market tersedia</p>
            )}
          </div>

          {/* AI Prediction Card */}
          <div className="data-card border-neon-purple/30">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Brain className="w-5 h-5 text-neon-purple" />
                AI Kalshi Pulse
              </h2>
              <button
                onClick={handleGeneratePrediction}
                disabled={generatingPrediction}
                className="flex items-center gap-2 px-3 py-1.5 bg-neon-purple/10 text-neon-purple rounded-lg text-sm hover:bg-neon-purple/20 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${generatingPrediction ? 'animate-spin' : ''}`} />
                {generatingPrediction ? 'Generating...' : 'Refresh AI'}
              </button>
            </div>

            {ai_prediction ? (
              <div className="space-y-6">
                {/* Prediction & Probability */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background-tertiary rounded-lg p-4">
                    <div className="text-sm text-foreground-dim mb-2">Prediksi AI</div>
                    <div className={`text-3xl font-bold flex items-center gap-2 ${
                      ai_prediction.ai_winner === 'YES' ? 'text-neon-green' : 'text-status-risk'
                    }`}>
                      {ai_prediction.ai_winner === 'YES' ? <CheckCircle className="w-7 h-7" /> : <XCircle className="w-7 h-7" />}
                      {ai_prediction.ai_winner}
                    </div>
                  </div>
                  <div className="bg-background-tertiary rounded-lg p-4">
                    <div className="text-sm text-foreground-dim mb-2">AI Probability</div>
                    <div className="text-3xl font-bold text-neon-purple">
                      {ai_prediction.ai_yes_probability.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="bg-background-tertiary rounded-lg p-4">
                  <div className="text-sm text-foreground-dim mb-2">Status</div>
                  <StatusBadge status={ai_prediction.status} size="lg" />
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <Brain className="w-12 h-12 text-foreground-dim mx-auto mb-4" />
                <p className="text-foreground-muted mb-4">Belum ada prediksi AI</p>
                <button
                  onClick={handleGeneratePrediction}
                  disabled={generatingPrediction}
                  className="btn-secondary text-sm"
                >
                  Generate Prediksi
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Insight Section */}
        {ai_prediction && (
          <div className="data-card mb-8">
            <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-status-balanced" />
              Insight AI
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Faktor Pendukung */}
              <div className="bg-status-opportunity/5 border border-status-opportunity/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-status-opportunity mb-3">
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">Faktor Pendukung</span>
                </div>
                <p className="text-sm text-foreground-muted">
                  {ai_prediction.insight_faktor_pendukung || 'Data tidak cukup'}
                </p>
              </div>

              {/* Faktor Hambatan */}
              <div className="bg-status-risk/5 border border-status-risk/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-status-risk mb-3">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">Faktor Hambatan</span>
                </div>
                <p className="text-sm text-foreground-muted">
                  {ai_prediction.insight_faktor_hambatan || 'Data tidak cukup'}
                </p>
              </div>

              {/* Risiko */}
              <div className="bg-status-balanced/5 border border-status-balanced/20 rounded-lg p-4">
                <div className="flex items-center gap-2 text-status-balanced mb-3">
                  <ShieldAlert className="w-5 h-5" />
                  <span className="font-medium">Risiko</span>
                </div>
                <p className="text-sm text-foreground-muted">
                  {ai_prediction.insight_risiko || 'Data tidak cukup'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Chart Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Grafik Pergerakan Probabilitas</h2>
          <ProbabilityChart data={chart_data} height={450} />
        </div>

        {/* Closing Text */}
        <div className="text-center py-8 border-t border-border">
          <p className="text-lg text-foreground-muted italic">
            "Sisa keputusan ada di tangan Anda."
          </p>
        </div>
      </div>
    </div>
  );
}
