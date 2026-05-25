import "../views/home-view";
import "../views/formLogin";
import "../views/formRegister";
import "../views/perfil";
import "../views/adoptar-view";
import "../views/user-profile-header";

let currentContainer: HTMLElement | null = null;

const rutasArray = [
  {
    path: /^\/$/,
    accionFun: () => document.createElement("home-view"),
  },
  {
    path: /^\/login$/,
    accionFun: () => document.createElement("user-login-form"),
  },
  {
    path: /^\/register$/,
    accionFun: () => document.createElement("user-registration-form"),
  },
  {
    path: /^\/perfil$/,
    accionFun: () => document.createElement("profile-view"),
  },
  {
    path: /^\/adoptar$/,
    accionFun: () => document.createElement("adoptar-view"),
  },
  {
    path: /^\/editar-perfil$/,
    accionFun: () => document.createElement("user-profile-header"),
  },
];

function handlerRoute(ruta: string) {
  if (!currentContainer) {
    console.error(
      "Router Error: No se encontró el contenedor de la aplicación.",
    );
    return;
  }
  // Normalizamos: quitamos barra final y nos aseguramos de que empiece con /
  const normalizedPath = ruta.replace(/\/$/, "") || "/";

  const route = rutasArray.find((r) => r.path.test(normalizedPath));

  if (route) {
    currentContainer.innerHTML = "";
    currentContainer.appendChild(route.accionFun());
  } else {
    currentContainer.innerHTML = "<h2>404 - Página no encontrada</h2>";
  }
}

/**
 * Definición de las rutas y sus componentes asociados.
 */
export function router(contenedor: HTMLElement) {
  currentContainer = contenedor;

  window.addEventListener("popstate", () => {
    handlerRoute(location.pathname);
  });

  handlerRoute(location.pathname);
}

export function goTo(path: string) {
  history.pushState({}, "", path);
  handlerRoute(path);
}
