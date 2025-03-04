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
  const [userRoleId, setUserRoleId] = useState<number | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      navigate("/login");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUserRoleId(parsedUser.rol);
      fetchUserRole(parsedUser.rol, token);
    } catch (error) {
      console.error("Error al parsear el usuario:", error);
      setUserRoleId(null);
      setUserRole(null);
    }
  }, [navigate]);

  const fetchUserRole = async (roleId: number, token: string) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users/rol/${roleId}`, {
        headers: { token },
      });

      setUserRole(response.data.rol);
    } catch (error) {
      console.error("Error al obtener el rol del usuario:", error);
      setUserRole(null);
    }
  };

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
        headers: { Authorization: `Bearer ${token}` },
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

      {userRoleId !== null && (userRoleId === 1 || userRoleId === 3) && (
        <AddProduct
          onProductAdded={fetchProducts}
          editingProduct={editingProduct}
          setEditingProduct={setEditingProduct}
        />
      )}

      <p className="text-center">
        <strong>Rol:</strong>{" "}
        <span className={`badge ${userRole === "admin" ? "bg-success" : "bg-secondary"}`}>
          {userRole ?? "Cargando..."}
        </span>
      </p>

      {error && <p className="text-center text-danger">{error}</p>}
      {loading ? (
        <p className="text-center text-secondary">Cargando productos...</p>
      ) : (
        <MapProducts
          products={products}
          fetchProducts={fetchProducts}
          setEditingProduct={setEditingProduct}
          userRole={userRoleId}
        />
      )}
    </div>
  );
};
