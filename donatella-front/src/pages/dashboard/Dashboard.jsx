import { NavLink, Outlet, useNavigate, Link } from "react-router-dom";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.removeItem("isAdmin");
    navigate("/login", { replace: true });
  };

  return (
    <div className="dashboard">
      <aside className="sidebar">
        <Link to="/" className="sidebar-logo">
          <h2>Donatella</h2>
        </Link>

        <NavLink to="products">Products</NavLink>
        <button type="button" className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="dashboard-content">
        <Outlet />
      </main>
    </div>
  );
}

export default Dashboard;
