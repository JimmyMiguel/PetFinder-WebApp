export class BottomNav extends HTMLElement {
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
                    position: absolute;
                    bottom: 0;
                    width: 100%;
                    height: 80px;
                    background-color: var(--bg-color);
                    display: flex;
                    justify-content: space-around;
                    align-items: center;
                    border-top: 1px solid rgba(0,0,0,0.03);
                    z-index: 100;
                    font-family: 'Nunito', sans-serif;
                }
                .nav-item {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 4px;
                    color: var(--text-light);
                    font-size: 0.65rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    cursor: pointer;
                    transition: color 0.2s;
                }
                .nav-item:hover { color: var(--text-dark); }
                .nav-item.active { color: var(--white); }
                .nav-icon-wrapper { display: flex; align-items: center; justify-content: center; }
                .nav-item.active .nav-icon-wrapper {
                    background-color: var(--accent);
                    width: 56px;
                    height: 56px;
                    border-radius: 50%;
                    margin-top: -24px;
                    box-shadow: 0 6px 16px rgba(255, 148, 102, 0.4);
                    border: 4px solid var(--bg-color);
                }
                .nav-item.active span { color: var(--accent); }
                .icon-lg { width: 24px; height: 24px; fill: currentColor; }
            </style>
            <div class="nav-item active">
                <div class="nav-icon-wrapper">
                    <svg class="icon-lg" viewBox="0 0 24 24"><path d="M10 20V14H14V20H19V12H22L12 3L2 12H5V20H10Z"/></svg>
                </div>
                <span>Found</span>
            </div>
            <div class="nav-item">
                <div class="nav-icon-wrapper">
                    <svg class="icon-lg" viewBox="0 0 24 24"><path d="M12 2C8.69 2 6 4.69 6 8C6 11.31 8.69 14 12 14C15.31 14 18 11.31 18 8C18 4.69 15.31 2 12 2M7.5 16C5 16 3 18 3 20.5V22H21V20.5C21 18 19 16 16.5 16H7.5Z"/></svg>
                </div>
                <span>Lost</span>
            </div>
            <div class="nav-item">
                <div class="nav-icon-wrapper">
                    <svg class="icon-lg" viewBox="0 0 24 24"><path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z"/></svg>
                </div>
                <span>Profile</span>
            </div>
        `;
    }
}
customElements.define('bottom-nav', BottomNav);