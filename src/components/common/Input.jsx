import "./Input.css";

export default function Input({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  options,
  disabled = false   // <-- add this
}) {
  // Generate a unique id based on name if provided
  const inputId = name ? `input-${name}` : undefined;

  return (
    <div className="input-group">
      {label && <label htmlFor={inputId}>{label}</label>}

      {type === "select" ? (
        <select
          id={inputId}
          name={name}
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
          id={inputId}
          name={name}
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
