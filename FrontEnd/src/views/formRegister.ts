import { globalStyles } from '../components/perfilcom/constants';
import { setUser } from '../core/state';

const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

// Iconos específicos para el formulario de registro (opcional, para adornar los inputs)
const authIcons = {
  user: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>',
  mail: '<svg class="icon" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>',
  phone: '<svg class="icon" viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>',
  lock: '<svg class="icon" viewBox="0 0 24 24"><path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/></svg>'
};

export class UserRegistrationForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  private setupEventListeners() {
    const form = this.shadowRoot?.querySelector('form');
    form?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const root = this.shadowRoot!;
      const name = (root.querySelector('#name') as HTMLInputElement).value;
      const email = (root.querySelector('#email') as HTMLInputElement).value;
      const password = (root.querySelector('#password') as HTMLInputElement).value;

      const res = await fetch(`${API}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Error al registrarse');
        return;
      }

      setUser(
        {
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          phone: null,
          profile_picture: null,
          createdAt: null,
        },
        data.token
      );
    });
  }

  render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `
      <style>
        ${globalStyles}
        
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
          padding: 14px 15px 14px 45px; /* Padding izquierdo para dejar espacio al icono */
          font-size: 0.95rem;
          font-weight: 600;
          transition: background-color 0.2s, box-shadow 0.2s;
        }

        .input-control:focus {
          outline: none;
          background-color: #fff;
          box-shadow: 0 0 0 2px var(--accent);
        }

        .input-control::placeholder {
          color: rgba(139, 125, 118, 0.5);
          font-weight: 500;
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
          transition: background-color 0.2s, transform 0.1s;
          box-shadow: 0 4px 12px rgba(255, 148, 102, 0.3);
        }

        .btn-submit:hover {
          background-color: var(--accent-hover);
        }

        .btn-submit:active {
          transform: translateY(2px);
          box-shadow: 0 2px 6px rgba(255, 148, 102, 0.3);
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

        .footer-link a:hover {
          text-decoration: underline;
        }
      </style>

      <div class="auth-container">
        <div class="header-text">
          <h2>Crear Cuenta</h2>
          <p>Únete a la manada y ayúdanos a reunir más mascotas con sus familias.</p>
        </div>

        <form id="registerForm">
          <div class="input-group">
            <label>Nombre Completo</label>
            <div class="input-wrapper">
              <span class="input-icon">${authIcons.user}</span>
              <input type="text" class="input-control" id="name" placeholder="Ej: Jimmy Miguel" required>
            </div>
          </div>

          <div class="input-group">
            <label>Correo Electrónico</label>
            <div class="input-wrapper">
              <span class="input-icon">${authIcons.mail}</span>
              <input type="email" class="input-control" id="email" placeholder="tucorreo@ejemplo.com" required>
            </div>
          </div>

          <div class="input-group">
            <label>Teléfono (Opcional)</label>
            <div class="input-wrapper">
              <span class="input-icon">${authIcons.phone}</span>
              <input type="tel" class="input-control" id="phone" placeholder="Ej: 098 765 4321">
            </div>
          </div>

          <div class="input-group">
            <label>Contraseña</label>
            <div class="input-wrapper">
              <span class="input-icon">${authIcons.lock}</span>
              <input type="password" class="input-control" id="password" placeholder="Mínimo 8 caracteres" required>
            </div>
          </div>

          <button type="submit" class="btn-submit">Registrarme</button>
        </form>

        <div class="footer-link">
          ¿Ya tienes una cuenta? <a href="#" data-link="/login">Inicia sesión</a>
        </div>
      </div>
    `;
  }
}

customElements.define('user-registration-form', UserRegistrationForm);