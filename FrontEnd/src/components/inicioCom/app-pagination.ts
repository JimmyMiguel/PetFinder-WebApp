export class AppPagination extends HTMLElement {
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
                    justify-content: center;
                    align-items: center;
                    gap: 16px;
                    margin: 32px 0;
                    font-weight: 700;
                    font-size: 0.9rem;
                    color: var(--text-light);
                    font-family: 'Nunito', sans-serif;
                }
                .page-arrow {
                    width: 32px;
                    height: 32px;
                    background-color: var(--card-bg);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .page-arrow:hover { background-color: #f2dcd0; }
                .page-number { cursor: pointer; }
                .page-number.active { color: var(--text-dark); font-weight: 800; }
                .icon { width: 16px; height: 16px; fill: currentColor; }
            </style>
            <div class="page-arrow">
                <svg class="icon" viewBox="0 0 24 24"><path d="M15.41 16.59L10.83 12L15.41 7.41L14 6L8 12L14 18L15.41 16.59Z"/></svg>
            </div>
            <span class="page-number active">1</span>
            <span class="page-number">2</span>
            <span class="page-number">3</span>
            <div class="page-arrow">
                <svg class="icon" viewBox="0 0 24 24"><path d="M8.59 16.59L13.17 12L8.59 7.41L10 6L16 12L10 18L8.59 16.59Z"/></svg>
            </div>
        `;
    }
}
customElements.define('app-pagination', AppPagination);