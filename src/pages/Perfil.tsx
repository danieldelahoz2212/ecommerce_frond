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
  const [userRole, setUserRole] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPerfil = async () => {
      const token = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (!token) {
        console.error("No hay token disponible");
        navigate("/login");
        return;
      }

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser) as User;
          setUser(parsedUser);

          fetchUserRole(parsedUser.rol, token);
          return;
        } catch (error) {
          console.error("Error al parsear el usuario almacenado:", error);
          localStorage.removeItem("user");
        }
      }

      try {
        const response = await fetch(`http://localhost:8000/api/user`, {
          headers: { token },
        });

        if (!response.ok) throw new Error("Error al obtener datos");

        const data = await response.json();
        setUser(data);
        localStorage.setItem("user", JSON.stringify(data));

        fetchUserRole(data.rol, token);
      } catch (error) {
        console.error("Error al obtener perfil:", error);
        navigate("/login");
      }
    };

    const fetchUserRole = async (roleId: number, token: string) => {
      try {
        const response = await fetch(
          `http://localhost:8000/api/rol/${roleId}`,
          {
            headers: { token },
          }
        );

        if (!response.ok) throw new Error("Error al obtener el rol");

        const roleData = await response.json();
        setUserRole(roleData.rol);
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
      }
    };

    fetchPerfil();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  if (!user) return <p className="text-center mt-5">Cargando perfil...</p>;

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div
        className="card p-4 shadow-lg"
        style={{ maxWidth: "500px", width: "100%" }}
      >
        <h2 className="text-center mb-3">
          Perfil de {user.name} {user.lastName}
        </h2>
        <p>
          <strong>Correo electrónico:</strong> {user.email}
        </p>
        <p>
          <strong>Rol:</strong>{" "}
          <span
            className={`badge ${
              userRole === "admin" ? "bg-success" : "bg-secondary"
            }`}
          >
            {userRole ?? "Cargando..."}
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
