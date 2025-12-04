import { Link } from 'react-router-dom';
import { Clock, TrendingUp, TrendingDown, Volume2, ArrowRight } from 'lucide-react';
import { StatusBadge } from './StatusBadge';
import type { Event } from '../lib/supabase';

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const formatDeadline = (deadline: string | null) => {
    if (!deadline) return 'Tidak ditentukan';
    const date = new Date(deadline);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const yesProb = event.market_data?.yes_probability ?? 50;
  const aiYesProb = event.ai_prediction?.ai_yes_probability ?? yesProb;
  const change24h = event.market_data?.change_24h ?? 0;

  return (
    <Link
      to={`/event/${event.id}`}
      className="data-card group block hover:scale-[1.01] transform transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="flex-1 min-w-0">
            <span className="text-xs text-foreground-dim uppercase tracking-wider">
              {event.category}
            </span>
            <h3 className="text-lg font-semibold text-foreground mt-1 line-clamp-2 group-hover:text-neon-green transition-colors">
              {event.title}
            </h3>
          </div>
          {event.ai_prediction && (
            <StatusBadge status={event.ai_prediction.status} size="sm" />
          )}
        </div>

        {/* Probabilities */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Market Yes */}
          <div className="bg-background-tertiary/50 rounded-lg p-3">
            <div className="text-xs text-foreground-dim mb-1">Market Yes</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neon-green">
                {yesProb.toFixed(0)}%
              </span>
              {change24h !== 0 && (
                <span
                  className={`text-xs flex items-center gap-0.5 ${
                    change24h > 0 ? 'text-status-opportunity' : 'text-status-risk'
                  }`}
                >
                  {change24h > 0 ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {Math.abs(change24h).toFixed(1)}%
                </span>
              )}
            </div>
          </div>

          {/* AI Yes */}
          <div className="bg-background-tertiary/50 rounded-lg p-3">
            <div className="text-xs text-foreground-dim mb-1">AI Pulse</div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neon-purple">
                {aiYesProb.toFixed(0)}%
              </span>
              {event.ai_prediction && (
                <span className="text-xs text-foreground-dim">
                  {event.ai_prediction.ai_winner}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-4 text-xs text-foreground-dim">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {formatDeadline(event.deadline)}
            </span>
            {event.market_data?.volume && (
              <span className="flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" />
                {formatNumber(event.market_data.volume)}
              </span>
            )}
          </div>
          <span className="text-neon-green text-sm flex items-center gap-1 group-hover:gap-2 transition-all">
            Detail <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}
