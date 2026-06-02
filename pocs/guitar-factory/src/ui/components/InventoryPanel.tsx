import { Boxes, ReceiptText, Waves } from "lucide-react";
import type { ReactNode } from "react";
import { GuitarSnapshot } from "../../domain/GuitarTypes";
import { ToneProfile } from "../../domain/strategies/PickupStrategy";

type Props = {
  inventory: GuitarSnapshot[];
  selectedSerial: string | null;
  tone: ToneProfile;
  price: string;
  eventLog: string[];
  onSelect: (guitar: GuitarSnapshot) => void;
};

export function InventoryPanel({
  inventory,
  selectedSerial,
  tone,
  price,
  eventLog,
  onSelect,
}: Props) {
  return (
    <aside className="inventory-panel">
      <section className="metric-strip">
        <Metric icon={<ReceiptText size={17} />} label="Quote" value={price} />
        <Metric
          icon={<Boxes size={17} />}
          label="Inventory"
          value={String(inventory.length)}
        />
        <Metric
          icon={<Waves size={17} />}
          label="Tone"
          value={tone.description}
        />
      </section>

      <section className="tone-grid">
        <ToneBar label="Brightness" value={tone.brightness} />
        <ToneBar label="Warmth" value={tone.warmth} />
        <ToneBar label="Output" value={tone.output} />
      </section>

      <section className="inventory-list">
        <h2>Custom inventory</h2>
        {inventory.length === 0 ? (
          <p className="empty-state">No guitars built yet.</p>
        ) : (
          inventory.map((guitar) => (
            <button
              key={guitar.serial}
              className={
                guitar.serial === selectedSerial
                  ? "inventory-card selected"
                  : "inventory-card"
              }
              onClick={() => onSelect(guitar)}
              type="button"
            >
              <strong>{guitar.model}</strong>
              <span>{guitar.serial}</span>
              <small>
                {guitar.family} · {guitar.finish} · {guitar.price}
              </small>
            </button>
          ))
        )}
      </section>

      <section className="event-log">
        <h2>Production events</h2>
        {eventLog.map((event) => (
          <p key={event}>{event}</p>
        ))}
      </section>
    </aside>
  );
}

function Metric({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="metric">
      {icon}
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ToneBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="tone-bar">
      <span>{label}</span>
      <div>
        <i style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
