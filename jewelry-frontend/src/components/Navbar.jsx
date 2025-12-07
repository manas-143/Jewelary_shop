import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <h2 className="logo">💎 Jewelry Shop</h2>
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/add-product">Add Product</Link>
        <Link to="/inventory">Inventory</Link>
        <Link to="/billing">Billing</Link>
      </div>
    </nav>
  );
}

export default Navbar;
