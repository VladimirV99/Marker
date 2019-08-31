import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

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
import Forum from './components/Forum';
import CreateThread from './components/CreateThread';
import Thread from './components/Thread';
import Profile from './components/Profile';
import User from './components/User';

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
            <Alert></Alert>
            <Route exact path='/' component={Categories} />
            <Route exact path='/register' component={Register} />
            <Route exact path='/login' component={Login} />

            <Route exact path='/profile' component={Profile} />
            <Route exact path='/user/:username' component={User} />

            <Route exact path='/forum/:id' component={Forum} />
            <Route exact path='/forum/:id/add' component={CreateThread} />
            <Route exact path='/thread/:id' component={Thread} />
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
