/**
 * InputManager - Unified keyboard, mouse/pointer, touch gesture, and virtual control handling.
 * Provides pixel-perfect coordinate translation from screen to logical game coordinates.
 */
export class InputManager {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.keys = new Map();
    this.actions = new Map();
    this.justPressed = new Map();
    this.actionListeners = new Set();

    // Mouse / Pointer state
    this.pointer = {
      x: 0,
      y: 0,
      isDown: false,
      justPressed: false,
      moved: false,
      canvasX: 0,
      canvasY: 0
    };

    // Touch gesture tracking
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchStartTime = 0;
    this.minSwipeDistance = 25; // px

    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handlePointerDown = this.handlePointerDown.bind(this);
    this.handlePointerMove = this.handlePointerMove.bind(this);
    this.handlePointerUp = this.handlePointerUp.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    this.handleContextMenu = (e) => e.preventDefault();

    this.initListeners();
  }

  initListeners() {
    window.addEventListener('keydown', this.handleKeyDown, { passive: false });
    window.addEventListener('keyup', this.handleKeyUp, { passive: false });

    if (this.canvas) {
      this.canvas.addEventListener('pointerdown', this.handlePointerDown);
      this.canvas.addEventListener('pointermove', this.handlePointerMove);
      window.addEventListener('pointerup', this.handlePointerUp);
      this.canvas.addEventListener('touchstart', this.handleTouchStart, { passive: false });
      this.canvas.addEventListener('touchend', this.handleTouchEnd, { passive: false });
      this.canvas.addEventListener('contextmenu', this.handleContextMenu);
    }
  }

  mapEventToAction(e) {
    const code = e.code || '';
    const key = (e.key || '').toLowerCase();

    // Directional Up
    if (code === 'ArrowUp' || code === 'KeyW' || key === 'arrowup' || key === 'w') return 'up';
    // Directional Down
    if (code === 'ArrowDown' || code === 'KeyS' || key === 'arrowdown' || key === 's') return 'down';
    // Directional Left
    if (code === 'ArrowLeft' || code === 'KeyA' || key === 'arrowleft' || key === 'a') return 'left';
    // Directional Right
    if (code === 'ArrowRight' || code === 'KeyD' || key === 'arrowright' || key === 'd') return 'right';
    // Primary Action (Space / Enter)
    if (code === 'Space' || code === 'Enter' || key === ' ' || key === 'spacebar' || key === 'enter') return 'action1';
    // Secondary Action (Z / X / Shift)
    if (code === 'KeyZ' || code === 'KeyX' || code === 'ShiftLeft' || code === 'ShiftRight' || key === 'z' || key === 'x' || key === 'shift') return 'action2';
    // Pause / Menu
    if (code === 'Escape' || code === 'KeyP' || key === 'escape' || key === 'p') return 'pause';
    // Restart
    if (code === 'KeyR' || key === 'r') return 'restart';

    return null;
  }

  handleKeyDown(e) {
    const key = e.code || e.key;
    this.keys.set(key, true);

    const preventKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'];
    if (preventKeys.includes(e.code) || preventKeys.includes(e.key) || e.key === ' ') {
      e.preventDefault();
    }

    const action = this.mapEventToAction(e);
    if (action) {
      if (!this.actions.get(action)) {
        this.justPressed.set(action, true);
      }
      this.actions.set(action, true);
      this.emitAction(action, true);
    }
  }

  handleKeyUp(e) {
    const key = e.code || e.key;
    this.keys.set(key, false);

    const action = this.mapEventToAction(e);
    if (action) {
      this.actions.set(action, false);
      this.emitAction(action, false);
    }
  }

  updatePointerCoords(clientX, clientY) {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    // Use logical game dimensions attached to the canvas, or default 800x600
    const gameW = this.canvas._gameWidth || 800;
    const gameH = this.canvas._gameHeight || 600;

    this.pointer.x = clientX - rect.left;
    this.pointer.y = clientY - rect.top;

    // Map screen pixel coordinate directly into logical game space
    this.pointer.canvasX = Math.max(0, Math.min(gameW, ((clientX - rect.left) / rect.width) * gameW));
    this.pointer.canvasY = Math.max(0, Math.min(gameH, ((clientY - rect.top) / rect.height) * gameH));
  }

  handlePointerDown(e) {
    this.pointer.isDown = true;
    this.pointer.justPressed = true;
    this.pointer.moved = true;
    this.updatePointerCoords(e.clientX, e.clientY);
  }

  handlePointerMove(e) {
    this.pointer.moved = true;
    this.updatePointerCoords(e.clientX, e.clientY);
  }

  handlePointerUp() {
    this.pointer.isDown = false;
  }

  handleTouchStart(e) {
    this.pointer.isDown = true;
    this.pointer.justPressed = true;
    this.pointer.moved = true;
    if (e.touches && e.touches.length > 0) {
      const touch = e.touches[0];
      this.touchStartX = touch.clientX;
      this.touchStartY = touch.clientY;
      this.touchStartTime = performance.now();
      this.updatePointerCoords(touch.clientX, touch.clientY);
    }
  }

  handleTouchEnd(e) {
    this.pointer.isDown = false;
    if (e.changedTouches && e.changedTouches.length > 0) {
      const touch = e.changedTouches[0];
      const deltaX = touch.clientX - this.touchStartX;
      const deltaY = touch.clientY - this.touchStartY;
      const deltaTime = performance.now() - this.touchStartTime;

      if (deltaTime < 400 && (Math.abs(deltaX) > this.minSwipeDistance || Math.abs(deltaY) > this.minSwipeDistance)) {
        if (Math.abs(deltaX) > Math.abs(deltaY)) {
          const action = deltaX > 0 ? 'right' : 'left';
          this.triggerActionPulse(action);
        } else {
          const action = deltaY > 0 ? 'down' : 'up';
          this.triggerActionPulse(action);
        }
      }
    }
  }

  triggerActionPulse(action) {
    this.justPressed.set(action, true);
    this.actions.set(action, true);
    this.emitAction(action, true);
    setTimeout(() => {
      this.actions.set(action, false);
      this.emitAction(action, false);
    }, 120);
  }

  setActionState(action, isPressed) {
    if (isPressed && !this.actions.get(action)) {
      this.justPressed.set(action, true);
    }
    this.actions.set(action, isPressed);
    this.emitAction(action, isPressed);
  }

  onAction(callback) {
    this.actionListeners.add(callback);
    return () => this.actionListeners.delete(callback);
  }

  emitAction(action, isPressed) {
    for (const listener of this.actionListeners) {
      listener(action, isPressed);
    }
  }

  isActionActive(action) {
    return !!this.actions.get(action);
  }

  isActionJustPressed(action) {
    return !!this.justPressed.get(action);
  }

  isKeyDown(code) {
    return !!this.keys.get(code);
  }

  endFrame() {
    this.justPressed.clear();
    this.pointer.justPressed = false;
    this.pointer.moved = false;
  }

  destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('pointerup', this.handlePointerUp);

    if (this.canvas) {
      this.canvas.removeEventListener('pointerdown', this.handlePointerDown);
      this.canvas.removeEventListener('pointermove', this.handlePointerMove);
      this.canvas.removeEventListener('touchstart', this.handleTouchStart);
      this.canvas.removeEventListener('touchend', this.handleTouchEnd);
      this.canvas.removeEventListener('contextmenu', this.handleContextMenu);
    }

    this.keys.clear();
    this.actions.clear();
    this.justPressed.clear();
    this.actionListeners.clear();
  }
}
