 export class HomeView extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

        const pets = [
            { name: 'Maximus', location: 'Parque Central', image: 'https://placehold.co/300x300/e6c587/4a3b32?text=Dog+1', badge: 'RECIÉN VISTO', btnText: '¡Mío!', hasIcon: true },
            { name: 'Mina', location: 'Calle Palmeras', image: 'https://placehold.co/300x300/3d3b3c/ffffff?text=Cat', badge: null, btnText: '¡Es mi mascota!', hasIcon: false },
            { name: 'Cazador', location: 'Barrio Los Álamos', image: 'https://placehold.co/300x300/7a9a4d/ffffff?text=Dog+2', badge: null, btnText: '¡Es mi mascota!', hasIcon: false },
            { name: 'Desconocido', location: 'Avenida del Sol', image: 'https://placehold.co/300x300/c7b6a7/4a3b32?text=Dog+3', badge: null, btnText: '¡Es mi mascota!', hasIcon: false }
        ];

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
                .pets-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; padding: 0 20px; }
            </style>

            <app-header></app-header>

            <section class="intro-section">
                <div class="overline">Comunidad Activa</div>
                <h1>Mascotas Encontradas</h1>
                <p class="subtitle">Ayúdanos a que estos pequeños vuelvan a casa.</p>
            </section>

            <div class="pets-grid">
                ${pets.map(pet => `
                    <pet-card 
                        name="${pet.name}" 
                        location="${pet.location}" 
                        image="${pet.image}" 
                        btn-text="${pet.btnText}"
                        ${pet.badge ? `badge="${pet.badge}"` : ''}
                        ${pet.hasIcon ? `btn-icon="true"` : ''}
                    ></pet-card>
                `).join('')}
            </div>

            <app-pagination></app-pagination>
            <map-section></map-section>
            <bottom-nav></bottom-nav>
        `;
    }
}
customElements.define('home-view', HomeView);