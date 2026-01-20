import "./Input.css";

export default function Input({
  label,
  type = "text",
  value,
  onChange,
  error,
  options,
  disabled = false   // <-- add this
}) {
  return (
    <div className="input-group">
      {label && <label>{label}</label>}

      {type === "select" ? (
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}   // <-- important
        >
          <option value="">Select {label}</option>
          {options?.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}   // <-- important
        />
      )}

      {error && <span className="error">{error}</span>}
    </div>
  );
}
