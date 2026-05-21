import { globalStyles } from "../components/perfilcom/constants";
import { setUser } from "../core/state";
import { goTo } from "../core/router";
import "../components/inicioCom/bottom-nav";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

const authIcons = {
  mail: '<svg class="icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
  lock: '<svg class="icon" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>',
};

export class UserLoginForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    const form = this.shadowRoot?.querySelector("form");
    form?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const root = this.shadowRoot!;
      const email = (root.querySelector("#email") as HTMLInputElement).value;
      const password = (root.querySelector("#password") as HTMLInputElement)
        .value;

      const res = await fetch(`${API}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Error al iniciar sesión");
        return;
      }

      const meRes = await fetch(`${API}/auth/me`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const { user } = await meRes.json();
      setUser(user, data.token);
      goTo("/perfil");
    });

    this.shadowRoot
      ?.querySelector("#to-register")
      ?.addEventListener("click", (e) => {
        e.preventDefault();
        goTo("/register");
      });
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>
        ${globalStyles}

        :host {
          display: block;
          padding-bottom: 100px;
        }

        .auth-container {
          background-color: var(--white);
          border-radius: 40px;
          padding: 35px 25px;
          margin: 20px auto;
          max-width: 100%;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03);
        }

        .header-text {
          text-align: center;
          margin-bottom: 30px;
        }

        .header-text h2 {
          font-size: 1.6rem;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 6px;
        }

        .header-text p {
          font-size: 0.85rem;
          color: var(--text-light);
          font-weight: 600;
          line-height: 1.4;
        }

        .input-group {
          margin-bottom: 18px;
        }

        .input-group label {
          display: block;
          font-size: 0.7rem;
          font-weight: 800;
          color: var(--text-dark);
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 6px;
          padding-left: 12px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .input-icon {
          position: absolute;
          left: 15px;
          color: var(--text-light);
          pointer-events: none;
          display: flex;
        }

        .input-control {
          width: 100%;
          background-color: var(--light-bg);
          border-radius: 16px;
          padding: 14px 15px 14px 45px;
          font-size: 0.95rem;
          font-weight: 600;
        }

        .input-control:focus {
          outline: none;
          background-color: #fff;
          box-shadow: 0 0 0 2px var(--accent);
        }

        .btn-submit {
          width: 100%;
          background-color: var(--accent);
          color: var(--white);
          padding: 14px 20px;
          border-radius: 20px;
          font-weight: 800;
          font-size: 1rem;
          margin-top: 15px;
        }

        .footer-link {
          text-align: center;
          margin-top: 25px;
          font-size: 0.85rem;
          color: var(--text-light);
          font-weight: 600;
        }

        .footer-link a {
          color: var(--accent);
          font-weight: 800;
          text-decoration: none;
          margin-left: 4px;
        }
      </style>

      <div class="auth-container">
        <div class="header-text">
          <h2>Iniciar Sesión</h2>
          <p>Bienvenido de nuevo a PetFinder.</p>
        </div>

        <form id="loginForm">
          <div class="input-group">
            <label>Correo Electrónico</label>
            <div class="input-wrapper">
              <span class="input-icon">${authIcons.mail}</span>
              <input type="email" class="input-control" id="email" placeholder="tucorreo@ejemplo.com" required>
            </div>
          </div>

          <div class="input-group">
            <label>Contraseña</label>
            <div class="input-wrapper">
              <span class="input-icon">${authIcons.lock}</span>
              <input type="password" class="input-control" id="password" required>
            </div>
          </div>

          <button type="submit" class="btn-submit">Entrar</button>
        </form>

        <div class="footer-link">
          ¿No tienes cuenta? <a href="#" id="to-register">Regístrate</a>
        </div>
      </div>
      <bottom-nav></bottom-nav>
    `;
  }
}

customElements.define("user-login-form", UserLoginForm);
