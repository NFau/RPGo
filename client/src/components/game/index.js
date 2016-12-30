import React, { Component } from 'react';

import PlayGround from './playground';
import SideBar from './sidebar';

import './game.scss'

class Game extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount () {
    console.log('PlayGround componentDidMount');

  }

  render () {
    return (
      <div className='Game'>
          <PlayGround/>
          <SideBar />
      </div>
    );
  }
}

export default Game;
