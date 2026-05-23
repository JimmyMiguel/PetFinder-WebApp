import { globalStyles } from "../components/perfilcom/constants";
import "../components/perfilcom/component/stat-card"; // Reutilizamos el componente solicitado
import "../components/inicioCom/bottom-nav";
import "../components/inicioCom/pet-card";

// Iconos específicos para esta vista
const localIcons = {
  heart:
    '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>',
  plus: '<svg class="icon-lg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>',
};

export class AdoptarView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
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
          padding: 25px 20px 160px 20px; /* Ajuste para que el scroll no oculte contenido bajo la nav */
          min-height: 100vh;
        }

        /* Contenedor para centrar y limitar el ancho en pantallas grandes */
        .content-container {
          max-width: 1200px;
          margin: 0 auto;
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

        /* --- Grid de Mascotas --- */
        .pets-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 15px;
        }
        @media (min-width: 768px) {
          .pets-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (min-width: 1024px) {
          .pets-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }
      </style>

      <div class="content-container">
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

      <div class="pets-grid">
        ${[
          {
            name: "Milo",
            location: "Corgi Galés",
            image: "https://placehold.co/300x300/c78d52/fff?text=Corgi",
            badge: "2 Años",
            btnText: "Adoptar",
            hasIcon: true,
          },
          {
            name: "Luna",
            location: "Gato Doméstico",
            image: "https://placehold.co/300x300/4a413d/fff?text=Gato",
            badge: "4 Meses",
            btnText: "Adoptar",
          },
          {
            name: "Bruno",
            location: "Samoyedo",
            image: "https://placehold.co/300x300/262523/fff?text=Samoyedo",
            badge: "1 Año",
            btnText: "Adoptar",
          },
          {
            name: "Próximamente",
            location: "Varios residentes",
            image: "https://placehold.co/300x300/e6cfc6/bfa69d?text=%2B",
            btnText: "Ver más",
          },
        ]
          .map(
            (pet) => `
            <pet-card 
                name="${pet.name}" 
                location="${pet.location}" 
                image="${pet.image}" 
                btn-text="${pet.btnText}"
                ${pet.badge ? `badge="${pet.badge}"` : ""}
                ${pet.hasIcon ? `btn-icon="true"` : ""}
            ></pet-card>
        `,
          )
          .join("")}
      </div>
      </div>

      <bottom-nav></bottom-nav>
    `;
  }
}

customElements.define("adoptar-view", AdoptarView);
