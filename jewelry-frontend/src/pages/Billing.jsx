import { useState, useEffect } from "react";

function Billing() {
  const [products, setProducts] = useState([]);
  const [selected, setSelected] = useState(null);
  const [qty, setQty] = useState(1);
  const [bill, setBill] = useState([]);

  useEffect(() => {
    setProducts(JSON.parse(localStorage.getItem("products") || "[]"));
  }, []);

  const addToBill = () => {
    if (!selected) return;

    setBill([
      ...bill,
      {
        name: selected.name,
        qty,
        price: selected.price,
        total: qty * selected.price,
      },
    ]);
  };

  const totalAmount = bill.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="container">
      <h2>Billing</h2>

      <select onChange={(e) => setSelected(products.find(p => p.id == e.target.value))}>
        <option>Select Product</option>
        {products.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>

      <input
        type="number"
        placeholder="Qty"
        value={qty}
        onChange={(e) => setQty(e.target.value)}
      />

      <button className="btn" onClick={addToBill}>Add to Bill</button>

      <h3>Bill Details</h3>
      <ul>
        {bill.map((item, i) => (
          <li key={i}>{item.name} × {item.qty} = ₹{item.total}</li>
        ))}
      </ul>

      <h2>Total: ₹{totalAmount}</h2>
    </div>
  );
}

export default Billing;
