import { goTo } from "../core/router";
import { getState } from "../core/state";
import "../components/inicioCom/app-header";
import "../components/inicioCom/bottom-nav";
import "../components/inicioCom/pet-card";
import "../components/inicioCom/app-pagination";
import "../components/inicioCom/map-section";

const API = import.meta.env.VITE_API_URL ?? "http://localhost:3000/api";

export class HomeView extends HTMLElement {
  private pets: any[] = [];
  private loading: boolean = true;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  async connectedCallback() {
    await this.fetchPets();
    this.render();
  }

  async fetchPets() {
    try {
      this.loading = true;
      this.render(); // Renderiza estado de carga

      // Consultamos el endpoint sin filtros para traer "todas" como pediste
      const res = await fetch(`${API}/pets`);
      if (res.ok) {
        const json = await res.json();
        this.pets = json.data; // El backend devuelve las filas en la propiedad 'data'
      }
    } catch (error) {
      console.error("Error al obtener las mascotas desde el servidor:", error);
    } finally {
      this.loading = false;
      this.render();
    }
  }

  render() {
    if (!this.shadowRoot) return;

    const petsListContent = this.loading
      ? '<p class="status-msg">Buscando mascotas cerca de ti...</p>'
      : this.pets.length === 0
        ? '<p class="status-msg">No se encontraron mascotas en este momento.</p>'
        : this.pets
            .map(
              (pet) => `
              <pet-card 
                  name="${pet.name || "Desconocido"}" 
                  location="${pet.location_text}" 
                  image="${pet.photos && pet.photos.length > 0 ? pet.photos[0] : "https://placehold.co/300x300?text=Sin+Foto"}" 
                  btn-text="¡Es mi mascota!"
                  badge="${pet.status}"
              ></pet-card>
          `,
            )
            .join("");

    this.shadowRoot.innerHTML = `
            <style>
                :host {
                    display: block;
                    padding-bottom: 100px;
                    min-height: 100vh;
                    font-family: 'Nunito', sans-serif;
                }
                .intro-section { padding: 0 20px; margin-bottom: 24px; }
                .overline { font-size: 0.7rem; color: var(--overline); font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; }
                h1 { font-size: 1.8rem; font-weight: 800; line-height: 1.2; margin: 4px 0 8px 0; color: var(--text-dark); }
                .subtitle { font-size: 0.9rem; color: var(--text-light); font-weight: 600; }
                .status-msg { padding: 40px 20px; text-align: center; font-weight: 700; color: var(--text-light); grid-column: 1 / -1; }
                .pets-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; padding: 0 20px; }
                @media (min-width: 1024px) {
                    .pets-grid {
                        grid-template-columns: repeat(4, 1fr);
                    }
                }
            </style>

            <app-header></app-header>

            <section class="intro-section">
                <div class="overline">Comunidad Activa</div>
                <h1>Mascotas Encontradas</h1>
                <p class="subtitle">Ayúdanos a que estos pequeños vuelvan a casa.</p>
            </section>

            <div class="pets-grid">
                ${petsListContent}
            </div>

            <app-pagination></app-pagination>
            <map-section></map-section>
            <bottom-nav></bottom-nav>
        `;
  }
}

customElements.define("home-view", HomeView);
