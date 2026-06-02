import {
  Cpu,
  Guitar,
  Hammer,
  Palette,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import type { ReactNode } from "react";
import { GuitarSpec } from "../../domain/GuitarSpec";
import {
  BodyShape,
  Finish,
  GuitarFamily,
  GuitarSpecInput,
  OperatingSystem,
  PickupSet,
  ToneWood,
} from "../../domain/GuitarTypes";

type Props = {
  spec: GuitarSpec;
  onChange: (input: GuitarSpecInput) => void;
  onBuild: () => void;
  onReset: () => void;
};

const electricDefaults = {
  [GuitarFamily.Electric]: {
    bodyShape: BodyShape.Strat,
    pickupSet: PickupSet.SingleCoil,
    strings: 6,
  },
  [GuitarFamily.Acoustic]: {
    bodyShape: BodyShape.Dreadnought,
    pickupSet: PickupSet.Piezo,
    strings: 6,
  },
  [GuitarFamily.Bass]: {
    bodyShape: BodyShape.JazzBass,
    pickupSet: PickupSet.JazzBass,
    strings: 4,
  },
};

const compatibleShapes = {
  [GuitarFamily.Electric]: [BodyShape.Strat, BodyShape.LesPaul, BodyShape.Tele],
  [GuitarFamily.Acoustic]: [BodyShape.Dreadnought],
  [GuitarFamily.Bass]: [BodyShape.JazzBass],
};

const compatiblePickups = {
  [GuitarFamily.Electric]: [
    PickupSet.SingleCoil,
    PickupSet.Humbucker,
    PickupSet.P90,
  ],
  [GuitarFamily.Acoustic]: [PickupSet.Piezo],
  [GuitarFamily.Bass]: [PickupSet.JazzBass, PickupSet.Humbucker],
};

const compatibleStrings = {
  [GuitarFamily.Electric]: [6, 7, 12],
  [GuitarFamily.Acoustic]: [6, 12],
  [GuitarFamily.Bass]: [4, 5],
};

export function ConfigPanel({ spec, onChange, onBuild, onReset }: Props) {
  const input = spec.toInput();

  function patch(changes: Partial<GuitarSpecInput>) {
    onChange({ ...input, ...changes });
  }

  function setFamily(family: GuitarFamily) {
    patch({ family, ...electricDefaults[family], model: `${family} Custom` });
  }

  return (
    <aside className="config-panel">
      <div className="panel-heading">
        <Hammer size={18} />
        <h1>Guitar Factory</h1>
      </div>

      <label>
        Model
        <input
          value={input.model}
          onChange={(event) => patch({ model: event.target.value })}
        />
      </label>

      <ControlGroup icon={<Guitar size={16} />} label="Family">
        <Segmented
          value={input.family}
          options={Object.values(GuitarFamily)}
          onChange={(value) => setFamily(value as GuitarFamily)}
        />
      </ControlGroup>

      <ControlGroup icon={<Sparkles size={16} />} label="Body">
        <select
          value={input.bodyShape}
          onChange={(event) =>
            patch({ bodyShape: event.target.value as BodyShape })
          }
        >
          {compatibleShapes[input.family].map((shape) => (
            <option key={shape}>{shape}</option>
          ))}
        </select>
      </ControlGroup>

      <ControlGroup icon={<Palette size={16} />} label="Finish">
        <select
          value={input.finish}
          onChange={(event) => patch({ finish: event.target.value as Finish })}
        >
          {Object.values(Finish).map((finish) => (
            <option key={finish}>{finish}</option>
          ))}
        </select>
      </ControlGroup>

      <div className="grid-controls">
        <label>
          Wood
          <select
            value={input.toneWood}
            onChange={(event) =>
              patch({ toneWood: event.target.value as ToneWood })
            }
          >
            {Object.values(ToneWood).map((wood) => (
              <option key={wood}>{wood}</option>
            ))}
          </select>
        </label>

        <label>
          Pickups
          <select
            value={input.pickupSet}
            onChange={(event) =>
              patch({ pickupSet: event.target.value as PickupSet })
            }
          >
            {compatiblePickups[input.family].map((pickup) => (
              <option key={pickup}>{pickup}</option>
            ))}
          </select>
        </label>
      </div>

      <ControlGroup icon={<Cpu size={16} />} label="OS">
        <select
          value={input.operatingSystem}
          onChange={(event) =>
            patch({ operatingSystem: event.target.value as OperatingSystem })
          }
        >
          {Object.values(OperatingSystem).map((os) => (
            <option key={os}>{os}</option>
          ))}
        </select>
      </ControlGroup>

      <div className="grid-controls">
        <label>
          Strings
          <select
            value={input.strings}
            onChange={(event) => patch({ strings: Number(event.target.value) })}
          >
            {compatibleStrings[input.family].map((strings) => (
              <option key={strings} value={strings}>
                {strings}
              </option>
            ))}
          </select>
        </label>
        <label className="toggle-row">
          Left handed
          <input
            type="checkbox"
            checked={input.leftHanded}
            onChange={(event) => patch({ leftHanded: event.target.checked })}
          />
        </label>
      </div>

      <div className="action-row">
        <button className="icon-button" title="Reset" onClick={onReset}>
          <RotateCcw size={18} />
        </button>
        <button className="primary-button" onClick={onBuild}>
          Build Guitar
        </button>
      </div>
    </aside>
  );
}

function ControlGroup({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="control-group">
      <div className="control-label">
        {icon}
        <span>{label}</span>
      </div>
      {children}
    </div>
  );
}

function Segmented({
  value,
  options,
  onChange,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="segmented">
      {options.map((option) => (
        <button
          key={option}
          className={option === value ? "selected" : ""}
          onClick={() => onChange(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
