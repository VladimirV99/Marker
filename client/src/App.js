import React, { Component } from 'react';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

import './App.css';

import Navbar from './components/Navbar';
import Alert from './components/Alert';
import Register from './components/Register';
import Login from './components/Login';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <Navbar></Navbar>
          <Alert></Alert>
          <Register></Register>
          <Login></Login>
        </div>
      </Provider>
    );
  }
}

export default App;
