import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AddProduct.css";
import { addProduct } from "../services/addProduct";

function AddProduct() {
  const [form, setForm] = useState({
    name: "",
    category: "",
    gram: "",
    carat: "",
    price: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState(null);

  const validate = () => {
    if (!form.name || form.name.trim() === "") return "Please enter product name";
    if (!form.category || form.category.trim() === "") return "Please select a category";
    if (!form.gram || isNaN(Number(form.gram))) return "Please provide a valid weight in grams";
    if (!form.carat || isNaN(Number(form.carat))) return "Please provide carat";
    if (!form.price || isNaN(Number(form.price))) return "Please provide price";
    return null;
  };

  const onSaveClick = () => {
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError(null);
    setShowConfirm(true);
  };

  const onConfirm = async () => {
    setSaving(true);
    try {
      await addProduct({
        name: form.name,
        category: form.category,
        gram: Number(form.gram),
        carat: Number(form.carat),
        price: Number(form.price),
      });
      setShowConfirm(false);
      // go back to previous page (inventory or landing)
      navigate(-1);
    } catch (err) {
      setFormError('Failed to add product: ' + (err.message || 'unknown'));
    } finally {
      setSaving(false);
    }
  };

  const onCancelConfirm = () => {
    setShowConfirm(false);
    navigate(-1);
  };

  return (
    <div className="full-screen">
      <div className="form-box">
        <h2>Add Product</h2>

        {/* PRODUCT NAME */}
        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
        />

        {/* DROPDOWN CATEGORY */}
        <select name="category" value={form.category} onChange={handleChange} className="dropdown">
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
          placeholder="Weight (grams)"
          type="number"
          value={form.gram}
          onChange={handleChange}
        />

        <input name="carat" placeholder="Carat" type="number" value={form.carat} onChange={handleChange} />

        <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} />

        {formError && <div style={{ color: 'red', marginBottom: 8 }}>{formError}</div>}

        <button onClick={onSaveClick} className="btn" disabled={saving}>
          {saving ? 'Saving...' : 'Save'}
        </button>

        {showConfirm && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.35)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: 'white', padding: 20, borderRadius: 8, width: 420, maxWidth: '90%' }}>
              <h3 style={{ marginTop: 0 }}>Confirm Add Product</h3>
              <p>Are you sure you want to add <strong>{form.name}</strong> to inventory?</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end', marginTop: 12 }}>
                <button className="btn" style={{ background: '#6c757d' }} onClick={onCancelConfirm} disabled={saving}>Cancel</button>
                <button className="btn" style={{ background: '#198754' }} onClick={onConfirm} disabled={saving}>{saving ? 'Saving...' : 'Confirm'}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddProduct;
