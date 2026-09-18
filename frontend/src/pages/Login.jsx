import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const user = await login(email, password);
      if (user.role === "superadmin") navigate("/superadmin");
      else if (user.role === "companyadmin") navigate("/companyadmin");
      else navigate("/shopadmin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div style={styles.wrap}>
      <form style={styles.card} onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <p style={styles.error}>{error}</p>}
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button style={styles.button} type="submit">Login</button>
      </form>
    </div>
  );
};

const styles = {
  wrap: { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f4f6f8" },
  card: { background: "#fff", padding: "2rem", borderRadius: 8, width: 320, boxShadow: "0 2px 8px rgba(0,0,0,0.1)" },
  input: { display: "block", width: "100%", padding: "0.6rem", margin: "0.5rem 0", boxSizing: "border-box" },
  button: { width: "100%", padding: "0.6rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" },
  error: { color: "red", fontSize: 14 },
};

export default Login;
