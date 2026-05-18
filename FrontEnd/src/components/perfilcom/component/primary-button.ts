import { globalStyles, Icons } from '../constants';

export class PrimaryButton extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const text = this.getAttribute('text') || '';
    const icon = this.getAttribute('icon');

    this.shadowRoot!.innerHTML = `
      <style>
        ${globalStyles}
        button {
          width: 100%;
          background-color: var(--accent);
          color: var(--white);
          padding: 12px 20px;
          border-radius: 20px;
          font-weight: 700;
          font-size: 0.95rem;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 8px;
          transition: background-color 0.2s, transform 0.1s;
        }
        button:hover { background-color: var(--accent-hover); }
        button:active { transform: translateY(1px); }
      </style>
      <button>
        ${icon ? Icons[icon as keyof typeof Icons] : ''}
        ${text}
      </button>
    `;
  }
}
customElements.define('primary-button', PrimaryButton);