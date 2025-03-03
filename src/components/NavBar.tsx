
export const NavBar = () => {
  return (
    <nav className="navbar navbar-expand-lg bg-primary navbar-dark">
      <div className="container-fluid">
        <a href="#" className="navbar-brand">
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
            <li className="nav-item">
                <a href="/" className="nav-link active">Inicio</a>
            </li>
            <li className="nav-item">
                <a href="/products" className="nav-link active">Productos</a>
            </li>
            <li className="nav-item">
                <a href="#" className="nav-link active">Carro</a>
            </li>
            <li className="nav-item">
                <a href="/Perfil" className="nav-link active">Perfil</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
