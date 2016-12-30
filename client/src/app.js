import React, { Component } from 'react'
import { Provider } from 'react-redux'
import { Router, Route, hashHistory } from 'react-router'

import configureStore from './store/configureStore'
import GameView from './views/game'

const store = configureStore()

import './colors.scss';
import './style.scss';

export default class App extends Component {

  constructor() {
    super();
    this.declareRoutes = ::this.declareRoutes;
  }

  declareRoutes() {
    return (
      <Router history={hashHistory}>
        <Route path="/" component={GameView} />
      </Router>
    );
  }

  render() {
    return (
      <div>
        <Provider store={store}>
          {this.declareRoutes()}
        </Provider>
      </div>
    );
  }
}
