import { App } from './app/App.js';

// Initialize the Neon Arcade Application once DOM is ready
window.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  if (root) {
    const app = new App(root);
    app.init();
  }
});
