import { Link, useLocation } from 'react-router-dom';
import { Activity, BarChart3, Info, Home } from 'lucide-react';

export function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/dashboard', label: 'Dashboard', icon: BarChart3 },
    { path: '/how-it-works', label: 'Cara Kerja', icon: Info },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Activity className="w-8 h-8 text-neon-green group-hover:animate-pulse" />
              <div className="absolute inset-0 blur-lg bg-neon-green/30 group-hover:bg-neon-green/50 transition-all" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Kalshi <span className="text-neon-green">Pulse</span>
            </span>
          </Link>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? 'bg-neon-green/10 text-neon-green'
                      : 'text-foreground-muted hover:text-foreground hover:bg-background-tertiary'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Link
              to="/dashboard"
              className="btn-primary text-sm py-2 px-4"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
