import { globalStyles } from '../components/perfilcom/constants';
import '../components/perfilcom/component/authenticated-profile-content';
import '../components/perfilcom/component/unauthenticated-profile-card';
import { getState, initializeState, logout, setUser } from '../core/state';
import '../components/inicioCom/bottom-nav'

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export class ProfileView extends HTMLElement {
  private ready = false;

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.verifySession();
  }

  private async verifySession() {
    initializeState();
    const token = getState().token;

    if (token) {
      try {
        const res = await fetch(`${API}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const { user } = await res.json();
          setUser(user, token);
        } else {
          logout();
        }
      } catch {
        logout();
      }
    }

    this.ready = true;
    this.render();
  }

  private render() {
    if (!this.shadowRoot) return;

    const { isAuthenticated } = getState();

    const body = !this.ready
      ? '<p class="loading">Verificando sesión...</p>'
      : isAuthenticated
        ? '<unauthenticated-profile-card></unauthenticated-profile-card>'
        : '<unauthenticated-profile-card></unauthenticated-profile-card>';

    this.shadowRoot.innerHTML = `
      <style>
        ${globalStyles}
        :host { min-height: 100vh; padding: 20px 0; }
        .main-container {
          background-color: var(--white);
          border-radius: 40px;
          overflow: hidden;
        }
        .loading {
          text-align: center;
          padding: 40px 20px;
          font-weight: 700;
          color: var(--text-light);
        }
        @media (min-width: 415px) {
          :host {
            display: flex;
            justify-content: center;
            align-items: center;
            background-color: #f2f2f2;
          }
          .main-container {
            width: 414px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
          }
        }
      </style>
      <div class="main-container">${body}</div>
      <bottom-nav></bottom-nav>

    `;
  }
}

customElements.define('profile-view', ProfileView);
