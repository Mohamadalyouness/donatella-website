import "./Footer.css";
import { Link } from "react-router-dom";
import {
  FaInstagram,
  FaFacebookF,
  FaTiktok,
  FaWhatsapp,
  FaEnvelope,
  FaMapMarkerAlt
} from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* BRAND */}
        <div className="footer-brand">
          <h2 className="footer-logo">DONATELLA</h2>
          <p className="footer-tagline">Chocolate Spread</p>
          <p className="footer-desc">
            Premium chocolate creations crafted for true chocolate lovers.
          </p>
        </div>

        {/* LINKS */}
        <div className="footer-links">
          <h4>Explore</h4>
          <Link to="/">Home</Link>
          <Link to="/items">Products</Link>
          <Link to="/about">About Us</Link>
        </div>

        {/* CONTACT */}
        <div className="footer-contact">
          <h4>Contact</h4>
          <p><FaEnvelope /> info@donatella.com</p>
          <p><FaWhatsapp /> +961 70 123 456</p>
          <p>
            <FaMapMarkerAlt />
            Beirut, Lebanon
          </p>
        </div>

        {/* SOCIAL */}
        <div className="footer-social">
          <h4>Follow Us</h4>
          <div className="social-icons">
            <a href="#"><FaInstagram /></a>
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaTiktok /></a>
          </div>
        </div>
      </div>

      {/* MAP */}
      <div className="footer-map">
        <iframe
          title="Donatella Location"
          src="https://www.google.com/maps?q=Beirut%20Lebanon&output=embed"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>
      </div>

      {/* BOTTOM */}
      <div className="footer-bottom">
        © {new Date().getFullYear()} Donatella Chocolate Spread. All rights reserved.
      </div>
    </footer>
  );
}

export default Footer;
