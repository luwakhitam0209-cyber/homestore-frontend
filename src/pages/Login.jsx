import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../services/api";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from || "/";


  // =========================
  // LOGIN
  // =========================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const response = await api.post("/login", {
        email,
        password,
      });

      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      localStorage.setItem("isLoggedIn", "true");

      navigate(from);
    } catch (error) {
      console.error("Login gagal:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        setError(
          errors.email?.[0] ||
          errors.password?.[0] ||
          "Email atau password salah."
        );
      } else {
        setError(
          error.response?.data?.message ||
          "Email atau password salah."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // SIGN UP
  // =========================

  const handleSignUp = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      setError("Password dan konfirmasi password tidak sama.");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/register", {
        name,
        email,
        password,
        password_confirmation: confirmPassword,
      });

      console.log("Registrasi berhasil:", response.data);

      // Setelah register berhasil,
      // langsung pindah ke mode login
      setMode("login");

      // Bersihkan password
      setPassword("");
      setConfirmPassword("");

      // Tampilkan pesan
      setError("Registrasi berhasil! Silakan login.");
    } catch (error) {
      console.error("Registrasi gagal:", error);

      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;

        setError(
          errors.email?.[0] ||
          errors.password?.[0] ||
          errors.name?.[0] ||
          "Data registrasi tidak valid."
        );
      } else {
        setError(
          error.response?.data?.message ||
          "Registrasi gagal."
        );
      }
    } finally {
      setLoading(false);
    }
  };


  // =========================
  // SWITCH LOGIN / SIGN UP
  // =========================

  const switchMode = (newMode) => {
    setMode(newMode);

    setError("");
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };


  return (
    <div className="login-page">

      <div className="login-card">

        {/* HEADER */}

        <div className="login-header">
          <h1>
            Home<span>Store</span>
          </h1>

          <p>
            {mode === "login"
              ? "Masuk ke akun kamu"
              : "Buat akun baru"}
          </p>
        </div>


        {/* TABS */}

        <div className="auth-tabs">

          <button
            type="button"
            className={mode === "signup" ? "active" : ""}
            onClick={() => switchMode("signup")}
          >
            Sign Up
          </button>

          <button
            type="button"
            className={mode === "login" ? "active" : ""}
            onClick={() => switchMode("login")}
          >
            Login
          </button>

        </div>


        {/* FORM */}

        <form
          onSubmit={
            mode === "login"
              ? handleLogin
              : handleSignUp
          }
        >

          {/* NAME */}

          {mode === "signup" && (
            <div className="form-group">

              <label>Nama</label>

              <input
                type="text"
                placeholder="Masukkan nama"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

            </div>
          )}


          {/* EMAIL */}

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


          {/* PASSWORD */}

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


          {/* CONFIRM PASSWORD */}

          {mode === "signup" && (
            <div className="form-group">

              <label>Konfirmasi Password</label>

              <input
                type="password"
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                required
              />

            </div>
          )}


          {/* ERROR / MESSAGE */}

          {error && (
            <div className="login-error">
              {error}
            </div>
          )}


          {/* BUTTON */}

          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading
              ? "Memproses..."
              : mode === "login"
              ? "Login"
              : "Sign Up"}
          </button>

        </form>


        {/* BOTTOM TEXT */}

        <div className="login-register">

          <p>

            {mode === "login"
              ? "Belum punya akun? "
              : "Sudah punya akun? "}

            <span
              onClick={() =>
                switchMode(
                  mode === "login"
                    ? "signup"
                    : "login"
                )
              }
            >

              {mode === "login"
                ? "Sign Up"
                : "Login"}

            </span>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Login;