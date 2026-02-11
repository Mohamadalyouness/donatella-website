import { NavLink, Outlet } from "react-router-dom";
import "./Items.css";

function Items() {
  return (
    <div className="items-page">
      <nav className="items-nav">
        <NavLink to="chocolate" end>
          Chocolate
        </NavLink>
        <NavLink to="powder">
          Powder
        </NavLink>
        <NavLink to="others">
          Others
        </NavLink>
      </nav>
      <Outlet />
    </div>
  );
}

export default Items;
