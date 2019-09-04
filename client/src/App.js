import React, { Component } from 'react';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

import './App.css';
import './Form.css';
import './Forum.css';

import Window from './components/common/Window';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <Window></Window>
      </Provider>
    );
  }
}

export default App;