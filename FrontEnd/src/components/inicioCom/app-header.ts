export class AppHeader extends HTMLElement {
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
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 24px 20px;
                    width: 100%;
                    box-sizing: border-box;
                    font-family: 'Nunito', sans-serif;
                }
                .logo {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-weight: 800;
                    font-size: 1.25rem;
                    color: #8c5730;
                }
                .logo svg {
                    width: 24px;
                    height: 24px;
                    fill: #8c5730;
                }
                .avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 2px solid var(--white);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
            </style>
            <div class="logo">
                <svg viewBox="0 0 24 24"><path d="M12 2C8.69 2 6 4.69 6 8C6 11.31 8.69 14 12 14C15.31 14 18 11.31 18 8C18 4.69 15.31 2 12 2M7.5 16C5 16 3 18 3 20.5V22H21V20.5C21 18 19 16 16.5 16H7.5Z" /></svg>
                PetFinder
            </div>
            <img src="https://placehold.co/100x100/4a3b32/fff?text=User" alt="Perfil" class="avatar">
        `;
    }
}
customElements.define('app-header', AppHeader);