import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const NavBar = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-primary navbar-dark">
      <div className="container-fluid">
        <a href="/" className="navbar-brand">
          Ecommerce
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNavAltMarkup"
          aria-controls="navbarNavAltMarkup"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <a href="/" className="nav-link active">Inicio</a>
                </li>
                <li className="nav-item">
                  <a href="/products" className="nav-link active">Productos</a>
                </li>
                <li className="nav-item">
                  <a href="/car" className="nav-link active">Carro</a>
                </li>
                <li className="nav-item">
                  <a href="/perfil" className="nav-link active">Perfil</a>
                </li>
                <li className="nav-item">
                  <button className="btn btn-danger ms-2" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <a href="/login" className="nav-link active">Iniciar sesión</a>
                </li>
                <li className="nav-item">
                  <a href="/register" className="nav-link active">Registrarse</a>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};
