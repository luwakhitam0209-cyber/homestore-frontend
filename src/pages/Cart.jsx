import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import axios from "axios";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

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

  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert("Keranjang masih kosong.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://192.168.1.102:8000/api/payment/create",
        {
          user_id: 1,
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        }
      );

      const snapToken = response.data.data.snap_token;

      if (!snapToken) {
        throw new Error("Snap Token tidak ditemukan.");
      }

      if (!window.snap) {
        throw new Error(
          "Midtrans Snap belum siap. Coba refresh halaman."
        );
      }

      window.snap.pay(snapToken, {
        onSuccess: function () {
          alert("Pembayaran berhasil!");

          localStorage.removeItem("cart");
          setCart([]);
        },

        onPending: function () {
          alert("Pembayaran masih menunggu.");
        },

        onError: function () {
          alert("Pembayaran gagal.");
        },

        onClose: function () {
          console.log("Popup pembayaran ditutup.");
        },
      });
    } catch (error) {
      console.error("Checkout error:", error);

      const message =
        error.response?.data?.message ||
        error.message ||
        "Terjadi kesalahan saat checkout.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

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
                    <img src={item.image} alt={item.name} />
                  ) : (
                    <div className="no-image">
                      Tidak ada gambar
                    </div>
                  )}
                </div>

                <div className="cart-item-info">
                  <h3>{item.name}</h3>

                  <p>
                    Rp{" "}
                    {Number(item.price).toLocaleString("id-ID")}
                  </p>

                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        decreaseQuantity(item.id)
                      }
                    >
                      <Minus size={16} />
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        increaseQuantity(item.id)
                      }
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

            <button
              className="checkout-button"
              onClick={handleCheckout}
              disabled={loading}
            >
              {loading ? "Memproses..." : "Checkout"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;