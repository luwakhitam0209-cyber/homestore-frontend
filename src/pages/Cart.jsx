import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Trash2, Plus, Minus } from "lucide-react";
import api from "../services/api";

function Cart() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // SHIPPING STATE
  // =========================
  const [destinationSearch, setDestinationSearch] = useState("");
  const [destinations, setDestinations] = useState([]);
  const [selectedDestination, setSelectedDestination] = useState(null);

  const [courier, setCourier] = useState("");
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);

  useEffect(() => {
    const savedCart =
      JSON.parse(localStorage.getItem("cart")) || [];

    setCart(savedCart);
  }, []);

  const saveCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );
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

    // Ongkir perlu dihitung ulang
    setSelectedShipping(null);
    setShippingOptions([]);
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

    // Ongkir perlu dihitung ulang
    setSelectedShipping(null);
    setShippingOptions([]);
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(
      (item) => item.id !== id
    );

    saveCart(updatedCart);

    // Ongkir perlu dihitung ulang
    setSelectedShipping(null);
    setShippingOptions([]);
  };

  // =========================
  // SUBTOTAL
  // =========================
  const subtotal = cart.reduce(
    (sum, item) =>
      sum + Number(item.price) * item.quantity,
    0
  );

  // =========================
  // TOTAL BERAT
  // gram
  // =========================
  const totalWeight = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.weight || 1000) *
        item.quantity,
    0
  );

  // =========================
  // ONGKIR
  // =========================
  const shippingCost = Number(
    selectedShipping?.cost || 0
  );

  // =========================
  // TOTAL AKHIR
  // =========================
  const grandTotal =
    subtotal + shippingCost;

  // =========================
  // CARI TUJUAN
  // =========================
  const searchDestination = async () => {
    if (
      destinationSearch.trim().length < 2
    ) {
      alert(
        "Masukkan minimal 2 karakter."
      );
      return;
    }

    try {
      const response = await api.get(
        "/shipping/destinations",
        {
          params: {
            search: destinationSearch,
          },
        }
      );

      setDestinations(
        response.data?.data || []
      );
    } catch (error) {
      console.error(
        "Gagal mencari tujuan:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Gagal mencari alamat."
      );
    }
  };

  // =========================
  // HITUNG ONGKIR
  // =========================
  const calculateShipping = async () => {
    if (!selectedDestination) {
      alert(
        "Pilih tujuan pengiriman terlebih dahulu."
      );
      return;
    }

    if (!courier) {
      alert("Pilih kurir terlebih dahulu.");
      return;
    }

    setShippingLoading(true);
    setSelectedShipping(null);
    setShippingOptions([]);

    try {
      const response = await api.post(
        "/shipping/cost",
        {
          destination:
            selectedDestination.id,

          weight: totalWeight,

          courier: courier,
        }
      );

      const options =
        response.data?.data || [];

      if (options.length === 0) {
        alert(
          "Tidak ada layanan pengiriman."
        );
        return;
      }

      setShippingOptions(options);

      // pilih layanan pertama
      setSelectedShipping(options[0]);

    } catch (error) {
      console.error(
        "Gagal menghitung ongkir:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Gagal menghitung ongkir."
      );
    } finally {
      setShippingLoading(false);
    }
  };

  // =========================
  // CHECKOUT MIDTRANS
  // =========================
  const handleCheckout = async () => {
    if (cart.length === 0) {
      alert(
        "Keranjang masih kosong."
      );
      return;
    }

    if (!selectedDestination) {
      alert(
        "Pilih tujuan pengiriman."
      );
      return;
    }

    if (!selectedShipping) {
      alert(
        "Pilih layanan pengiriman."
      );
      return;
    }

    setLoading(true);

    try {
      const response = await api.post(
        "/payment/create",
        {
          user_id: 1,

          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),

          shipping_cost:
            shippingCost,

          shipping_destination:
            selectedDestination.label,

          shipping_courier:
            selectedShipping.code,

          shipping_service:
            selectedShipping.service,
        }
      );

      const snapToken =
        response.data?.data?.snap_token;

      if (!snapToken) {
        throw new Error(
          "Snap Token tidak ditemukan."
        );
      }

      if (!window.snap) {
        throw new Error(
          "Midtrans Snap belum siap. Silakan refresh halaman."
        );
      }

      window.snap.pay(
        snapToken,
        {
          onSuccess: function (result) {
            console.log(
              "Pembayaran berhasil:",
              result
            );

            alert(
              "Pembayaran berhasil!"
            );

            localStorage.removeItem(
              "cart"
            );

            setCart([]);
          },

          onPending: function (result) {
            console.log(
              "Pembayaran pending:",
              result
            );

            alert(
              "Pembayaran masih menunggu."
            );
          },

          onError: function (result) {
            console.error(
              "Pembayaran gagal:",
              result
            );

            alert(
              "Pembayaran gagal."
            );
          },

          onClose: function () {
            console.log(
              "Popup Midtrans ditutup."
            );
          },
        }
      );

    } catch (error) {
      console.error(
        "Checkout error:",
        error
      );

      alert(
        error.response?.data?.message ||
          error.message ||
          "Terjadi kesalahan saat checkout."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CART KOSONG
  // =========================
  if (cart.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-container">
          <h1>
            Keranjang Belanja
          </h1>

          <p>
            Keranjang kamu masih kosong.
          </p>

          <Link
            to="/"
            className="back-button"
          >
            <ArrowLeft size={18} />
            Kembali
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">

        <Link
          to="/"
          className="back-link"
        >
          <ArrowLeft size={18} />
          Kembali
        </Link>

        <h1>
          Keranjang Belanja
        </h1>

        <div className="cart-content">

          {/* =========================
              CART ITEMS
          ========================= */}
          <div className="cart-items">

            {cart.map((item) => (
              <div
                className="cart-item"
                key={item.id}
              >

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

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    Rp{" "}
                    {Number(
                      item.price
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </p>

                  <div className="quantity-control">

                    <button
                      onClick={() =>
                        decreaseQuantity(
                          item.id
                        )
                      }
                    >
                      <Minus size={16} />
                    </button>

                    <span>
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        increaseQuantity(
                          item.id
                        )
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
                      Number(item.price) *
                      item.quantity
                    ).toLocaleString(
                      "id-ID"
                    )}
                  </p>

                  <button
                    className="remove-button"
                    onClick={() =>
                      removeItem(item.id)
                    }
                  >
                    <Trash2 size={18} />
                  </button>

                </div>

              </div>
            ))}

          </div>

          {/* =========================
              SHIPPING
          ========================= */}
          <div className="shipping-section">

            <h2>
              Pengiriman
            </h2>

            <p>
              Berat paket:{" "}
              <strong>
                {totalWeight.toLocaleString(
                  "id-ID"
                )}{" "}
                gram
              </strong>
            </p>

            {/* SEARCH DESTINATION */}
            <div className="destination-search">

              <input
                type="text"
                placeholder="Cari kota / kecamatan..."
                value={
                  destinationSearch
                }
                onChange={(e) =>
                  setDestinationSearch(
                    e.target.value
                  )
                }
              />

              <button
                type="button"
                onClick={
                  searchDestination
                }
              >
                Cari
              </button>

            </div>

            {/* DESTINATION RESULT */}
            {destinations.length > 0 && (
              <div className="destination-list">

                {destinations.map(
                  (destination) => (
                    <button
                      type="button"
                      key={
                        destination.id
                      }
                      className={
                        selectedDestination?.id ===
                        destination.id
                          ? "destination-option selected"
                          : "destination-option"
                      }
                      onClick={() => {
                        setSelectedDestination(
                          destination
                        );

                        setDestinations(
                          []
                        );

                        setSelectedShipping(
                          null
                        );

                        setShippingOptions(
                          []
                        );
                      }}
                    >
                      {destination.label}
                    </button>
                  )
                )}

              </div>
            )}

            {/* SELECTED DESTINATION */}
            {selectedDestination && (
              <div className="selected-destination">

                <strong>
                  Tujuan Pengiriman
                </strong>

                <p>
                  {
                    selectedDestination.label
                  }
                </p>

              </div>
            )}

            {/* COURIER */}
            <div className="courier-section">

              <label htmlFor="courier">
                Pilih Kurir
              </label>

              <select
                id="courier"
                value={courier}
                onChange={(e) => {
                  setCourier(
                    e.target.value
                  );

                  setSelectedShipping(
                    null
                  );

                  setShippingOptions(
                    []
                  );
                }}
              >

                <option value="">
                  -- Pilih Kurir --
                </option>

                <option value="jne">
                  JNE
                </option>

                <option value="jnt">
                  J&T Express
                </option>

                <option value="sicepat">
                  SiCepat
                </option>

              </select>

              <button
                type="button"
                onClick={
                  calculateShipping
                }
                disabled={
                  shippingLoading
                }
              >
                {shippingLoading
                  ? "Menghitung..."
                  : "Hitung Ongkir"}
              </button>

            </div>

            {/* SHIPPING OPTIONS */}
            {shippingOptions.length >
              0 && (
              <div className="shipping-options">

                <h3>
                  Pilih Layanan
                </h3>

                {shippingOptions.map(
                  (
                    option,
                    index
                  ) => (
                    <button
                      type="button"
                      key={`${option.code}-${option.service}-${index}`}
                      className={
                        selectedShipping?.service ===
                        option.service
                          ? "shipping-option selected"
                          : "shipping-option"
                      }
                      onClick={() =>
                        setSelectedShipping(
                          option
                        )
                      }
                    >

                      <div>

                        <strong>
                          {option.service}
                        </strong>

                        <small>
                          {
                            option.description
                          }
                        </small>

                        <small>
                          Estimasi:{" "}
                          {option.etd ||
                            "-"}
                        </small>

                      </div>

                      <strong>
                        Rp{" "}
                        {Number(
                          option.cost
                        ).toLocaleString(
                          "id-ID"
                        )}
                      </strong>

                    </button>
                  )
                )}

              </div>
            )}

          </div>

          {/* =========================
              SUMMARY
          ========================= */}
          <div className="cart-summary">

            <h2>
              Ringkasan Pesanan
            </h2>

            <div className="cart-total">
              <span>
                Subtotal
              </span>

              <strong>
                Rp{" "}
                {subtotal.toLocaleString(
                  "id-ID"
                )}
              </strong>
            </div>

            <div className="cart-total">
              <span>
                Ongkir
              </span>

              <strong>
                Rp{" "}
                {shippingCost.toLocaleString(
                  "id-ID"
                )}
              </strong>
            </div>

            {selectedShipping && (
              <p>
                {selectedShipping.name}{" "}
                -{" "}
                {
                  selectedShipping.service
                }
              </p>
            )}

            <div className="cart-total">
              <span>
                Total
              </span>

              <strong>
                Rp{" "}
                {grandTotal.toLocaleString(
                  "id-ID"
                )}
              </strong>
            </div>

            <button
              className="checkout-button"
              onClick={
                handleCheckout
              }
              disabled={
                loading ||
                !selectedDestination ||
                !selectedShipping
              }
            >
              {loading
                ? "Memproses..."
                : "Checkout"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Cart;