import { useEffect, useState } from "react";
import "./Landing.css";
import { getProducts } from "../services/addProduct";

function Landing() {
  const [isLoading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);

  const onFetchProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    onFetchProducts();
  }, []);

  return (
    <div className="landing">
      <h1>Welcome to the Jewelry Shop</h1>
      <p>Manage products, inventory, and billing — all in one place.</p>
    </div>
  );
}

export default Landing;
