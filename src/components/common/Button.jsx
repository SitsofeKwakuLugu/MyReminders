import "./Button.css";

export default function Button({ children, type = "button", variant = "primary", onClick }) {
  const className = `btn ${variant}`;
  return (
    <button type={type} className={className} onClick={onClick}>
      {children}
    </button>
  );
}
