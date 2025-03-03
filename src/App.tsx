import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { NavBar } from "./components/NavBar";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Perfil } from "./pages/Perfil";
import { Products } from "./pages/Products";
import { Car } from "./pages/Car";

function App() {
  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/perfil" element={<Perfil />} />
        <Route path="/products" element={<Products />} />
        <Route path="/car" element={<Car />} />
      </Routes>
    </Router>
  );
}

export default App;
