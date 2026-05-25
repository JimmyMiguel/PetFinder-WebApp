import { globalStyles, Icons } from "../components/perfilcom/constants";
import { getState, setUser, initializeState } from "../core/state";
import "../components/inicioCom/app-header";
import "../components/inicioCom/bottom-nav";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export class UserProfileHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    initializeState(); // Asegura que los datos del usuario se carguen de localStorage
    this.render();
    this.setupListeners();
  }

  private render() {
    const user = getState().user;
    const avatarUrl =
      user?.profile_picture || "https://placehold.co/100x100?text=User";

    this.shadowRoot!.innerHTML = `
      <style>
        ${globalStyles}
        :host { display: block; min-height: 100vh; padding-bottom: 100px; }
        .header-container { display: flex; flex-direction: column; align-items: center; padding: 20px; margin-top: 20px; }
        .avatar-section { position: relative; margin-bottom: 20px; }
        .avatar-img { width: 120px; height: 120px; border-radius: 50%; object-fit: cover; border: 4px solid var(--accent); }
        .photo-edit-label { 
          position: absolute; bottom: 0; right: 0; background: var(--accent); 
          border-radius: 50%; width: 35px; height: 35px; 
          display: flex; align-items: center; justify-content: center; cursor: pointer; color: white;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        #file-input { display: none; }
        .info-form { width: 100%; max-width: 350px; display: flex; flex-direction: column; gap: 20px; }
        .input-group { display: flex; flex-direction: column; gap: 8px; }
        .input-group label { font-size: 0.75rem; font-weight: 800; text-transform: uppercase; color: var(--text-dark); margin-left: 10px; }
        input { padding: 14px; border-radius: 16px; border: none; background: var(--light-bg); font-weight: 600; font-size: 1rem; }
        .save-btn { 
          background: var(--accent); color: white; border: none; padding: 15px; 
          border-radius: 25px; font-weight: 800; cursor: pointer; margin-top: 10px;
          box-shadow: 0 6px 15px rgba(255, 148, 102, 0.3);
        }
      </style>
      <app-header></app-header>
      <div class="header-container">
        <h2>Mi Perfil</h2>
        <div class="avatar-section">
          <img src="${avatarUrl}" class="avatar-img" id="avatar-preview">
          <label for="file-input" class="photo-edit-label">${Icons.camera}</label>
          <input type="file" id="file-input" accept="image/*">
        </div>

        <div class="info-form">
          <div class="input-group">
            <label>Nombre Completo</label>
            <input type="text" id="user-name" value="${user?.name || ""}">
          </div>
          <div class="input-group">
            <label>Nueva Contraseña</label>
            <input type="password" id="user-pass" placeholder="••••••••">
          </div>
          <button class="save-btn" id="save-info">Guardar Cambios</button>
        </div>
      </div>
      <bottom-nav></bottom-nav>
    `;
  }

  private setupListeners() {
    const root = this.shadowRoot!;
    const fileInput = root.querySelector("#file-input") as HTMLInputElement;
    const saveBtn = root.querySelector("#save-info");

    // Lógica para subir foto de perfil
    fileInput.addEventListener("change", async () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append("avatar", file);

      const currentState = getState();
      if (!currentState.token || !currentState.user) return;

      try {
        const res = await fetch(
          `${API}/user/profile/${currentState.user.id}/avatar`,
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${currentState.token}` },
            body: formData,
          },
        );

        if (res.ok) {
          const data = await res.json();
          (root.querySelector("#avatar-preview") as HTMLImageElement).src =
            data.url;
          setUser(
            { ...currentState.user, profile_picture: data.url },
            currentState.token,
          );
          alert("¡Foto actualizada!");
        }
      } catch (err) {
        console.error("Error subiendo avatar:", err);
      }
    });

    // Lógica para guardar nombre y password
    saveBtn?.addEventListener("click", async () => {
      const name = (root.querySelector("#user-name") as HTMLInputElement).value;
      const password = (root.querySelector("#user-pass") as HTMLInputElement)
        .value;

      const currentState = getState();
      if (!currentState.token || !currentState.user) return;

      try {
        const res = await fetch(`${API}/user/profile`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentState.token}`,
          },
          body: JSON.stringify({ name, password }),
        });

        const data = await res.json();

        if (res.ok) {
          setUser({ ...currentState.user, name }, currentState.token);
          alert("¡Perfil actualizado con éxito!");
        } else {
          alert(data.error || "Error al actualizar");
        }
      } catch (err) {
        console.error("Error en el update:", err);
      }
    });
  }
}
customElements.define("user-profile-header", UserProfileHeader);
