import { Link, NavLink, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const isHome = location.pathname === "/";
  const isDashboard = location.pathname.startsWith("/dashboard");

  const closeMenu = () => {
    setOpen(false);
  };

  if (isDashboard) {
    return (
      <nav className="navbar navbar--solid">
        <Link to="/" className="navbar-logo">
          <img src={logo} alt="Donatella Chocolate" className="navbar-logo-img" />
        </Link>
      </nav>
    );
  }

  return (
    <nav className={`navbar ${isHome ? "navbar--transparent" : "navbar--solid"}`}>
      <Link to="/" className="navbar-logo">
        <img src={logo} alt="Donatella Chocolate" className="navbar-logo-img" />
      </Link>

      <button
        className={`menu-btn ${open ? "open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
        aria-expanded={open}
      >
        <span className="menu-line"></span>
        <span className="menu-line"></span>
        <span className="menu-line"></span>
      </button>

      <ul className={`nav-links ${open ? "open" : ""}`}>
        <li>
          <NavLink to="/" onClick={closeMenu} end>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to="/items" onClick={closeMenu}>
            Products
          </NavLink>
        </li>
        <li>
          <NavLink to="/about" onClick={closeMenu}>
            About Us
          </NavLink>
        </li>
        <li>
          <NavLink to="/contactus" onClick={closeMenu}>
            Contact Us
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
