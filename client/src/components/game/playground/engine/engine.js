import CanvasManager from './canvas';
import WebsocketManager from './websocket';
import InputManager from './input';

import { getTimestamp } from './utils/time';
import Vector2 from './utils/vector';

const GAME_INIT = 1;
const GAME_RUNNING = 2;

class GameEngine {
  constructor() {
    this.frameCounter = 0;
    this.gameWorkflowStep = 0;

    // Expressed in MS
    this.inputCheckInterval = 150;

    this.mockConfig = {
      username: 'Johnson'
    }

    this.currentPlayerId = null;
    this.players = {};

    this.processFrame = ::this.processFrame;
    this.newMessageHandler = ::this.newMessageHandler;
  }

  start (canvasId) {
    this.canvasManager = new CanvasManager(canvasId);
    this.wsManager = new WebsocketManager(this.newMessageHandler);
    this.inputManager = new InputManager();

    this.gameWorkflowStep = GAME_INIT;

    this.wsManager.connect().then(() => {
      this.lastTime = getTimestamp();
      this.wsManager.send('JOIN_GAME', {
          username: this.mockConfig.username
      });
    });

  }

  setPlayerConfig(config) {
    if (!config.username) { return false; }
    this.player.username = config.username;
    return true;
  }

  // Computing
  computeMove (deltatime) {
    const playerIds = Object.keys(this.players);
    playerIds.forEach((playerId) => {
      const player = this.players[playerId];
      if (!player.moving) { return }

      // TODO: Try to replace me with a LERP
      //       -> Server need to have a fixed rate for response

      const nextPosition = player.position.moveTo(
        player.targetPosition,
        player.speed * deltatime
      )

      player.position = nextPosition;
      player.moving = !player.position.equals(player.targetPosition);

      this.canvasManager.setPlayerPosition(playerId, player.position);
      this.canvasManager.setPlayerTargetPosition(playerId, player.targetPosition);
    });
  }

  // Controls
  processInputs (deltatime) {
    // Move inputs
    this.moveElapsedTime += deltatime;

    if (this.moveElapsedTime <= this.inputCheckInterval / 1000) { return }

    const elapsedTime = this.moveElapsedTime;
    this.moveElapsedTime = 0;

    const { xAxis, yAxis } = this.inputManager.getAxes();
    if (!xAxis && !yAxis) { return }

    const player = this.players[this.currentPlayerId];
    const translation = new Vector2(
      xAxis * player.speed * elapsedTime,
      yAxis * player.speed * elapsedTime
    );

    this.wsManager.send('SET_RELATIVE_POSITION', {
      'x': translation.x,
      'y': translation.y
    });

    player.targetPosition = player.targetPosition.add(translation);
    player.moving = true;
  }

  // Network
  newMessageHandler (json) {
    const type = json.event;
    const data = json.data;
    if (this.gameWorkflowStep == GAME_INIT) {
      if (type == 'JOINED_GAME') {
        this.startGame(data.playerId, data.snapshot)
      }
    } else if (this.gameWorkflowStep == GAME_RUNNING) {
      switch (type) {
        case 'PLAYER_POSITION_UPDATE':
          const player = this.players[data.playerId];
          const serverPosition = new Vector2(data.x, data.y);

          player.moveStartAt = getTimestamp();
          player.moving = true;

          // If the user next position is the same on the server, do nothing
          if (player.id == this.currentPlayerId
              && player.targetPosition.equals(serverPosition)
          ) {
            break;
          }

          player.targetPosition = serverPosition;
          break;

        case 'NEW_PLAYER':
          this.addPlayer(data);
          break;

        case 'PLAYER_LEFT':
          this.canvasManager.removePlayer(data.id);
          break;
      }
    }
  }

  startGame(playerId, snapshot) {
    // Will be removed when different sprite will be used
    this.canvasManager.setCurrentPlayerId(playerId);

    // Load snashot
    this.loadSnapshot(snapshot);

    this.currentPlayerId = playerId;
    this.moveElapsedTime = 0;
    this.gameWorkflowStep = GAME_RUNNING;

    // Let's go !
    this.inputManager.startRecording();
    requestAnimationFrame(this.processFrame);
  }

  loadSnapshot (snapshot) {
    snapshot['players'].forEach((player) => {
      this.addPlayer(player);
    })
  }

  addPlayer(playerData) {
    const player = {
      id: playerData.id,
      username: playerData.username,
      position: new Vector2(playerData.x, playerData.y),
      targetPosition: new Vector2(playerData.x, playerData.y),
      speed: playerData.speed,
      moving: false
    };

    this.players[player.id] = player;

    // TODO: addSprite instead of player
    this.canvasManager.addPlayer(
      player.id,
      player.position,
      player.username
    )
  }

  processFrame () {
    const currentTime = getTimestamp()
    const deltatime = Math.min(1, (currentTime - this.lastTime) / 1000);

    this.lastTime = currentTime;
    this.frameCounter += 1;

    this.processInputs(deltatime);
    this.computeMove(deltatime);

    this.canvasManager.draw();

    requestAnimationFrame(this.processFrame);
  }

}

export default GameEngine;
