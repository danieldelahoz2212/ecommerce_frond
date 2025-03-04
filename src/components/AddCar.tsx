import React, { useState, useEffect } from "react";
import axios from "axios";

export const AddCar: React.FC = () => {
  const [cart, setCart] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");
    if (!cart) {
      setError("No hay productos en el carrito.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log("Contenido del carrito:", cart);
      const response = await axios.post("http://localhost:8000/api/order", cart,
        {
            headers: { token },
          }
      );
      console.log("Pedido enviado:", response.data);

      localStorage.removeItem("cart");
      setCart(null);
    } catch (err) {
      setError("Error al enviar el pedido. Intenta nuevamente.");
      console.error("Error al enviar el pedido:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCart = () => {
    localStorage.removeItem("cart");
    setCart(null);
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg p-4">
        <div className="card-body">
          <h2 className="mb-4">Pedido</h2>

          {error && <div className="alert alert-danger">{error}</div>}

          {cart ? (
            <>
              <p className="bg-light p-3 rounded">Cantidad de productos en el carrito: {cart.products.length}</p>
              <button
                className="btn btn-primary w-100 mt-3"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  "Realizar Pedido"
                )}
              </button>
              <button
                className="btn btn-danger w-100 mt-3"
                onClick={handleClearCart}
                disabled={loading}
              >
                Eliminar Pedido
              </button>
            </>
          ) : (
            <div className="alert alert-warning">No hay productos en el carrito.</div>
          )}
        </div>
      </div>
    </div>
  );
};