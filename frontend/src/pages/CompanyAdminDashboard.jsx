import { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const CompanyAdminDashboard = () => {
  const { user, logout } = useAuth();
  const [shops, setShops] = useState([]);
  const [products, setProducts] = useState([]);
  const [shopForm, setShopForm] = useState({ name: "", location: "" });
  const [productForm, setProductForm] = useState({ name: "", price: "", stock: "", category: "", shopId: "" });
  const [team, setTeam] = useState([]);
  const [shopAdminForm, setShopAdminForm] = useState({ name: "", email: "", password: "", shopId: "" });
  const [error, setError] = useState("");

  const fetchShops = async () => {
    const { data } = await api.get("/shops");
    setShops(data);
  };

  const fetchProducts = async () => {
    const { data } = await api.get("/products");
    setProducts(data);
  };

  const fetchTeam = async () => {
    const { data } = await api.get("/users/team");
    setTeam(data);
  };

  useEffect(() => {
    fetchShops();
    fetchProducts();
    fetchTeam();
  }, []);

  const createShop = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/shops", shopForm);
      setShopForm({ name: "", location: "" });
      fetchShops();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create shop");
    }
  };

  const deleteShop = async (id) => {
    await api.delete(`/shops/${id}`);
    fetchShops();
  };

  const createProduct = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/products", productForm);
      setProductForm({ name: "", price: "", stock: "", category: "", shopId: "" });
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create product");
    }
  };

  const deleteProduct = async (id) => {
    await api.delete(`/products/${id}`);
    fetchProducts();
  };

  const createShopAdmin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/users/shopadmin", shopAdminForm);
      setShopAdminForm({ name: "", email: "", password: "", shopId: "" });
      fetchTeam();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create shop admin");
    }
  };

  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <h2>Company Admin — {user?.name}</h2>
        <button onClick={logout} style={styles.logout}>Logout</button>
      </header>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <section style={styles.card}>
        <h3>Create Shop</h3>
        <form onSubmit={createShop} style={styles.form}>
          <input placeholder="Shop name" value={shopForm.name} onChange={(e) => setShopForm({ ...shopForm, name: e.target.value })} required />
          <input placeholder="Location" value={shopForm.location} onChange={(e) => setShopForm({ ...shopForm, location: e.target.value })} />
          <button type="submit" style={styles.button}>Add Shop</button>
        </form>
        <table style={styles.table}>
          <thead><tr><th>Name</th><th>Location</th><th>Action</th></tr></thead>
          <tbody>
            {shops.map((s) => (
              <tr key={s._id}>
                <td>{s.name}</td>
                <td>{s.location || "-"}</td>
                <td><button style={styles.delete} onClick={() => deleteShop(s._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={styles.card}>
        <h3>Create Product</h3>
        <form onSubmit={createProduct} style={styles.form}>
          <input placeholder="Product name" value={productForm.name} onChange={(e) => setProductForm({ ...productForm, name: e.target.value })} required />
          <input placeholder="Price" type="number" value={productForm.price} onChange={(e) => setProductForm({ ...productForm, price: e.target.value })} required />
          <input placeholder="Stock" type="number" value={productForm.stock} onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })} required />
          <input placeholder="Category" value={productForm.category} onChange={(e) => setProductForm({ ...productForm, category: e.target.value })} />
          <select value={productForm.shopId} onChange={(e) => setProductForm({ ...productForm, shopId: e.target.value })} required>
            <option value="">Select shop</option>
            {shops.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <button type="submit" style={styles.button}>Add Product</button>
        </form>
        <table style={styles.table}>
          <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Shop</th><th>Action</th></tr></thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.shopId?.name || "-"}</td>
                <td><button style={styles.delete} onClick={() => deleteProduct(p._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <section style={styles.card}>
        <h3>Create Shop Admin</h3>
        <form onSubmit={createShopAdmin} style={styles.form}>
          <input placeholder="Full name" value={shopAdminForm.name} onChange={(e) => setShopAdminForm({ ...shopAdminForm, name: e.target.value })} required />
          <input placeholder="Email" type="email" value={shopAdminForm.email} onChange={(e) => setShopAdminForm({ ...shopAdminForm, email: e.target.value })} required />
          <input placeholder="Password" type="password" value={shopAdminForm.password} onChange={(e) => setShopAdminForm({ ...shopAdminForm, password: e.target.value })} required />
          <select value={shopAdminForm.shopId} onChange={(e) => setShopAdminForm({ ...shopAdminForm, shopId: e.target.value })} required>
            <option value="">Select shop</option>
            {shops.map((s) => <option key={s._id} value={s._id}>{s.name}</option>)}
          </select>
          <button type="submit" style={styles.button}>Add Shop Admin</button>
        </form>
        <table style={styles.table}>
          <thead><tr><th>Name</th><th>Email</th><th>Role</th></tr></thead>
          <tbody>
            {team.filter((t) => t.role === "shopadmin").map((t) => (
              <tr key={t._id}>
                <td>{t.name}</td>
                <td>{t.email}</td>
                <td>{t.role}</td>
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

export default CompanyAdminDashboard;
