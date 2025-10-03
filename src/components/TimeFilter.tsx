import "./Layout/FindMoviesPage.css";

type Props = { 
  minutes: number;
  setMinutes: (n: number) => void;
  onApply?: () => void;
};

export default function TimeFilter({ minutes, setMinutes, onApply }: Props) {
  return (
    <div className="time-filter">
      <label htmlFor="time">Time available (min):</label>
      <input
        id="time"
        type="range"
        min={60}
        max={240}
        step={15}
        value={minutes}
        onChange={(e) => setMinutes(parseInt(e.target.value, 10))}
      />
      <span>{minutes} min</span>
      <button onClick={onApply}>Apply</button>
    </div>
  );
}
