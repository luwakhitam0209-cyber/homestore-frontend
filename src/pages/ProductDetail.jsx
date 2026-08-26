import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { getProductById } from "../services/productService";

function ProductDetail() {
  const { id } = useParams();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProductById(id)
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        console.error("Gagal mengambil detail produk:", error);
        setError("Produk tidak ditemukan.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-loading">
        <p>Memuat detail produk...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-error">
        <p>{error || "Produk tidak ditemukan."}</p>

        <Link to="/" className="back-button">
          <ArrowLeft size={18} />
          Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      <div className="product-detail-container">

        <Link to="/" className="back-link">
          <ArrowLeft size={18} />
          Kembali ke Produk
        </Link>

        <div className="product-detail">

          {/* GAMBAR */}
          <div className="product-detail-image">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
              />
            ) : (
              <div className="no-image">
                Tidak ada gambar
              </div>
            )}
          </div>

          {/* INFORMASI */}
          <div className="product-detail-info">

            <p className="product-detail-label">
              PRODUK HOMESTORE
            </p>

            <h1>{product.name}</h1>

            <p className="product-detail-price">
              Rp {Number(product.price).toLocaleString("id-ID")}
            </p>

            <p className="product-detail-stock">
              Stok tersedia: {product.stock}
            </p>

            {product.detail?.description && (
              <div className="product-description">
                <h3>Deskripsi Produk</h3>
                <p>{product.detail.description}</p>
              </div>
            )}

            {product.detail?.weight && (
              <p className="product-weight">
                Berat: {product.detail.weight} gram
              </p>
            )}

            {product.store && (
              <div className="product-store">
                <h3>Toko</h3>
                <p>{product.store.name}</p>
                <span>{product.store.address}</span>
              </div>
            )}

            <button className="detail-cart-button">
              <ShoppingCart size={20} />
              Tambah ke Keranjang
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductDetail;