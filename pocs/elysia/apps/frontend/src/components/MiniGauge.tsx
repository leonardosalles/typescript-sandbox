interface Props {
  value: number;
  label: string;
  showPercent?: boolean;
}

function getColor(value: number): string {
  if (value > 85) return "#ff3d6b";
  if (value > 65) return "#ffb800";
  return "#00ff9d";
}

export function MiniGauge({ value, label, showPercent = true }: Props) {
  const color = getColor(value);
  return (
    <div className="mini-gauge">
      <div className="mini-gauge-header">
        <span className="mini-gauge-label">{label}</span>
        {showPercent && (
          <span className="mini-gauge-value" style={{ color }}>
            {value.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="mini-gauge-track">
        <div
          className="mini-gauge-fill"
          style={{ width: `${Math.min(value, 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}
