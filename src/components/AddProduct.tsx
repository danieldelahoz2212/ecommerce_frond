import { useState, useEffect } from "react";
import axios from "axios";
import { Notification } from "../components/Notifi";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: number;
  stock: number;
  img?: string;
}

export const AddProduct = ({
  onProductAdded,
  editingProduct,
  setEditingProduct,
}: {
  onProductAdded: () => void;
  editingProduct: Product | null;
  setEditingProduct: (product: Product | null) => void;
}) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState<number | "">("");
  const [category, setCategory] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [img, setImg] = useState("");
  const [categories, setCategories] = useState<{ id: number; name: string }[]>(
    []
  );
  const [notifi, setNotifi] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setPrice(editingProduct.price);
      setCategory(editingProduct.category);
      setStock(editingProduct.stock);
      setImg(editingProduct.img || "");
    } else {
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setStock("");
      setImg("");
    }
  }, [editingProduct]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/category/");
        setCategories(data.categorys);
      } catch (error) {
        console.error("Error al obtener categorías", error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) {
      setNotifi({ msg: "No estás autenticado", type: "error" });
      return;
    }

    try {
      if (editingProduct) {
        await axios.patch(
          `http://localhost:8000/api/products/${editingProduct.id}`,
          {
            name,
            description,
            price: Number(price),
            category: Number(category),
            stock: Number(stock),
            img,
          },
          {
            headers: { token },
          }
        );
        setNotifi({ msg: "Producto editado correctamente", type: "success" });
      } else {
        await axios.post(
          "http://localhost:8000/api/products",
          {
            name,
            description,
            price: Number(price),
            category: Number(category),
            stock: Number(stock),
            img,
          },
          {
            headers: { token },
          }
        );
        setNotifi({ msg: "Producto agregado correctamente", type: "success" });
      }

      setEditingProduct(null);
      setName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setStock("");
      setImg("");

      setTimeout(() => setNotifi(null), 3000);
      onProductAdded();
    } catch (error) {
      console.error("Error al agregar/editar producto", error);
      setNotifi({ msg: "No se pudo procesar la solicitud", type: "error" });
      setTimeout(() => setNotifi(null), 3000);
    }
  };

  return (
    <div className="card p-4 shadow-sm mb-4">
      <h3 className="text-center">
        {editingProduct ? "Editar Producto" : "Agregar Producto"}
      </h3>
      {notifi && <Notification msg={notifi.msg} type={notifi.type} />}
      <form className="container-fluid" onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <textarea
            className="form-control"
            placeholder="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="row g-2 mb-3">
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Precio"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value === "" ? "" : Number(e.target.value))
              }
              required
            />
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Stock"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value === "" ? "" : Number(e.target.value))
              }
              required
            />
          </div>
        </div>
        <div className="mb-3">
          <select
            value={category}
            onChange={(e) => setCategory(Number(e.target.value))}
            className="form-select"
            required
          >
            <option value="">Selecciona una categoría</option>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))
            ) : (
              <option value="">Cargando categorías...</option>
            )}
          </select>
        </div>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Imagen (URL opcional)"
            value={img}
            onChange={(e) => setImg(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          {editingProduct ? "Editar Producto" : "Agregar Producto"}
        </button>
      </form>
    </div>
  );
};
