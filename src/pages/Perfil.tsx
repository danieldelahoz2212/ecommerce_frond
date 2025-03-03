import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  lastName: string;
  email: string;
  rol: number;
}

export const Perfil = () => {
  const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const token = localStorage.getItem("token");
        const storedUser = localStorage.getItem("user");

        if (!token) {
          console.error("No hay token disponible");
          return;
        }

        let userId: number | null = null;
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);
          userId = parsedUser.id;
        }

        if (!userId) {
          console.error("No se encontró el ID del usuario");
          return;
        }

        const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error al obtener datos");

        const data = await response.json();
        setUser(data);

        localStorage.setItem("user", JSON.stringify(data));
      } catch (error) {
        console.error("Error al obtener perfil:", error);
      }
    };

    fetchPerfil();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (!user) return <p>Cargando perfil...</p>;

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-3">Perfil de {user?.name} {user?.lastName}</h2>
        <p>
          <strong>Correo electrónico:</strong> {user?.email}
        </p>
        <p>
          <strong>Rol:</strong>{" "}
          <span className={`badge ${user?.rol === 1 ? "bg-success" : "bg-secondary"}`}>
            {user?.rol === 1 ? "Administrador" : "Usuario"}
          </span>
        </p>
        <div className="text-center mt-3">
          <button className="btn btn-danger px-4" onClick={handleLogout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
};
