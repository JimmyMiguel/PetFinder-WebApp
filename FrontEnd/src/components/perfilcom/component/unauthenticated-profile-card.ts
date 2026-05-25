import { globalStyles, Icons } from "../constants";
import "./primary-button"; // Importamos el botón para asegurar que exista
import { goTo } from "../../../core/router";

export class UnauthenticatedProfileCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <style>
        ${globalStyles}
        .card { background-color: var(--card-bg); border-radius: 30px; padding: 30px 20px; text-align: center; position: relative; overflow: hidden; margin: 20px; }
        .icon-wrapper { width: 60px; height: 60px; background-color: #f2dcd0; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: #a67c52; }
        h2 { font-size: 1.4rem; font-weight: 800; margin-bottom: 10px; line-height: 1.2; }
        p { font-size: 0.9rem; color: var(--text-light); font-weight: 600; margin-bottom: 25px; line-height: 1.4; }
        .action-buttons { display: flex; flex-direction: column; gap: 12px; }
        .btn-secondary { background-color: transparent; color: var(--text-dark); padding: 12px 20px; border-radius: 20px; font-weight: 700; font-size: 0.95rem; transition: background-color 0.2s, transform 0.1s; }
        .btn-secondary:hover { background-color: rgba(58, 46, 40, 0.05); }
        .btn-secondary:active { transform: translateY(1px); }
        .decoration { position: absolute; top: -30px; right: -30px; width: 80px; height: 80px; background-color: rgba(255, 148, 102, 0.1); border-radius: 50%; }
      </style>
      <div class="card">
        <div class="decoration"></div>
        <div class="icon-wrapper">${Icons.profile}</div>
        <h2>Únete a la manada</h2>
        <p>Inicia sesión para reportar mascotas perdidas y seguir tus adopciones.</p>
        <div class="action-buttons">
          <primary-button text="Crear cuenta"></primary-button>
          <button class="btn-secondary">Entrar</button>
        </div>
      </div>
    `;

    // Listener para el botón de registro
    this.shadowRoot
      ?.querySelector("primary-button")
      ?.addEventListener("click", () => {
        goTo("/register");
      });

    // Listener para el botón de login (clase btn-secondary)
    this.shadowRoot
      ?.querySelector(".btn-secondary")
      ?.addEventListener("click", () => {
        goTo("/login");
      });
  }
}
customElements.define(
  "unauthenticated-profile-card",
  UnauthenticatedProfileCard,
);
