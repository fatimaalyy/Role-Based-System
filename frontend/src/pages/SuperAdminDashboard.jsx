import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const SuperAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    adminName: "",
    adminEmail: "",
    adminPassword: "",
  });
  const [error, setError] = useState("");

  const fetchCompanies = async () => {
    const { data } = await api.get("/companies");
    setCompanies(data);
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/companies", form);
      setForm({ companyName: "", industry: "", adminName: "", adminEmail: "", adminPassword: "" });
      fetchCompanies();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create company");
    }
  };

  const handleDelete = async (id) => {
    await api.delete(`/companies/${id}`);
    fetchCompanies();
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2>Super Admin — {user?.name}</h2>
        <button onClick={logout} style={styles.logout}>Logout</button>
      </header>

      <section style={styles.card}>
        <h3>Create Company + Company Admin</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleCreate} style={styles.form}>
          <input name="companyName" placeholder="Company name" value={form.companyName} onChange={handleChange} required />
          <input name="industry" placeholder="Industry (optional)" value={form.industry} onChange={handleChange} />
          <input name="adminName" placeholder="Admin full name" value={form.adminName} onChange={handleChange} required />
          <input name="adminEmail" type="email" placeholder="Admin email" value={form.adminEmail} onChange={handleChange} required />
          <input name="adminPassword" type="password" placeholder="Admin password" value={form.adminPassword} onChange={handleChange} required />
          <button type="submit" style={styles.button}>Create Company</button>
        </form>
      </section>

      <section style={styles.card}>
        <h3>All Companies</h3>
        <table style={styles.table}>
          <thead>
            <tr><th>Name</th><th>Industry</th><th>Admin Email</th><th>Action</th></tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c._id}>
                <td>{c.name}</td>
                <td>{c.industry || "-"}</td>
                <td>{c.ownerAdminId?.email || "-"}</td>
                <td><button style={styles.delete} onClick={() => handleDelete(c._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

const styles = {
  page: { padding: "2rem", fontFamily: "sans-serif", maxWidth: 900, margin: "0 auto" },
  header: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  logout: { background: "#ef4444", color: "#fff", border: "none", padding: "0.5rem 1rem", borderRadius: 4, cursor: "pointer" },
  card: { background: "#fff", padding: "1.5rem", borderRadius: 8, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", marginTop: "1.5rem" },
  form: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" },
  button: { gridColumn: "1 / -1", padding: "0.6rem", background: "#2563eb", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "1rem" },
  delete: { background: "#ef4444", color: "#fff", border: "none", padding: "0.3rem 0.7rem", borderRadius: 4, cursor: "pointer" },
};

export default SuperAdminDashboard;
