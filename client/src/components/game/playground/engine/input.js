
const KEY_UP = 38;
const KEY_DOWN = 40;
const KEY_LEFT = 37;
const KEY_RIGHT = 39;


class InputManager {
  constructor () {
    this.bindedKeys = [KEY_UP, KEY_DOWN, KEY_LEFT, KEY_RIGHT]
    this.pressedKeys = []

    this.keyUpHandler = ::this.keyUpHandler;
    this.keyDownHandler = ::this.keyDownHandler;
  }

  startRecording () {
    window.addEventListener('keydown', this.keyDownHandler, true);
    window.addEventListener('keyup', this.keyUpHandler, true);
  }

  getAxes () {
    let xAxis = 0;
    let yAxis = 0;

    if (this.pressedKeys.indexOf(KEY_DOWN) >= 0) { yAxis += 1; }
    if (this.pressedKeys.indexOf(KEY_UP) >= 0) { yAxis -= 1; }
    if (this.pressedKeys.indexOf(KEY_LEFT) >= 0) { xAxis -= 1; }
    if (this.pressedKeys.indexOf(KEY_RIGHT) >= 0) { xAxis += 1; }

    if (xAxis && yAxis) {
      xAxis *= 0.669;
      yAxis *= 0.669;
    }

    return { xAxis, yAxis };
  }

  keyDownHandler (event) {
    // Cancel the default action to avoid it being handled twice
    if (this.bindedKeys.indexOf(event.keyCode) >= 0) {
      event.preventDefault();
      if (this.pressedKeys.indexOf(event.keyCode) == -1) {
        this.pressedKeys.push(event.keyCode);
      }
    }
  }

  keyUpHandler (event) {
    const idx = this.pressedKeys.indexOf(event.keyCode);
    if (idx >= 0) {
      this.pressedKeys.splice(idx, 1);
    }
  }

};

export default InputManager;
