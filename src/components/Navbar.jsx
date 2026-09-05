import React from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingBag, Search, User } from "lucide-react";

function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <div className="navbar-container">

        {/* LOGO */}
        <a href="/" className="navbar-logo">
          Home<span>Store</span>
        </a>

        {/* SEARCH BAR */}
        <div className="navbar-search">
          <input
            type="text"
            placeholder="Cari produk kebutuhan rumah..."
          />
          <button type="submit" aria-label="Cari">
            🔍
          </button>
        </div>

        {/* MENU & ICONS */}
        <div className="navbar-menu">
          <a href="/" className="nav-link active">
            Home
          </a>

          <a href="#produk" className="nav-link">
            Produk
          </a>

          <div className="navbar-actions">

            {/* KERANJANG */}
            <button
              className="icon-btn"
              aria-label="Keranjang"
              onClick={() => navigate("/cart")}
            >
              🛒 <span className="cart-badge">0</span>
            </button>

            {/* PROFIL */}
          <button
            className="icon-btn"
            aria-label="Profil"
            onClick={() => navigate("/login")}
          >
            👤
          </button>

          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;