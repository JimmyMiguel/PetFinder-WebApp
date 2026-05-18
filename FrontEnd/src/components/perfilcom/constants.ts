export const globalStyles = `
  :host {
    --bg-color: #fcf4ef;
    --card-bg: #fae9df;
    --text-dark: #3a2e28;
    --text-light: #8b7d76;
    --accent: #ff9466;
    --accent-hover: #fa804d;
    --overline: #a67c52;
    --white: #ffffff;
    --light-bg: #f9ede6;
    font-family: 'Nunito', sans-serif;
    display: block;
    width: 100%;
    color: var(--text-dark);
  }
  * { box-sizing: border-box; margin: 0; padding: 0; -webkit-tap-highlight-color: transparent; }
  img { max-width: 100%; height: auto; display: block; }
  input, select, textarea, button { font-family: inherit; font-size: inherit; border: none; background: none; padding: 0; color: var(--text-dark); }
  button { cursor: pointer; }
  .icon { width: 16px; height: 16px; fill: currentColor; }
  .icon-sm { width: 12px; height: 12px; fill: currentColor; }
  .icon-lg { width: 24px; height: 24px; fill: currentColor; }
`;

export const Icons = {
  check: '<svg class="icon-sm" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>',
  pencil: '<svg class="icon" viewBox="0 0 24 24"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>',
  pin: '<svg class="icon" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>',
  camera: '<svg class="icon-lg" viewBox="0 0 24 24"><path d="M12 9c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/><path d="M20 4h-3.17L15 2H9L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm-8 13c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z"/></svg>',
  arrowDown: '<svg class="icon-sm" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>',
  profile: '<svg class="icon-lg" viewBox="0 0 24 24"><path d="M12 2C8.69 2 6 4.69 6 8C6 11.31 8.69 14 12 14C15.31 14 18 11.31 18 8C18 4.69 15.31 2 12 2M7.5 16C5 16 3 18 3 20.5V22H21V20.5C21 18 19 16 16.5 16H7.5Z" /></svg>'
};