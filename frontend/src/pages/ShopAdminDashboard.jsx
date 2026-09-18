import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const ShopAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "", category: "" });
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    const { data } = await api.get("/products");
    setProducts(data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const createProduct = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/products", { ...form, shopId: user.shopId });
      setForm({ name: "", price: "", stock: "", category: "" });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    }
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2>Shop Admin — {user?.name}</h2>
        <button onClick={logout} style={styles.logout}>Logout</button>
      </header>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={styles.card}>
        <h3>Add Product (your shop only)</h3>
        <form onSubmit={createProduct} style={styles.form}>
          <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input placeholder="Stock" type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <button type="submit" style={styles.button}>Add Product</button>
        </form>
        <table style={styles.table}>
          <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Action</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
                <td><button style={styles.delete} onClick={() => deleteProduct(p._id)}>Delete</button></td>
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

export default ShopAdminDashboard;
