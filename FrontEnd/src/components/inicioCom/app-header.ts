import { goTo } from "../../core/router";
import { getState } from "../../core/state";
import { globalStyles } from "../perfilcom/constants";

export class AppHeader extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.shadowRoot!.innerHTML = `
      <style>
        ${globalStyles}
        header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background-color: var(--white);
          box-shadow: 0 2px 10px rgba(0,0,0,0.05);
          position: sticky;
          top: 0;
          z-index: 10;
        }
        .logo { font-size: 1.3rem; font-weight: 900; color: var(--accent); cursor: pointer; }
        .profile-btn { 
          background: var(--light-bg); 
          border: none; 
          border-radius: 50%; 
          width: 40px; height: 40px; 
          display: flex; align-items: center; justify-content: center; 
          cursor: pointer; transition: transform 0.2s;
        }
        .profile-btn:active { transform: scale(0.9); }
        svg { width: 24px; height: 24px; color: var(--text-dark); }
      </style>
      <header>
        <div class="logo" id="home-link">PetFinder</div>
        <button class="profile-btn" id="profile-link">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </button>
      </header>
    `;

    this.shadowRoot!.querySelector("#profile-link")?.addEventListener(
      "click",
      () => {
        const state = getState();

        if (state.isAuthenticated) {
          // Si está logueado, va a la vista de edición (user-profile-header)
          // IMPORTANTE: Asegúrate de que esta ruta esté definida en tu router.ts
          goTo("/editar-perfil");
        } else {
          // Si no está logueado, va a la vista de perfil (perfil.ts) para iniciar sesión
          goTo("/perfil");
        }
      },
    );

    this.shadowRoot!.querySelector("#home-link")?.addEventListener(
      "click",
      () => goTo("/"),
    );
  }
}
customElements.define("app-header", AppHeader);
