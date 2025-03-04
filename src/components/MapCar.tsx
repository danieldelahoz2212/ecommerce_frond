import React, { useEffect, useState } from "react";
import axios from "axios";

interface Order {
  id: number;
  totalPrice: number;
  statusOrder: number;
  payment: string;
}

export const MapCar: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token || !storedUser)
          throw new Error("No hay token o usuario disponible");

        const parsedUser = JSON.parse(storedUser);
        const userId = parsedUser.id;

        if (!userId) throw new Error("No se pudo obtener el ID del usuario");

        const response = await axios.get(
          `http://localhost:8000/api/order/${userId}`,
          {
            headers: { token },
          }
        );

        console.log("Respuesta del servidor:", response.data);

        if (!response.data || !response.data.orders) {
          throw new Error("La respuesta de la API no contiene pedidos");
        }

        setOrders(response.data.orders || []);
      } catch (err) {
        setError("Error al obtener los pedidos");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Lista de Pedidos</h2>

      {loading && <p>Cargando pedidos...</p>}
      {error && <div className="alert alert-danger">{error}</div>}

      <ul className="list-group">
        {orders.length > 0 ? (
          orders.map((order) => (
            <li key={order.id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5>Pedido #{order.id}</h5>
                  <p>Total: ${order.totalPrice}</p>
                  <p>
                    Estado:{" "}
                    {order.statusOrder === 1 ? "Pendiente" : "Completado"}
                  </p>
                  <p>Pago: {order.payment}</p>
                </div>
                <button className="btn btn-primary">Ver Detalles</button>
              </div>
            </li>
          ))
        ) : (
          <p className="text-center text-muted">No tienes pedidos aún.</p>
        )}
      </ul>
    </div>
  );
};
