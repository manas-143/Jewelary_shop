import { useEffect, useState } from "react";

function Inventory() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
  }, []);

  return (
    <div className="container">
      <h2>Inventory</h2>

      <table border="1" className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Weight</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.weight}</td>
              <td>₹{p.price}</td>
              <td>{p.stock}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
