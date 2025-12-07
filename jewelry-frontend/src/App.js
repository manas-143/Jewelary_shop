import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Landing from "./pages/Landing";
import AddProduct from "./pages/AddProduct";
import Inventory from "./pages/Inventory";
import Billing from "./pages/Billing";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/billing" element={<Billing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
