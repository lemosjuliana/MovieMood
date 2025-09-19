type Props = {
  minutes: number;
  setMinutes: (n: number) => void;
  onApply?: () => void;
};

export default function TimeFilter({ minutes, setMinutes, onApply }: Props) {
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="time" className="min-w-40">Time available (min):</label>
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
      <button className="ml-3 px-3 py-1 rounded border" onClick={onApply}>
        Apply
      </button>
    </div>
  );
}
