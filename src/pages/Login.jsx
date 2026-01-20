import { useNavigate, Link } from "react-router-dom";
import Form from "../components/common/Form";
import { useAuth } from "../hooks/useAuth";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = ({ email, password }) => {
    try {
      login(email, password);
      navigate("/dashboard"); // redirect on success
    } catch (err) {
      alert(err.message); // basic error display, can be improved
    }
  };

  const fields = [
    { name: "email", label: "Email", type: "email", required: true },
    { name: "password", label: "Password", type: "password", required: true }
  ];

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Tasks</h1>
        <p className="subtitle">Organize your tasks effortlessly</p>

        <Form
          title="Login"
          fields={fields}
          submitLabel="Login"
          onSubmit={handleSubmit}
        />

        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <span> | </span>
          <Link to="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
