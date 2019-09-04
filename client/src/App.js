import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/authActions';

import './App.css';
import './Form.css';
import './Forum.css';

import AuthRoute from './components/common/AuthRoute';
import NonAuthRoute from './components/common/NonAuthRoute';

import Navbar from './components/navbar/Navbar';
import Alerts from './components/alerts/Alerts';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Banner from './components/banner/Banner';
import Categories from './components/forum/Categories';
import Category from './components/forum/Category';
import Forum from './components/forum/Forum';
import CreateThread from './components/forum/CreateThread';
import Thread from './components/forum/Thread';
import Profile from './components/user/Profile';
import User from './components/user/User';

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
            <Alerts></Alerts>
            <Route exact path='/' component={Categories} />

            <NonAuthRoute exact path='/register' component={Register} />
            <NonAuthRoute exact path='/login' component={Login} />
            
            <AuthRoute exact path='/profile' component={Profile} />
            <Route exact path='/user/:username' component={User} />

            <Route exact path='/category/:id' component={Category} />
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
