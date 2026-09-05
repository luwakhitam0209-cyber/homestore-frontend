import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/";

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      // Simpan data user
      localStorage.setItem("user", JSON.stringify(response.data.user));

      // Penanda bahwa user sudah login
      localStorage.setItem("isLoggedIn", "true");

      // Kembali ke halaman sebelumnya
      navigate(from);
    } catch (error) {
      console.error("Login gagal:", error);

      setError(
        error.response?.data?.message ||
          "Email atau password salah."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Home<span>Store</span></h1>
          <p>Masuk ke akun kamu</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Masukkan email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <div className="login-register">
          <p>
            Belum punya akun?{" "}
            <span>Daftar</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;