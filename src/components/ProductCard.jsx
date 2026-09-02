import { ShoppingCart } from "lucide-react";

function ProductCard({ product }) {

  const handleAddToCart = () => {
    const existingCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    const existingProduct = existingCart.find(
      (item) => item.id === product.id
    );

    let updatedCart;

    if (existingProduct) {
      updatedCart = existingCart.map((item) =>
        item.id === product.id
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    } else {
      updatedCart = [
        ...existingCart,
        {
          ...product,
          quantity: 1,
        },
      ];
    }

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    alert(`${product.name} ditambahkan ke keranjang!`);
  };

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

        <button
          className="cart-button"
          onClick={handleAddToCart}
        >
          <ShoppingCart size={18} />
          Tambah ke Keranjang
        </button>

      </div>

    </div>
  );
}

export default ProductCard;