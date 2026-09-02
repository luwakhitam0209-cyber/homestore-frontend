import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react";

function Cart() {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          quantity: item.quantity + 1,
        };
      }

      return item;
    });

    saveCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) => {
        if (item.id === id) {
          return {
            ...item,
            quantity: item.quantity - 1,
          };
        }

        return item;
      })
      .filter((item) => item.quantity > 0);

    saveCart(updatedCart);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    saveCart(updatedCart);
  };

  const total = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1>Keranjang Belanja</h1>

          <p>Keranjang kamu masih kosong.</p>

          <Link to="/products" className="back-button">
            <ArrowLeft size={18} />
            Kembali ke Produk
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">

        <Link to="/products" className="back-link">
          <ArrowLeft size={18} />
          Kembali ke Produk
        </Link>

        <h1>Keranjang Belanja</h1>

        <div className="cart-content">

          <div className="cart-items">

            {cart.map((item) => (
              <div className="cart-item" key={item.id}>

                <div className="cart-item-image">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                    />
                  ) : (
                    <div className="no-image">
                      Tidak ada gambar
                    </div>
                  )}
                </div>

                <div className="cart-item-info">
                  <h3>{item.name}</h3>

                  <p>
                    Rp {Number(item.price).toLocaleString("id-ID")}
                  </p>

                  <div className="quantity-control">

                    <button
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      <Minus size={16} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                    >
                      <Plus size={16} />
                    </button>

                  </div>
                </div>

                <div className="cart-item-right">

                  <p>
                    Rp{" "}
                    {(
                      Number(item.price) * item.quantity
                    ).toLocaleString("id-ID")}
                  </p>

                  <button
                    className="remove-button"
                    onClick={() => removeItem(item.id)}
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>
            ))}

          </div>

          <div className="cart-summary">

            <h2>Ringkasan Pesanan</h2>

            <div className="cart-total">
              <span>Total</span>

              <strong>
                Rp {total.toLocaleString("id-ID")}
              </strong>
            </div>

            <button className="checkout-button">
              Checkout
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Cart;