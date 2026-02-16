interface PanelTypeBadgeProps {
  type: string;
}

export function PanelTypeBadge({ type }: PanelTypeBadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider"
      style={{
        background: 'rgba(99, 102, 241, 0.15)',
        color: '#818cf8',
        border: '1px solid rgba(99, 102, 241, 0.25)',
      }}
    >
      {type}
    </span>
  );
}
