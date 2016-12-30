import React, { Component } from 'react';

import Header from '../components/header';
import Game from '../components/game';

class GameView extends Component {
  render() {
    return (
        <div>
          <Header />
          <Game />
        </div>
    )
  }
}

export default GameView;
