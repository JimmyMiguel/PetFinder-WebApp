export class PetCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

        const name = this.getAttribute('name') || '';
        const location = this.getAttribute('location') || '';
        const image = this.getAttribute('image') || '';
        const badge = this.getAttribute('badge');
        const btnText = this.getAttribute('btn-text') || '';
        const hasIcon = this.hasAttribute('btn-icon');

        this.shadowRoot.innerHTML = `
            <style>
                :host {
                    background-color: var(--card-bg);
                    border-radius: 20px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    font-family: 'Nunito', sans-serif;
                }
                .badge-new {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(255, 255, 255, 0.9);
                    color: var(--text-dark);
                    font-size: 0.6rem;
                    font-weight: 800;
                    padding: 4px 8px;
                    border-radius: 12px;
                    z-index: 10;
                }
                .pet-image { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 20px; }
                .pet-info { padding: 12px; display: flex; flex-direction: column; flex-grow: 1; justify-content: space-between; }
                .pet-name { font-weight: 800; font-size: 1.05rem; color: var(--text-dark); }
                .pet-location { font-size: 0.7rem; color: var(--text-light); display: flex; align-items: center; gap: 4px; margin-top: 2px; margin-bottom: 12px; }
                .icon-sm { width: 12px; height: 12px; fill: currentColor; }
                .btn-primary {
                    width: 100%;
                    background-color: var(--accent);
                    color: var(--white);
                    border: none;
                    padding: 8px 0;
                    border-radius: 16px;
                    font-weight: 700;
                    font-size: 0.8rem;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 4px;
                    font-family: inherit;
                }
                .btn-primary:hover { background-color: var(--accent-hover); transform: translateY(-1px); }
                .btn-primary:active { transform: translateY(1px) scale(0.98); }
            </style>
            
            ${badge && badge !== 'null' ? `<div class="badge-new">${badge}</div>` : ''}
            <img src="${image}" alt="${name}" class="pet-image">
            <div class="pet-info">
                <div>
                    <div class="pet-name">${name}</div>
                    <div class="pet-location">
                        <svg class="icon-sm" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9C5 14.25 12 22 12 22C12 22 19 14.25 19 9C19 5.13 15.87 2 12 2M12 11.5C10.62 11.5 9.5 10.38 9.5 9C9.5 7.62 10.62 6.5 12 6.5C13.38 6.5 14.5 7.62 14.5 9C14.5 10.38 13.38 11.5 12 11.5Z"/></svg>
                        ${location}
                    </div>
                </div>
                <button class="btn-primary">
                    ${btnText} 
                    ${hasIcon ? `<svg class="icon-sm" viewBox="0 0 24 24"><path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z"/></svg>` : ''}
                </button>
            </div>
        `;
    }
}
customElements.define('pet-card', PetCard);