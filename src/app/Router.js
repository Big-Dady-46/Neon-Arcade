/**
 * Router - Lightweight hash-based client-side router for SPA navigation.
 */
export class Router {
  constructor() {
    this.routes = new Map();
    this.currentRoute = null;
    this.handleHashChange = this.handleHashChange.bind(this);
    window.addEventListener('hashchange', this.handleHashChange);
  }

  on(path, handler) {
    this.routes.set(path, handler);
    return this;
  }

  navigate(path) {
    window.location.hash = path.startsWith('#') ? path : `#${path}`;
  }

  init() {
    this.handleHashChange();
  }

  handleHashChange() {
    const rawHash = window.location.hash.slice(1) || '/';
    const [path, queryString] = rawHash.split('?');
    const query = new URLSearchParams(queryString || '');

    // Match exact or parameterized routes
    let matched = false;

    // Direct match
    if (this.routes.has(path)) {
      this.currentRoute = { path, params: {}, query };
      this.routes.get(path)({ params: {}, query });
      return;
    }

    // Param match e.g. /game/:id
    for (const [routePattern, handler] of this.routes.entries()) {
      if (routePattern.includes(':')) {
        const patternParts = routePattern.split('/');
        const pathParts = path.split('/');

        if (patternParts.length === pathParts.length) {
          const params = {};
          let match = true;

          for (let i = 0; i < patternParts.length; i++) {
            if (patternParts[i].startsWith(':')) {
              const paramName = patternParts[i].slice(1);
              params[paramName] = pathParts[i];
            } else if (patternParts[i] !== pathParts[i]) {
              match = false;
              break;
            }
          }

          if (match) {
            this.currentRoute = { path, params, query };
            handler({ params, query });
            matched = true;
            break;
          }
        }
      }
    }

    // Default to home /
    if (!matched && this.routes.has('/')) {
      this.currentRoute = { path: '/', params: {}, query };
      this.routes.get('/')({ params: {}, query });
    }
  }

  destroy() {
    window.removeEventListener('hashchange', this.handleHashChange);
  }
}

export const router = new Router();
