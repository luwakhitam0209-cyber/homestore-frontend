import React from "react";
import { ShoppingBag, Search, User } from "lucide-react"; // jika ada lucide-react, atau pakai teks/icon biasa

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* LOGO */}
        <a href="/" className="navbar-logo">
          Home<span>Store</span>
        </a>

        {/* SEARCH BAR */}
        <div className="navbar-search">
          <input type="text" placeholder="Cari produk kebutuhan rumah..." />
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
            <button className="icon-btn" aria-label="Keranjang">
              🛒 <span className="cart-badge">0</span>
            </button>
            <button className="icon-btn" aria-label="Profil">
              👤
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;