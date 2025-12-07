import { useState } from "react";
import "./AddProduct.css";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    gram: "",
    crat: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProduct = () => {
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    products.push({ ...form, id: Date.now() });
    localStorage.setItem("products", JSON.stringify(products));
    alert("Product Added!");
  };

  return (
    <div className="full-screen">
      <div className="form-box">
        <h2>Add Product</h2>

        {/* DROPDOWN CATEGORY */}
        <select
          name="category"
          onChange={handleChange}
          className="dropdown"
        >
          <option value="">Select Category</option>
          <option value="Ladies Ring">Ladies Ring</option>
          <option value="Gents Ring">Gents Ring</option>
          <option value="Earring">Earring</option>
          <option value="Tops">Tops</option>
          <option value="Chain">Chain</option>
          <option value="Rani Hara">Rani Hara</option>
          <option value="Bangals">Bangals</option>
          <option value="Mangalsutra">Mangalsutra</option>
          <option value="Chika Hara">Chika Hara</option>
        </select>

        <input 
          name="gram" 
          placeholder="GRAM (Weight)" 
          onChange={handleChange} 
        />

        <input 
          name="crat" 
          placeholder="CRAT" 
          onChange={handleChange} 
        />

        <input 
          name="price" 
          placeholder="PRICE" 
          onChange={handleChange} 
        />

        <button onClick={saveProduct} className="btn">
          Save
        </button>
      </div>
    </div>
  );
}

export default AddProduct;
