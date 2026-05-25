import { globalStyles } from "../constants";
import "../../inicioCom/app-header";
import "./stat-card";
import "./primary-button";
import "./report-pet-form";

export class AuthenticatedProfileContent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <style>
        ${globalStyles}
        .profile-container { padding: 20px; }
        .stats-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 25px; }
        .report-button-wrapper { margin-bottom: 30px; }
      </style>
      <div class="profile-container">
        <app-header></app-header>
        
        <div class="stats-grid">
          <stat-card value="3" label="Mascotas reportadas"></stat-card>
          <stat-card value="1" label="Mascotas adoptadas"></stat-card>
        </div>
        
        <div class="report-button-wrapper">
          <primary-button text="Reportar Mascota" icon="pin"></primary-button>
        </div>
        
        <report-pet-form></report-pet-form>
      </div>
    `;
  }
}
customElements.define(
  "authenticated-profile-content",
  AuthenticatedProfileContent,
);
