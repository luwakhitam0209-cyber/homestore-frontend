import { ShoppingCart } from "lucide-react";

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <div className="product-image">
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

      <div className="product-info">
        <h3>{product.name}</h3>

        <p className="product-price">
          Rp {Number(product.price).toLocaleString("id-ID")}
        </p>

        <p className="product-stock">
          Stok: {product.stock}
        </p>

        <button className="cart-button">
          <ShoppingCart size={18} />
          Tambah ke Keranjang
        </button>
      </div>
    </div>
  );
}

export default ProductCard;