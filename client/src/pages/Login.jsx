import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { saveToken, saveUser } from "../utils/auth";

function Login() {
const navigate = useNavigate();

const [formData, setFormData] = useState({
email: "",
password: "",
});

const [message, setMessage] = useState("");
const [welcomeMessage, setWelcomeMessage] = useState("");

const handleChange = (e) => {
setFormData({
...formData,
[e.target.name]: e.target.value,
});
};

const handleSubmit = async (e) => {
e.preventDefault();


try {
  const response = await api.post("/auth/login", formData);

  saveToken(response.data.token);
  saveUser(response.data.user);

  const user = response.data.user;
  const role = user.role;

  setWelcomeMessage(
    `Welcome back, ${user.full_name}! 👋`
  );

  // Wait for 2 seconds before opening the dashboard
  setTimeout(() => {
    if (role === "student") {
      navigate("/student");
    } else if (role === "lecturer") {
      navigate("/lecturer");
    } else if (role === "supervisor") {
      navigate("/supervisor");
    } else if (role === "admin") {
      navigate("/admin");
    }
  }, 2000);

} catch (error) {
  if (error.response) {
    setMessage(error.response.data.message);
  } else {
    setMessage("Server error.");
  }
}


};

return ( <div className="auth-container">


  {/* Welcome Popup */}
  {welcomeMessage && (
    <div
      style={{
        position: "fixed",
        top: "25px",
        right: "25px",
        background: "#198754",
        color: "white",
        padding: "18px 25px",
        borderRadius: "10px",
        boxShadow: "0 5px 15px rgba(0,0,0,0.25)",
        fontWeight: "bold",
        zIndex: 1000,
      }}
    >
      🎉 {welcomeMessage}

      <br />

      <small style={{ fontWeight: "normal" }}>
        Login successful. Opening your dashboard...
      </small>
    </div>
  )}

  <div className="auth-left">

    <h1>Student Research Management System</h1>

    <p>
      Welcome to the Student Research Management System.
    </p>

    <br />

    <p>✔ Submit research topics online.</p>

    <p>✔ Track lecturer approvals.</p>

    <p>✔ Receive supervisor feedback.</p>

    <p>✔ Upload your final research project.</p>

  </div>

  <div className="auth-right">

    <div className="login-card">

      <h2>Login</h2>

      {message && (
        <p className="message">
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="login-btn"
        >
          Login
        </button>

      </form>

      <div className="register-link">

        Don't have an account?

        <br /><br />

        <Link to="/register">
          Create an Account
        </Link>

      </div>

    </div>

  </div>

</div>


);
}

export default Login;
