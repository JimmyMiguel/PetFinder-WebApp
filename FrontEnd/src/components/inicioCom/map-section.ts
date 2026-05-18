export class MapSection extends HTMLElement {
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
                :host {
                    display: block;
                    font-family: 'Nunito', sans-serif;
                    padding-bottom: 24px;
                }
                .map-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0 20px;
                    margin-bottom: 16px;
                }
                .map-title { font-size: 1.3rem; font-weight: 800; color: var(--text-dark); margin: 0; }
                .map-tag {
                    background-color: var(--card-bg);
                    color: var(--text-dark);
                    font-size: 0.65rem;
                    font-weight: 800;
                    padding: 4px 10px;
                    border-radius: 12px;
                    text-transform: uppercase;
                }
                .map-container {
                    margin: 0 20px;
                    height: 280px;
                    background-color: var(--map-bg);
                    border-radius: 24px;
                    position: relative;
                    overflow: hidden;
                    background-image: 
                        linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px);
                    background-size: 20px 20px;
                    box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
                }
                .map-pin {
                    position: absolute;
                    top: 40%;
                    left: 35%;
                    width: 24px;
                    height: 24px;
                    background-color: var(--accent);
                    border-radius: 50%;
                    border: 3px solid rgba(255, 255, 255, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                }
                .floating-card {
                    position: absolute;
                    bottom: 20px;
                    left: 20px;
                    right: 20px;
                    background-color: var(--white);
                    border-radius: 20px;
                    padding: 12px 16px;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    box-shadow: 0 10px 20px rgba(0,0,0,0.1);
                }
                .floating-avatar { width: 44px; height: 44px; border-radius: 50%; object-fit: cover; }
                .floating-info .tag { font-size: 0.65rem; font-weight: 800; color: var(--text-dark); text-transform: uppercase; letter-spacing: 0.5px; }
                .floating-info .title { font-size: 0.95rem; font-weight: 800; color: var(--text-dark); }
                .icon-sm { width: 12px; height: 12px; fill: currentColor; }
            </style>
            <div class="map-header">
                <h2 class="map-title">Mapa de Avistamientos</h2>
                <span class="map-tag">Cercanos</span>
            </div>
            <div class="map-container">
                <div class="map-pin">
                    <svg class="icon-sm" style="fill: white;" viewBox="0 0 24 24"><path d="M12 2C8.69 2 6 4.69 6 8C6 11.31 8.69 14 12 14C15.31 14 18 11.31 18 8C18 4.69 15.31 2 12 2Z"/></svg>
                </div>
                <div class="floating-card">
                    <img src="https://placehold.co/100x100/7a9a4d/fff?text=Dog" alt="Beagle" class="floating-avatar">
                    <div class="floating-info">
                        <div class="tag">Reciente</div>
                        <div class="title">Cachorro Beagle</div>
                    </div>
                </div>
            </div>
        `;
    }
}
customElements.define('map-section', MapSection);