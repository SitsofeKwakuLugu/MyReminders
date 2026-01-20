import { useNavigate, Link } from "react-router-dom";
import Form from "../components/common/Form";

export default function ForgotPassword() {
  const navigate = useNavigate();

  const handleSubmit = ({ email }) => {
    // Simulate password reset
    const existingUser = JSON.parse(localStorage.getItem("tasks_user"));

    if (!existingUser || existingUser.email !== email) {
      alert("Email not found");
      return;
    }

    alert("Password reset link has been sent to your email (simulated)");
    navigate("/"); // redirect back to login
  };

  const fields = [
    { name: "email", label: "Email", type: "email", required: true }
  ];

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>Tasks</h1>
        <p className="subtitle">Enter your email to reset your password</p>

        <Form
          title="Forgot Password"
          fields={fields}
          submitLabel="Send Reset Link"
          onSubmit={handleSubmit}
        />

        <div className="auth-links">
          <span>Remembered your password? </span>
          <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
}
