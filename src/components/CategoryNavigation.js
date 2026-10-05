import { CATEGORIES, gameRegistry } from '../app/GameRegistry.js';

/**
 * CategoryNavigation - Horizontal category filter bar with game counts and active tab tracking.
 */
export class CategoryNavigation {
  constructor(activeCategory = 'all', onSelectCategory) {
    this.activeCategory = activeCategory;
    this.onSelectCategory = onSelectCategory;
    this.element = null;
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'category-nav-wrapper';

    const nav = document.createElement('nav');
    nav.className = 'category-nav';

    CATEGORIES.forEach(cat => {
      const count = gameRegistry.getCategoryCount(cat.id);
      const btn = document.createElement('button');
      btn.className = `cat-tab ${cat.id === this.activeCategory ? 'active' : ''}`;
      btn.dataset.category = cat.id;
      btn.innerHTML = `
        <span class="cat-icon">${cat.icon}</span>
        <span class="cat-name">${cat.name}</span>
        <span class="cat-count">${count}</span>
      `;

      btn.addEventListener('click', () => {
        this.setActiveCategory(cat.id);
        if (this.onSelectCategory) {
          this.onSelectCategory(cat.id);
        }
      });

      nav.appendChild(btn);
    });

    this.element.appendChild(nav);
    return this.element;
  }

  setActiveCategory(catId) {
    this.activeCategory = catId;
    if (!this.element) return;
    const tabs = this.element.querySelectorAll('.cat-tab');
    tabs.forEach(tab => {
      if (tab.dataset.category === catId) {
        tab.classList.add('active');
      } else {
        tab.classList.remove('active');
      }
    });
  }
}
