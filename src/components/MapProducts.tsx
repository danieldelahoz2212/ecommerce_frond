import React, { useState } from "react";
import axios from "axios";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: number;
  stock: number;
  img?: string;
  amount?: number;
}

interface Props {
  products: Product[];
  fetchProducts: () => void;
  setEditingProduct: (product: Product | null) => void;
  userRole: number | null;
}

export const MapProducts: React.FC<Props> = ({
  products,
  fetchProducts,
  setEditingProduct,
  userRole,
}) => {
  const [, setCart] = useState<Product[]>([]);
  const [loading, setLoading] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item.id === product.id);

      let updatedCart;
      if (existingProduct) {
        updatedCart = prevCart.map((item) =>
          item.id === product.id ? { ...item, amount: (item.amount || 0) + 1 } : item
        );
      } else {
        updatedCart = [...prevCart, { ...product, amount: 1 }];
      }

      const storedUser = localStorage.getItem("user");
      const parsedUser = storedUser ? JSON.parse(storedUser) : null;
      const idUser = parsedUser?.id || null;

      const cartJSON = {
        idUser,
        products: updatedCart.map(({ id, price, amount }) => ({
          id,
          amount,
          price,
        })),
        payment: "comprobante",
      };

      localStorage.setItem("cart", JSON.stringify(cartJSON));
      return updatedCart;
    });
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que quieres eliminar este producto?"))
      return;

    setLoading(id);
    setError(null);

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No hay token disponible");

      await axios.delete(`http://localhost:8000/api/products/${id}`, {
        headers: { token: `${token}` },
      });

      console.log("Producto eliminado correctamente.");
      fetchProducts();
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      setError("Error al eliminar el producto.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="container mt-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm">
              <img
                src={product.img || "/placeholder.jpg"}
                alt={product.name}
                className="card-img-top"
                style={{ height: "250px", objectFit: "cover" }}
              />
              <div className="card-body text-center">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text">{product.description}</p>
                <p className="card-text">Cantidad disponible: {product.stock}</p>
                <p className="card-text fw-bold">${product.price}</p>
                {product.stock > 0 ? (
                  <button
                    className="btn btn-dark w-100 mb-2"
                    onClick={() => handleAddToCart(product)}
                  >
                    Añadir al carrito
                  </button>
                ) : (
                  <button className="btn btn-secondary w-100 mb-2" disabled>
                    Agotado
                  </button>
                )}
                {(userRole === 1 || userRole === 3) && (
                  <>
                    <button
                      className="btn btn-success w-100 mb-2"
                      onClick={() => setEditingProduct(product)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-danger w-100"
                      onClick={() => handleDeleteProduct(product.id)}
                      disabled={loading === product.id}
                    >
                      {loading === product.id ? "Eliminando..." : "Eliminar"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};