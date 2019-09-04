import React from 'react';
import { connect } from 'react-redux';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import AuthRoute from './AuthRoute';
import NonAuthRoute from './NonAuthRoute';

import Navbar from '../navbar/Navbar';
import Alerts from '../alerts/Alerts';
import Register from '../auth/Register';
import Login from '../auth/Login';
import Banner from '../banner/Banner';
import Categories from '../forum/Categories';
import Category from '../forum/Category';
import Forum from '../forum/Forum';
import CreateThread from '../forum/CreateThread';
import Thread from '../forum/Thread';
import Profile from '../user/Profile';
import User from '../user/User';

import './Window.css';

function Window(props) {
  return (
    <Router>
      <div id='window' className={`${props.auth.isAuthenticated && props.auth.user.dark_mode? 'dark_mode' : 'light_mode'}`}>
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
        <AuthRoute exact path='/forum/:id/add' component={CreateThread} />
        <Route exact path='/thread/:id' component={Thread} />
      </div>
    </Router>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  null
)(Window);