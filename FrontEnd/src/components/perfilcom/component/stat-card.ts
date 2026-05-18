import { globalStyles } from '../constants';

export class StatCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const value = this.getAttribute('value') || '0';
    const label = this.getAttribute('label') || '';

    this.shadowRoot!.innerHTML = `
      <style>
        ${globalStyles}
        .card { background-color: var(--card-bg); border-radius: 20px; padding: 15px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 4px; }
        .value { font-size: 1.6rem; font-weight: 800; color: var(--overline); }
        .label { font-size: 0.65rem; font-weight: 800; color: var(--text-dark); text-transform: uppercase; letter-spacing: 0.5px; }
      </style>
      <div class="card">
        <span class="value">${value}</span>
        <span class="label">${label}</span>
      </div>
    `;
  }
}
customElements.define('stat-card', StatCard);