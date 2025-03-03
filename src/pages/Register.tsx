import { useState } from "react";
import axios from "axios";
import { Notification } from "../components/Notifi";

export const Register = () => {
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [notifi, setNotifi] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/users/", {
        name,
        lastName,
        email,
        password,
        rol: 2,
      });

      setNotifi({ msg: "Registro exitoso", type: "success" });

      setName("");
      setLastName("");
      setEmail("");
      setPassword("");

      setTimeout(() => setNotifi(null), 3000);
    } catch (error) {
      console.error(error);

      setNotifi({
        msg: "No se pudo registrar el usuario",
        type: "error",
      });

      setTimeout(() => setNotifi(null), 3000);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ width: "22rem" }}>
        <h2 className="text-center mb-4">Registro</h2>
        {notifi && <Notification msg={notifi.msg} type={notifi.type} />}
        <form className="container-fluid" onSubmit={handleSubmit}>
          <div className="row g-2 mb-3">
            <div className="col-6">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="col-6">
              <input
                type="text"
                className="form-control"
                placeholder="Last name"
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mb-3">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <input
              type={showPassword ? "text" : "password"}
              className="form-control"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="showPassword"
              onChange={() => setShowPassword(!showPassword)}
            />
            <label className="form-check-label ms-2" htmlFor="showPassword">
              Ver contraseña
            </label>
          </div>
          <button type="submit" className="btn btn-primary w-100">
            Registrar
          </button>
          <p className="text-center mt-3">
            <a href="/login" className="text-decoration-none">
              ¿Ya tienes una cuenta?
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};
