/**
 * CustomCursor - High-performance cyber gaming dot and follower ring cursor.
 * Uses sub-pixel interpolation (lerp) on requestAnimationFrame for silky smooth motion.
 */
export class CustomCursor {
  constructor() {
    this.dot = null;
    this.ring = null;
    this.pos = { x: -100, y: -100 };
    this.target = { x: -100, y: -100 };
    this.isHovering = false;
    this.isClicking = false;
    this.rafId = null;

    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
    this.update = this.update.bind(this);
  }

  init() {
    // Disable on touch-only mobile devices to avoid interfering with touch
    if (window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    // Build DOM elements
    this.dot = document.createElement('div');
    this.dot.className = 'cyber-cursor-dot';

    this.ring = document.createElement('div');
    this.ring.className = 'cyber-cursor-ring';

    document.body.appendChild(this.dot);
    document.body.appendChild(this.ring);

    // Apply global cursor none
    document.documentElement.classList.add('custom-cursor-active');

    window.addEventListener('mousemove', this.onMouseMove, { passive: true });
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);

    this.bindHoverListeners();
    this.rafId = requestAnimationFrame(this.update);
  }

  onMouseMove(e) {
    this.target.x = e.clientX;
    this.target.y = e.clientY;

    // Instant position for the inner dot
    if (this.dot) {
      this.dot.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0)`;
    }
  }

  onMouseDown() {
    this.isClicking = true;
    if (this.ring) this.ring.classList.add('clicking');
    if (this.dot) this.dot.classList.add('clicking');
  }

  onMouseUp() {
    this.isClicking = false;
    if (this.ring) this.ring.classList.remove('clicking');
    if (this.dot) this.dot.classList.remove('clicking');
  }

  bindHoverListeners() {
    // Detect hover over interactive elements
    document.addEventListener('mouseover', (e) => {
      const target = e.target.closest('button, a, .game-card, .cat-tab, input, .card-favorite-btn, [tabindex="0"]');
      if (target) {
        this.setHoverState(true);
      }
    });

    document.addEventListener('mouseout', (e) => {
      const target = e.target.closest('button, a, .game-card, .cat-tab, input, .card-favorite-btn, [tabindex="0"]');
      if (target) {
        this.setHoverState(false);
      }
    });
  }

  setHoverState(hovering) {
    this.isHovering = hovering;
    if (this.ring) {
      if (hovering) {
        this.ring.classList.add('hovering');
      } else {
        this.ring.classList.remove('hovering');
      }
    }
  }

  update() {
    // Lerp follower ring for fluid trailing effect
    const ease = 0.18;
    this.pos.x += (this.target.x - this.pos.x) * ease;
    this.pos.y += (this.target.y - this.pos.y) * ease;

    if (this.ring) {
      this.ring.style.transform = `translate3d(${this.pos.x}px, ${this.pos.y}px, 0)`;
    }

    this.rafId = requestAnimationFrame(this.update);
  }

  destroy() {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);

    if (this.dot) this.dot.remove();
    if (this.ring) this.ring.remove();
    document.documentElement.classList.remove('custom-cursor-active');
  }
}

export const customCursor = new CustomCursor();
