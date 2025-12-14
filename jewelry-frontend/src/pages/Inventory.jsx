import { useEffect, useState } from "react";
import axios from "axios";

function Inventory() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editedProduct, setEditedProduct] = useState(null);

  const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8080";

  useEffect(() => {

    async function fetchProducts() {
      setLoading(true);
      setError(null);

      try {
        const res = await axios.get(`${API_BASE}/api/products`);
        const data = Array.isArray(res.data) ? res.data : [];
        setProducts(data);
        // persist for other pages that read from localStorage
        try { localStorage.setItem("products", JSON.stringify(data)); } catch (e) { /* ignore */ }
      } catch (err) {
        // fallback: try to load from localStorage
        const cached = JSON.parse(localStorage.getItem("products") || "[]");
        if (cached && cached.length) {
          setProducts(cached);
        }
        setError(err.message || "Failed to fetch products");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="container">
      <h2>Inventory</h2>

      {loading && <p>Loading products...</p>}
      {error && (
        <p style={{ color: "red" }}>Error fetching products: {error}</p>
      )}

      <table border="1" className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Weight</th>
            <th>Price</th>
            <th>Carat</th>
            <th>Barcode</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {products.length === 0 && !loading ? (
            <tr>
              <td colSpan={7}>No products available</td>
            </tr>
          ) : (
            products.map((p) => {
              const isEditing = editingId === p.id;
              return (
                <tr key={p.id}>
                  <td>
                    {isEditing ? (
                      <input
                        value={editedProduct.name}
                        onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                      />
                    ) : (
                      p.name
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        value={editedProduct.category}
                        onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                      />
                    ) : (
                      p.category
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedProduct.gram}
                        onChange={(e) => setEditedProduct({ ...editedProduct, gram: parseFloat(e.target.value || 0) })}
                      />
                    ) : (
                      p.gram
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedProduct.price}
                        onChange={(e) => setEditedProduct({ ...editedProduct, price: parseFloat(e.target.value || 0) })}
                      />
                    ) : (
                      `₹${p.price}`
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        value={editedProduct.carat}
                        onChange={(e) => setEditedProduct({ ...editedProduct, carat: parseInt(e.target.value || 0) })}
                      />
                    ) : (
                      p.carat
                    )}
                  </td>
                  <td>
                    {p.barcodeImagePath ? (
                      (() => {
                        const filename = p.barcodeImagePath.split('/').pop();
                        const url = `${API_BASE}/barcodes/${filename}`;
                        return (
                          <img
                            src={url}
                            alt={`barcode-${p.id}`}
                            style={{ maxWidth: 140, height: 'auto' }}
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        );
                      })()
                    ) : (
                      <span>No barcode</span>
                    )}
                  </td>
                  <td>
                    {isEditing ? (
                      <>
                        <button
                          onClick={async () => {
                            try {
                              const res = await axios.put(`${API_BASE}/api/products/${p.id}`, editedProduct);
                              // update local state
                              setProducts(products.map((x) => (x.id === p.id ? res.data : x)));
                              setEditingId(null);
                              setEditedProduct(null);
                            } catch (err) {
                              alert('Failed to save: ' + (err.response?.data?.message || err.message));
                            }
                          }}
                        >
                          Save
                        </button>
                        <button
                          onClick={() => { setEditingId(null); setEditedProduct(null); }}
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => { setEditingId(p.id); setEditedProduct({ ...p }); }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={async () => {
                            if (!window.confirm('Delete this product?')) return;
                            try {
                              await axios.delete(`${API_BASE}/api/products/${p.id}`);
                              setProducts(products.filter((x) => x.id !== p.id));
                            } catch (err) {
                              alert('Failed to delete: ' + (err.response?.data?.message || err.message));
                            }
                          }}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Inventory;
