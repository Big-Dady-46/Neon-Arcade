/**
 * GameLoop - Robust requestAnimationFrame game loop with delta time clamping,
 * FPS calculation, and Page Visibility API integration.
 */
export class GameLoop {
  constructor(updateCallback, renderCallback) {
    this.updateCallback = updateCallback;
    this.renderCallback = renderCallback;
    
    this.rafId = null;
    this.lastTime = 0;
    this.isRunning = false;
    this.isPaused = false;
    
    // FPS tracking
    this.fps = 60;
    this.frameCount = 0;
    this.fpsTimeAccumulator = 0;
    
    // Max delta time to prevent physics explosions after pause or tab switch (100ms)
    this.maxDelta = 0.1;
    
    this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
    this.loop = this.loop.bind(this);
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.isPaused = false;
    this.lastTime = performance.now();
    this.frameCount = 0;
    this.fpsTimeAccumulator = 0;
    
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
    this.rafId = requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
    this.isPaused = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    if (!this.isRunning) {
      this.start();
      return;
    }
    this.isPaused = false;
    this.lastTime = performance.now();
  }

  handleVisibilityChange() {
    if (document.hidden) {
      this.pause();
    } else {
      this.resume();
    }
  }

  loop(currentTime) {
    if (!this.isRunning) return;

    this.rafId = requestAnimationFrame(this.loop);

    if (this.isPaused) {
      this.lastTime = currentTime;
      return;
    }

    // Calculate delta time in seconds
    let dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Clamp delta time to avoid large jumps
    if (dt > this.maxDelta) {
      dt = this.maxDelta;
    }

    // FPS calculation
    this.frameCount++;
    this.fpsTimeAccumulator += dt;
    if (this.fpsTimeAccumulator >= 0.5) {
      this.fps = Math.round((this.frameCount / this.fpsTimeAccumulator));
      this.frameCount = 0;
      this.fpsTimeAccumulator = 0;
    }

    // Execute update and render callbacks
    if (this.updateCallback) {
      this.updateCallback(dt);
    }
    if (this.renderCallback) {
      this.renderCallback();
    }
  }
}
