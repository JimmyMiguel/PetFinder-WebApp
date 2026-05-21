import { globalStyles } from '../components/perfilcom/constants';
import '../components/perfilcom/component/stat-card'; // Reutilizamos el componente solicitado
import '../components/inicioCom/bottom-nav';

// Iconos específicos para esta vista
const localIcons = {
  heart: '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
  plus: '<svg class="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>'
};

export class AdoptarView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
  }

  render() {
    if (!this.shadowRoot) return;
    
    this.shadowRoot.innerHTML = `
      <style>
        ${globalStyles}
        
        :host {
          display: block;
          padding: 25px 20px 100px 20px; /* Padding inferior para el bottom-nav */
          min-height: 100vh;
          background-color: var(--white);
        }

        /* --- Header --- */
        .header h1 {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-dark);
          margin-bottom: 8px;
          line-height: 1.1;
        }

        .header p {
          font-size: 0.95rem;
          color: var(--text-light);
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 20px;
        }

        /* --- Stats (Reutilizando stat-card) --- */
        .stats-container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 25px;
        }

        /* --- Filtros (Chips) --- */
        .filters {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 10px;
          margin-bottom: 20px;
          scrollbar-width: none; /* Ocultar scrollbar en Firefox */
        }
        .filters::-webkit-scrollbar {
          display: none; /* Ocultar scrollbar en Chrome/Safari */
        }

        .chip {
          padding: 8px 18px;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s;
          background-color: var(--card-bg);
          color: var(--text-dark);
        }

        .chip.active {
          background-color: #8c4a21; /* Color café oscuro del diseño */
          color: var(--white);
        }

        /* --- Grid de Adopción --- */
        .adopt-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .adopt-card {
          border-radius: 20px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          background-color: #8a6a64; /* Color base de la tarjeta */
          color: var(--white);
          position: relative;
        }

        .img-container {
          position: relative;
          width: 100%;
          aspect-ratio: 4/5;
        }

        .img-container img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .badge-age {
          position: absolute;
          top: 10px;
          right: 10px;
          background-color: var(--card-bg);
          color: var(--text-dark);
          font-size: 0.65rem;
          font-weight: 800;
          padding: 4px 10px;
          border-radius: 12px;
          text-transform: uppercase;
        }

        .card-info {
          padding: 15px;
          display: flex;
          flex-direction: column;
          flex-grow: 1;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 2px;
        }

        .pet-name {
          font-size: 1.25rem;
          font-weight: 800;
          margin: 0;
        }

        .heart-btn {
          background: none;
          border: none;
          color: var(--white);
          padding: 0;
          cursor: pointer;
          opacity: 0.8;
          transition: opacity 0.2s;
        }

        .heart-btn:hover {
          opacity: 1;
        }

        .pet-breed {
          font-size: 0.65rem;
          color: #e6d0cc;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 15px;
        }

        .btn-adopt {
          width: 100%;
          background-color: var(--accent);
          color: var(--white);
          border: none;
          padding: 10px 0;
          border-radius: 16px;
          font-weight: 800;
          font-size: 0.9rem;
          margin-top: auto;
          transition: background-color 0.2s, transform 0.1s;
        }

        .btn-adopt:hover {
          background-color: var(--accent-hover);
        }

        .btn-adopt:active {
          transform: translateY(1px);
        }

        /* Tarjeta Placeholder "Más..." */
        .placeholder-card {
          background-color: #d8a28c;
        }
        .placeholder-img {
          background-color: #e6cfc6;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #bfa69d;
        }
        .placeholder-img .icon-lg {
          width: 40px;
          height: 40px;
          opacity: 0.5;
        }
      </style>

      <div class="header">
        <h1>Adoptar</h1>
        <p>Encuentra a tu alma gemela entre nuestros residentes más cariñosos.</p>
      </div>

      <div class="stats-container">
        <stat-card value="24" label="Disponibles"></stat-card>
        <stat-card value="128" label="Familias Felices"></stat-card>
      </div>

      <div class="filters">
        <div class="chip active">Todos</div>
        <div class="chip">Perros</div>
        <div class="chip">Gatos</div>
        <div class="chip">Otros</div>
      </div>

      <div class="adopt-grid">
        
        <div class="adopt-card">
          <div class="img-container">
            <span class="badge-age">2 Años</span>
            <img src="https://placehold.co/300x400/c78d52/fff?text=Corgi" alt="Milo">
          </div>
          <div class="card-info">
            <div class="card-header">
              <h2 class="pet-name">Milo</h2>
              <button class="heart-btn">${localIcons.heart}</button>
            </div>
            <span class="pet-breed">Corgi Galés</span>
            <button class="btn-adopt">Adoptar</button>
          </div>
        </div>

        <div class="adopt-card">
          <div class="img-container">
            <span class="badge-age">4 Meses</span>
            <img src="https://placehold.co/300x400/4a413d/fff?text=Gato" alt="Luna">
          </div>
          <div class="card-info">
            <div class="card-header">
              <h2 class="pet-name">Luna</h2>
              <button class="heart-btn">${localIcons.heart}</button>
            </div>
            <span class="pet-breed">Gato Doméstico</span>
            <button class="btn-adopt">Adoptar</button>
          </div>
        </div>

        <div class="adopt-card">
          <div class="img-container">
            <span class="badge-age">1 Año</span>
            <img src="https://placehold.co/300x400/262523/fff?text=Samoyedo" alt="Bruno">
          </div>
          <div class="card-info">
            <div class="card-header">
              <h2 class="pet-name">Bruno</h2>
              <button class="heart-btn">${localIcons.heart}</button>
            </div>
            <span class="pet-breed">Samoyedo</span>
            <button class="btn-adopt">Adoptar</button>
          </div>
        </div>

        <div class="adopt-card placeholder-card">
          <div class="img-container placeholder-img">
            ${localIcons.plus}
          </div>
          <div class="card-info">
            <div class="card-header">
              <h2 class="pet-name">Más...</h2>
            </div>
            <span class="pet-breed">Próximamente</span>
            <button class="btn-adopt" style="background-color: rgba(255,255,255,0.2);">Adoptar</button>
          </div>
        </div>

      </div>

      <bottom-nav></bottom-nav>
    `;
  }
}

customElements.define('adoptar-view', AdoptarView);