import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((error) =>
        console.error("Gagal mengambil produk:", error)
      )
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">

      {/* =========================
          HERO SECTION
      ========================= */}
      <section className="hero">

        <div className="hero-overlay"></div>

        <div className="hero-content">

          <div className="hero-badge">
            ✦ KUALITAS TERBAIK UNTUK RUMAHMU
          </div>

          <p className="hero-label">
            SELAMAT DATANG DI
          </p>

          <h1>
            Home<span>Store</span>
          </h1>

          <p className="hero-description">
            Temukan berbagai kebutuhan rumah tangga pilihan
            dengan kualitas terbaik, desain menarik, dan harga
            yang bersahabat.
          </p>

          <div className="hero-actions">

            <button
              className="hero-button"
              onClick={() => {
                document
                  .getElementById("produk")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              Belanja Sekarang
              <span>→</span>
            </button>

            <button
              className="hero-link"
              onClick={() => {
                document
                  .getElementById("produk")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  });
              }}
            >
              Lihat Koleksi
            </button>

          </div>

          <div className="hero-features">

            <div className="hero-feature">
              <span>✓</span>
              <div>
                <strong>Produk Berkualitas</strong>
                <small>Pilihan terbaik untukmu</small>
              </div>
            </div>

            <div className="hero-feature">
              <span>✓</span>
              <div>
                <strong>Harga Bersahabat</strong>
                <small>Belanja tanpa khawatir</small>
              </div>
            </div>

          </div>

        </div>

        <div className="hero-scroll">
          <span>SCROLL UNTUK MENJELAJAHI</span>
          <div className="scroll-line"></div>
        </div>

      </section>


      {/* =========================
          PRODUK SECTION
      ========================= */}
      <section
        className="products-section"
        id="produk"
      >
        <div className="section-header">

          <div>
            <p className="section-label">
              KOLEKSI KAMI
            </p>

            <h2>
              Katalog Produk
            </h2>
          </div>

          <div className="product-count">
            {products.length} Produk Tersedia
          </div>

        </div>

        {loading ? (
          <div className="loading-product">
            Memuat produk...
          </div>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        ) : (
          <div className="empty-product">
            Belum ada produk.
          </div>
        )}

      </section>

    </div>
  );
}

export default Home;