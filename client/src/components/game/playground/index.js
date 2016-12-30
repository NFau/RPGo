import React, { Component } from 'react';
import GameEngine from './engine/engine';

class PlayGround extends Component {
  constructor(props) {
    super(props);
    this.gameEngine = new GameEngine();
  }

  componentDidMount () {
    console.log('PlayGround componentDidMount');
    this.gameEngine.start('playground');
  }

  shouldComponentUpdate() {
    // Never refresh the PlayGround
    return false;
  }

  render () {
    return (
      <div className='PlayGround'>
        <canvas id="playground" width='900' height='600'>
          Please install a real browser
        </canvas>
      </div>
    );
  }
}

export default PlayGround;
