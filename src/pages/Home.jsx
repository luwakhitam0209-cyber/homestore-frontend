import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import { getProducts } from "../services/productService";

function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((data) => setProducts(data))
      .catch((error) => console.error("Gagal mengambil produk:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="home">
      {/* HERO SECTION */}
      <section className="hero">
        <div className="hero-content">
          <p className="hero-label">SELAMAT DATANG DI</p>

          <h1>
            Home<span>Store</span>
          </h1>

          <p className="hero-description">
            Temukan berbagai kebutuhan rumah tangga dengan kualitas terbaik.
          </p>

          <button
            className="hero-button"
            onClick={() => {
              document
                .getElementById("produk")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            Belanja Sekarang
          </button>
        </div>
      </section>

      {/* PRODUK SECTION (Ditaruh ID "produk" untuk smooth scroll) */}
      <section className="products-section" id="produk">
        <div className="section-header">
          <div>
            <p className="section-label">KOLEKSI KAMI</p>
            <h2>Katalog Produk</h2>
          </div>
          <div className="product-count">
            {products.length} Produk Tersedia
          </div>
        </div>

        {loading ? (
          <div className="loading-product">Memuat produk...</div>
        ) : products.length > 0 ? (
          <div className="product-grid">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="empty-product">Belum ada produk.</div>
        )}
      </section>
    </div>
  );
}

export default Home;