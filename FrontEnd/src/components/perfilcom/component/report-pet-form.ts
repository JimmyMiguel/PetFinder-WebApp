import { globalStyles, Icons } from '../constants';

export class ReportPetForm extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot!.innerHTML = `
      <style>
        ${globalStyles}
        .form-section { margin-top: 30px; }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; padding: 0 10px; }
        .form-header .overline { font-size: 0.7rem; color: var(--overline); font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
        .form-header h2 { font-size: 1.25rem; font-weight: 800; }
        .status-text { font-size: 0.7rem; color: var(--text-light); font-weight: 600; }
        .upload-area { background-color: var(--light-bg); border-radius: 20px; padding: 25px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 12px; cursor: pointer; transition: background-color 0.2s; margin-bottom: 20px; }
        .upload-area:hover { background-color: #f2e3da; }
        .upload-icon { color: rgba(58, 46, 40, 0.4); }
        .upload-area .title { font-size: 0.95rem; font-weight: 700; color: var(--text-dark); }
        .upload-area .formats { font-size: 0.75rem; color: var(--text-light); font-weight: 600; }
        .input-group { margin-bottom: 15px; }
        .input-group label { display: block; font-size: 0.7rem; font-weight: 800; color: var(--text-dark); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 5px; padding-left: 10px; }
        .input-control { width: 100%; background-color: var(--light-bg); border-radius: 15px; padding: 12px 15px; font-size: 0.9rem; font-weight: 600; transition: background-color 0.2s, box-shadow 0.2s; }
        .input-control:focus { outline: none; background-color: var(--white); box-shadow: 0 0 0 2px var(--accent); }
        .input-control::placeholder { color: rgba(139, 125, 118, 0.6); }
        .row { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
        .select-wrapper, .location-wrapper { position: relative; }
        .select-wrapper select { appearance: none; padding-right: 35px; }
        .location-wrapper input { padding-left: 35px; }
        .select-icon { position: absolute; right: 15px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-light); }
        .location-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); pointer-events: none; color: var(--text-light); }
        textarea.input-control { resize: vertical; min-height: 100px; line-height: 1.4; }
        .btn-secondary { width: 100%; background-color: #f2dcd0; color: var(--overline); padding: 12px 20px; border-radius: 20px; font-weight: 700; font-size: 0.95rem; transition: background-color 0.2s, transform 0.1s; margin-top: 10px; }
        .btn-secondary:hover { background-color: #f2e3da; }
        .btn-secondary:active { transform: translateY(1px); }
      </style>
      <div class="form-section">
        <div class="form-header">
          <div>
            <div class="overline">Formulario</div>
            <h2>Nuevo Reporte</h2>
          </div>
          <span class="status-text">Borrador guardado</span>
        </div>
        
        <div class="upload-area">
          <div class="upload-icon">${Icons.camera}</div>
          <div class="title">Sube una foto clara</div>
          <div class="formats">Formatos: JPG, PNG, HEIC</div>
        </div>
        
        <div class="input-group">
          <label>Nombre (si se conoce)</label>
          <input type="text" class="input-control" placeholder="Ej: Toby">
        </div>
        
        <div class="row">
          <div class="input-group">
            <label>Tipo de animal</label>
            <div class="select-wrapper">
              <select class="input-control">
                <option value="" disabled selected>Perro</option>
                <option value="perro">Perro</option>
                <option value="gato">Gato</option>
                <option value="otro">Otro</option>
              </select>
              <div class="select-icon">${Icons.arrowDown}</div>
            </div>
          </div>
          <div class="input-group">
            <label>Fecha</label>
            <input type="text" class="input-control" placeholder="mm/dd/yyyy">
          </div>
        </div>
        
        <div class="input-group">
          <label>Ubicación</label>
          <div class="location-wrapper">
            <div class="location-icon">${Icons.pin}</div>
            <input type="text" class="input-control" placeholder="Calle, Barrio o Ciudad">
          </div>
        </div>
        
        <div class="input-group">
          <label>Descripción</label>
          <textarea class="input-control" placeholder="Describe rasgos distintivos, temperamento o estado de salud..."></textarea>
        </div>
        
        <button class="btn-secondary">Guardar para después</button>
      </div>
    `;
  }
}
customElements.define('report-pet-form', ReportPetForm);