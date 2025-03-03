import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { MapProducts } from "../components/MapProducts";
import { AddProduct } from "../components/AddProduct";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: number;
  stock: number;
  img?: string;
}

export const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  }, [navigate]);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    setError(null);

    const token = localStorage.getItem("token");
    if (!token) {
      setError("No tienes autorización para ver los productos.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get("http://localhost:8000/api/products", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("API Response:", response.data);
      setProducts(response.data.products || []);
    } catch (error) {
      console.error("Error al obtener productos", error);
      setError("No se pudieron cargar los productos.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4 text-2xl font-bold">Productos</h2>
      <AddProduct
        onProductAdded={() => fetchProducts()}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
      />

      {error && <p className="text-center text-danger">{error}</p>}
      {loading ? (
        <p className="text-center text-secondary">Cargando productos...</p>
      ) : (
        <MapProducts
          products={products}
          fetchProducts={fetchProducts}
          setEditingProduct={setEditingProduct}
        />
      )}
    </div>
  );
};
