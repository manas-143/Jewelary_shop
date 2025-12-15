import axios from "axios";

export const addProduct = async (productData) => {
  try {
    const res = await axios.post(
      "http://localhost:8080/api/products",
      productData
    );
    console.log("Product added successfully:", res);
    return res.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};

export const getProducts = async () => {
  try {
    const res = await axios.get("http://localhost:8080/api/products");
    return res.data;
  } catch (error) {
    console.error("Error adding product:", error);
    throw error;
  }
};
