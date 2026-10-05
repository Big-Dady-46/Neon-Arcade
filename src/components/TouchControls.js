/**
 * TouchControls - Dynamic virtual controller mapper for mobile and touchscreen gameplay.
 * Configures virtual D-pads and action buttons according to the active game's control requirements.
 */
export class TouchControls {
  constructor(inputManager, containerElement) {
    this.input = inputManager;
    this.container = containerElement;
    this.element = null;
  }

  configureForGame(controlsConfig = []) {
    if (!this.container) return;

    const dpad = this.container.querySelector('#dpadContainer');
    const actions = this.container.querySelector('#actionsContainer');

    const needsDpad = controlsConfig.includes('touch_dpad') || controlsConfig.includes('arrows') || controlsConfig.includes('wasd');
    const needsActions = controlsConfig.includes('touch_action') || controlsConfig.includes('space');

    if (dpad) {
      dpad.style.display = needsDpad ? 'block' : 'none';
    }

    if (actions) {
      actions.style.display = needsActions ? 'flex' : 'none';
    }
  }
}
