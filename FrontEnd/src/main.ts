import { router } from "./core/router";

// Registro de Componentes Globales
import "./components/inicioCom/app-header";
import "./components/inicioCom/pet-card";
import "./components/inicioCom/app-pagination";
import "./components/inicioCom/map-section";
import "./components/inicioCom/bottom-nav";

// Registro de Vistas
import "./views/home-view";
import "./views/perfil";
import "./views/formLogin";
import "./views/formRegister";
import "./views/adoptar-view";

document.addEventListener("DOMContentLoaded", () => {
  const rootElement = document.getElementById("root");
  if (rootElement) {
     router(rootElement);
  }
});
