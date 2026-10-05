/**
 * SearchBar - Live search input with debounced querying, clear button, and shortcut listener.
 */
export class SearchBar {
  constructor(onSearchChange) {
    this.onSearchChange = onSearchChange;
    this.element = null;
    this.input = null;
    this.clearBtn = null;
    this.debounceTimer = null;
  }

  render() {
    this.element = document.createElement('div');
    this.element.className = 'search-container';
    this.element.innerHTML = `
      <span class="search-icon">🔍</span>
      <input type="text" class="search-input" placeholder="Search 100+ games... (Press '/' to focus)" aria-label="Search games">
      <button class="search-clear" aria-label="Clear search">✕</button>
    `;

    this.input = this.element.querySelector('.search-input');
    this.clearBtn = this.element.querySelector('.search-clear');

    this.bindEvents();
    return this.element;
  }

  bindEvents() {
    this.input.addEventListener('input', (e) => {
      const val = e.target.value;
      if (val.length > 0) {
        this.clearBtn.classList.add('visible');
      } else {
        this.clearBtn.classList.remove('visible');
      }

      clearTimeout(this.debounceTimer);
      this.debounceTimer = setTimeout(() => {
        if (this.onSearchChange) {
          this.onSearchChange(val);
        }
      }, 150);
    });

    this.clearBtn.addEventListener('click', () => {
      this.input.value = '';
      this.clearBtn.classList.remove('visible');
      this.input.focus();
      if (this.onSearchChange) {
        this.onSearchChange('');
      }
    });

    // Press '/' anywhere on page to focus search (unless in an input)
    window.addEventListener('keydown', (e) => {
      if (e.key === '/' && document.activeElement !== this.input) {
        e.preventDefault();
        this.input.focus();
      }
    });
  }

  setValue(val) {
    if (this.input) {
      this.input.value = val;
      if (val) {
        this.clearBtn.classList.add('visible');
      } else {
        this.clearBtn.classList.remove('visible');
      }
    }
  }
}
