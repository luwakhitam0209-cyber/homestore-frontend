function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <h2>
            Home<span>Store</span>
          </h2>

          <p>
            Temukan berbagai kebutuhan rumah tangga
            berkualitas untuk membuat rumah menjadi
            lebih nyaman dan indah.
          </p>
        </div>


        {/* NAVIGATION */}
        <div className="footer-column">
          <h3>Navigasi</h3>

          <a href="/">Beranda</a>
          <a href="/products">Produk</a>
          <a href="/cart">Keranjang</a>
        </div>


        {/* INFORMATION */}
        <div className="footer-column">
          <h3>Layanan</h3>

          <a href="/products">Katalog Produk</a>
          <a href="/cart">Pesanan Saya</a>
          <a href="/login">Akun</a>
        </div>


        {/* CONTACT */}
        <div className="footer-column footer-contact">
          <h3>Hubungi Kami</h3>

          <p>
            <span>✉</span>
            homestore@gmail.com
          </p>

          <p>
            <span>☎</span>
            +62 812-3456-7890
          </p>

          <p>
            <span>⌖</span>
            Indonesia
          </p>
        </div>

      </div>


      {/* BOTTOM */}
      <div className="footer-bottom">

        <p>
          © {new Date().getFullYear()} HomeStore.
          All rights reserved.
        </p>

        <div className="footer-line"></div>

        <p className="footer-made">
          Dibuat dengan ♥ untuk rumah yang lebih nyaman.
        </p>

      </div>

    </footer>
  );
}

export default Footer;