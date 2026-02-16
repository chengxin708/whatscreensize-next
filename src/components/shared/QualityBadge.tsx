interface QualityBadgeProps {
  quality: 'best' | 'acceptable' | 'not-ideal';
  label: string;
}

export function QualityBadge({ quality, label }: QualityBadgeProps) {
  const styles: Record<
    QualityBadgeProps['quality'],
    { background: string; color: string; border: string; boxShadow: string }
  > = {
    best: {
      background: 'rgba(99, 102, 241, 0.2)',
      color: '#818cf8',
      border: '1px solid rgba(99, 102, 241, 0.3)',
      boxShadow: 'var(--shadow-glow)',
    },
    acceptable: {
      background: 'rgba(99, 102, 241, 0.08)',
      color: '#a5b4fc',
      border: '1px solid rgba(99, 102, 241, 0.15)',
      boxShadow: 'none',
    },
    'not-ideal': {
      background: 'transparent',
      color: 'var(--text-dim)',
      border: '1px solid var(--glass-border)',
      boxShadow: 'none',
    },
  };

  const style = styles[quality];

  return (
    <span
      className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium"
      style={style}
    >
      {label}
    </span>
  );
}
