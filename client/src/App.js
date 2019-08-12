import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

import './App.css';

import Navbar from './components/Navbar';
import Alert from './components/Alert';
import Register from './components/Register';
import Login from './components/Login';
import Banner from './components/Banner';
import Categories from './components/Categories';

class App extends Component {
  componentDidMount() {
    store.dispatch(loadUser());
  }

  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className='App'>
            <Navbar></Navbar>
            <Route exact path='/' component={Banner} />
            <Route exact path='/' component={Categories} />
            <Alert></Alert>
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
