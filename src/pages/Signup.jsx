import { Link, useNavigate } from "react-router-dom";
import Form from "../components/common/Form";
import { useAuth } from "../hooks/useAuth";

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = ({ fullname, email, password }) => {
    try {
      signup({ name: fullname, email, password }); // map fullname -> name
      navigate("/dashboard");
    } catch (err) {
      alert(err.message);
    }
  };

  const fields = [
    { name: "fullname", label: "Full Name", required: true },
    { name: "email", label: "Email", required: true },
    { name: "password", label: "Password", type: "password", required: true },
    { name: "confirm", label: "Confirm Password", type: "password", required: true }
  ];

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Tasks</h1>
        <p className="subtitle">Create your account to start managing tasks</p>

        <Form
          title="Sign Up"
          fields={fields}
          submitLabel="Sign Up"
          onSubmit={handleSubmit}
        />

        <div className="auth-links">
          <span>Already have an account? </span>
          <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}
