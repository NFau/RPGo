
class CanvasManager {
  constructor (canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');

    this.map = {
      width: 900,
      height: 600,
      cases: []
    };

    this.playerSize = 50;
    this.currentPlayerId = null;
    this.players = {};

    this._drawPlayer = ::this._drawPlayer;
  }

  setCurrentPlayerId(id) {
    this.currentPlayerId = id;
  }

  addPlayer(id, position, username) {
    const color = (id == this.currentPlayerId ? 'red' : 'black');
    this.players[id] = {
      position: position,
      targetPosition: position,
      username: username,
      color: color
    }
  }

  removePlayer(id) {
    if (this.players[id]) {
      delete this.players[id];
    }
  }

  setPlayerPosition(id, position) {
    this.players[id].position = position;
  }

  setPlayerTargetPosition(id, position) {
    this.players[id].targetPosition = position;
  }

  draw () {
    this._drawMap();
    this._drawPlayers();
  }

  // Private methods

  _drawMap () {
    this.ctx.fillStyle = '#007F00';
    this.ctx.fillRect(0, 0, this.map.width, this.map.height);
  }

  _drawPlayers () {
    // Current player always on Top
    const playerIds = Object.keys(this.players);
    playerIds.forEach((playerId) => {
      if (playerId == this.currentPlayerId) {
        return;
      }
      this._drawPlayer(playerId);
    });
    if (this.currentPlayerId) {
      this._drawPlayer(this.currentPlayerId);
    }
  }

  _drawPlayer (id) {
    const player = this.players[id];
    const halfPlayerSize = this.playerSize / 2;
    this.ctx.fillStyle = player.color;

    this.ctx.fillRect(
      player.position.x - halfPlayerSize,
      player.position.y - halfPlayerSize,
      this.playerSize,
      this.playerSize
    );

    // Target pointer (debug)
    this.ctx.fillStyle = 'white';
    this.ctx.fillRect(
      player.targetPosition.x - 2, player.targetPosition.y - 2,
      5, 5
    );

    this._drawText(
        player.username,
        player.position.x,
        player.position.y + halfPlayerSize + 10
    );
  }

  _drawText (text, x, y) {
    this.ctx.fillStyle = 'black';
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.font = '15px Georgia';

    this.ctx.fillText(text, x, y);
  }
}

export default CanvasManager;
