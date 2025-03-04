import React from "react";
import { AddCar } from "../components/AddCar";
import { MapCar } from "../components/MapCar";

export const Car: React.FC = () => {
  return (
    <div className="container mt-4">
      <h1>Mis Pedidos</h1>
      <AddCar/>
      <MapCar />
    </div>
  );
};
