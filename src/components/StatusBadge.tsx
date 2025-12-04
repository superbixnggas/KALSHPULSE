import { TrendingUp, Scale, AlertTriangle } from 'lucide-react';

interface StatusBadgeProps {
  status: 'Opportunity' | 'Balanced' | 'Risk Zone' | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export function StatusBadge({ status, size = 'md', showIcon = true }: StatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case 'Opportunity':
        return {
          icon: TrendingUp,
          className: 'status-opportunity',
          label: 'Opportunity',
        };
      case 'Balanced':
        return {
          icon: Scale,
          className: 'status-balanced',
          label: 'Balanced',
        };
      case 'Risk Zone':
        return {
          icon: AlertTriangle,
          className: 'status-risk',
          label: 'Risk Zone',
        };
      default:
        return {
          icon: Scale,
          className: 'text-foreground-muted bg-background-tertiary border-border',
          label: status || 'Unknown',
        };
    }
  };

  const config = getStatusConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base',
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${config.className} ${sizeClasses[size]}`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      <span>{config.label}</span>
    </span>
  );
}
