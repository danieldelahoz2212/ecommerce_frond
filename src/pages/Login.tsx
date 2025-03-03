import axios from "axios";
import React, { useState, useEffect } from "react";
import { Notification } from "../components/Notifi";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notifi, setNotifi] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/perfil");
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:8000/api/users/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setNotifi({ msg: "Inicio de sesión exitoso", type: "success" });

      setTimeout(() => {
        window.location.reload();
        navigate("/perfil");
      }, 1000);

      setEmail("");
      setPassword("");
    } catch (error) {
      console.error(error);
      setNotifi({ msg: "Error al iniciar sesión", type: "error" });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "22rem" }}>
        <h2 className="text-center mb-4">Inicio de Sesión</h2>
        {notifi && <Notification msg={notifi.msg} type={notifi.type} />}
        <form className="container-fluid" onSubmit={handleSubmit}>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="flexCheckDefault"
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="form-check-label ms-2" htmlFor="flexCheckDefault">
              Ver contraseña
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Iniciar Sesión
          </button>
          <p className="text-center mt-3">
            <a href="/register" className="text-decoration-none">
              ¿No tienes una cuenta?
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};
