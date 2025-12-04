import { Link } from 'react-router-dom';
import {
  Database,
  TrendingUp,
  Brain,
  Shield,
  ArrowRight,
  RefreshCw,
  Activity,
  Zap,
  Eye,
} from 'lucide-react';

export function HowItWorksPage() {
  const steps = [
    {
      icon: Database,
      title: 'Membaca Data dari Kalshi',
      description:
        'Kalshi Pulse secara berkala mengambil data market dari platform Kalshi. Data yang diambil meliputi probabilitas YES/NO, volume transaksi, pergerakan harga, dan informasi event.',
      color: 'neon-blue',
    },
    {
      icon: TrendingUp,
      title: 'Mengamati Pergerakan',
      description:
        'Data disimpan secara historis sehingga memungkinkan analisis trend. Sistem mengamati perubahan probabilitas, volatilitas, dan momentum market dari waktu ke waktu.',
      color: 'neon-green',
    },
    {
      icon: Brain,
      title: 'Analisis AI',
      description:
        'Model AI menganalisis data market, trend historis, dan faktor kontekstual untuk menghasilkan estimasi probabilitas independen. AI juga memberikan insight tentang faktor pendukung dan hambatan.',
      color: 'neon-purple',
    },
    {
      icon: Shield,
      title: 'Status Risiko',
      description:
        'Berdasarkan perbandingan antara probabilitas market dan estimasi AI, sistem memberikan status: Opportunity (peluang terbuka), Balanced (seimbang), atau Risk Zone (berisiko tinggi).',
      color: 'status-balanced',
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Bagaimana <span className="text-gradient">Kalshi Pulse</span> Bekerja
          </h1>
          <p className="text-xl text-foreground-muted max-w-2xl mx-auto">
            Layer analitik cerdas yang membaca data prediction market dan memberikan insight berbasis AI.
          </p>
        </div>

        {/* Process Steps */}
        <div className="max-w-4xl mx-auto mb-20">
          <div className="relative">
            {/* Connection Line */}
            <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-neon-blue via-neon-purple to-status-balanced hidden md:block" />

            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative mb-12 last:mb-0">
                  <div className="flex items-start gap-6">
                    {/* Icon */}
                    <div
                      className={`relative z-10 w-16 h-16 rounded-2xl bg-${step.color}/10 flex items-center justify-center shrink-0`}
                    >
                      <Icon className={`w-8 h-8 text-${step.color}`} />
                    </div>

                    {/* Content */}
                    <div className="data-card flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-sm font-medium text-foreground-dim">
                          Langkah {index + 1}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                      <p className="text-foreground-muted">{step.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Key Features */}
        <div className="bg-background-secondary rounded-2xl p-8 md:p-12 mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            Fitur <span className="text-gradient">Utama</span>
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-neon-green/10 flex items-center justify-center">
                <RefreshCw className="w-7 h-7 text-neon-green" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Update Otomatis</h3>
              <p className="text-foreground-muted text-sm">
                Data di-update setiap 10 menit secara otomatis untuk memastikan informasi selalu terkini.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-neon-purple/10 flex items-center justify-center">
                <Eye className="w-7 h-7 text-neon-purple" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Historical Tracking</h3>
              <p className="text-foreground-muted text-sm">
                Setiap pergerakan probabilitas disimpan untuk analisis trend jangka panjang.
              </p>
            </div>

            <div className="text-center">
              <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-status-balanced/10 flex items-center justify-center">
                <Zap className="w-7 h-7 text-status-balanced" />
              </div>
              <h3 className="text-lg font-semibold mb-2">AI Insights</h3>
              <p className="text-foreground-muted text-sm">
                AI memberikan analisis mendalam tentang faktor-faktor yang mempengaruhi probabilitas.
              </p>
            </div>
          </div>
        </div>

        {/* Status Explanation */}
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
            Memahami <span className="text-gradient">Status</span>
          </h2>

          <div className="space-y-6">
            {/* Opportunity */}
            <div className="data-card border-status-opportunity/30 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-status-opportunity/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6 text-status-opportunity" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-status-opportunity mb-2">Opportunity</h3>
                <p className="text-foreground-muted">
                  Market dan data bergerak ke arah yang sama. AI mendeteksi bahwa probabilitas yang diberikan market mungkin undervalued berdasarkan analisis data. Ini menandakan potensi peluang yang bisa dipertimbangkan.
                </p>
              </div>
            </div>

            {/* Balanced */}
            <div className="data-card border-status-balanced/30 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-status-balanced/10 flex items-center justify-center shrink-0">
                <Activity className="w-6 h-6 text-status-balanced" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-status-balanced mb-2">Balanced</h3>
                <p className="text-foreground-muted">
                  Kedua sisi masih seimbang. Probabilitas AI dan market relatif sama. Ini menandakan bahwa market sudah mencerminkan informasi yang tersedia dengan baik. Informasi baru bisa mengubah arah.
                </p>
              </div>
            </div>

            {/* Risk Zone */}
            <div className="data-card border-status-risk/30 flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-status-risk/10 flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-status-risk" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-status-risk mb-2">Risk Zone</h3>
                <p className="text-foreground-muted">
                  Probabilitas tidak berpihak pada satu sisi dengan jelas, atau terdapat volatilitas tinggi. AI mendeteksi ketidakpastian yang signifikan. Langkah di sini penuh risiko dan memerlukan pertimbangan ekstra.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="max-w-3xl mx-auto text-center mb-16 p-8 bg-background-tertiary/50 rounded-2xl border border-border">
          <h3 className="text-lg font-semibold mb-4">Disclaimer</h3>
          <p className="text-foreground-muted text-sm">
            Kalshi Pulse adalah layer analitik independen dan <strong>bukan</strong> nasihat keuangan. 
            Semua prediksi dan insight yang diberikan hanya berdasarkan analisis data yang tersedia 
            dan tidak menjamin hasil tertentu. Pengguna bertanggung jawab penuh atas keputusan 
            yang diambil berdasarkan informasi dari platform ini.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link to="/dashboard" className="btn-primary inline-flex items-center gap-2">
            Mulai Mengamati
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
