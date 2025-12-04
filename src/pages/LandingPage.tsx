import { Link } from 'react-router-dom';
import { Activity, TrendingUp, Brain, Shield, ArrowRight, BarChart2, Zap } from 'lucide-react';

export function LandingPage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 grid-bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        
        {/* Animated Data Lines */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-px h-32 bg-gradient-to-b from-neon-green/50 to-transparent animate-data-flow"
              style={{
                left: `${20 + i * 15}%`,
                animationDelay: `${i * 0.6}s`,
                top: '-128px',
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 text-center relative z-10">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <Activity className="w-20 h-20 text-neon-green animate-pulse-glow" />
              <div className="absolute inset-0 blur-2xl bg-neon-green/30" />
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-foreground">Future moves.</span>
            <br />
            <span className="text-gradient">Pulse reads it.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-foreground-muted max-w-3xl mx-auto mb-12 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            Kalshi Pulse membaca probabilitas dan pergerakan di balik prediction market.
          </p>

          {/* CTA Button */}
          <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2 text-lg">
              Masuk Dashboard
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          {/* Tagline */}
          <p className="text-sm text-foreground-dim mt-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Angka bergerak. Probabilitas berubah. Anda mengamati.
          </p>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-foreground-dim rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-neon-green rounded-full animate-data-flow" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            <span className="text-gradient">Analitik Cerdas</span> untuk Prediction Market
          </h2>
          <p className="text-foreground-muted text-center max-w-2xl mx-auto mb-16">
            Layer analitik yang membaca data, menganalisis trend, dan memberikan insight berbasis AI.
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="data-card text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-neon-green/10 flex items-center justify-center group-hover:bg-neon-green/20 transition-colors">
                <BarChart2 className="w-8 h-8 text-neon-green" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Data Real-Time</h3>
              <p className="text-foreground-muted">
                Membaca dan menyimpan data market dari Kalshi secara berkala untuk analisis historis.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="data-card text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-neon-purple/10 flex items-center justify-center group-hover:bg-neon-purple/20 transition-colors">
                <Brain className="w-8 h-8 text-neon-purple" />
              </div>
              <h3 className="text-xl font-semibold mb-3">AI Prediction</h3>
              <p className="text-foreground-muted">
                Model AI menganalisis trend dan memberikan estimasi probabilitas tambahan.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="data-card text-center group">
              <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-status-balanced/10 flex items-center justify-center group-hover:bg-status-balanced/20 transition-colors">
                <Shield className="w-8 h-8 text-status-balanced" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Status Risiko</h3>
              <p className="text-foreground-muted">
                Indikator status membantu memahami tingkat peluang dan risiko setiap event.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Status Explanation */}
      <section className="py-24 bg-background-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Memahami <span className="text-gradient">Status Risiko</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Opportunity */}
            <div className="glass-card p-6 border-status-opportunity/30">
              <div className="flex items-center gap-3 mb-4">
                <TrendingUp className="w-8 h-8 text-status-opportunity" />
                <h3 className="text-xl font-semibold text-status-opportunity">Opportunity</h3>
              </div>
              <p className="text-foreground-muted text-sm">
                Market dan data bergerak ke arah yang sama. Peluang terbuka.
              </p>
            </div>

            {/* Balanced */}
            <div className="glass-card p-6 border-status-balanced/30">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-status-balanced" />
                <h3 className="text-xl font-semibold text-status-balanced">Balanced</h3>
              </div>
              <p className="text-foreground-muted text-sm">
                Kedua sisi masih seimbang. Informasi baru bisa mengubah arah.
              </p>
            </div>

            {/* Risk Zone */}
            <div className="glass-card p-6 border-status-risk/30">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-status-risk" />
                <h3 className="text-xl font-semibold text-status-risk">Risk Zone</h3>
              </div>
              <p className="text-foreground-muted text-sm">
                Probabilitas tidak berpihak pada satu sisi. Langkah di sini penuh risiko.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Siap Membaca <span className="text-gradient">Pergerakan Market?</span>
          </h2>
          <p className="text-foreground-muted mb-8 max-w-xl mx-auto">
            Dashboard Kalshi Pulse menampilkan semua event aktif dengan data market dan prediksi AI.
          </p>
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
            Buka Dashboard
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-neon-green" />
              <span className="font-semibold">Kalshi Pulse</span>
            </div>
            <p className="text-sm text-foreground-dim">
              Layer analitik untuk prediction market. Bukan nasihat keuangan.
            </p>
            <div className="flex items-center gap-4 text-sm text-foreground-dim">
              <Link to="/how-it-works" className="hover:text-foreground transition-colors">
                Cara Kerja
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
