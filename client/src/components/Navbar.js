import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logout } from '../actions/authActions';
import UserMenu from './UserMenu';

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.onLogoutClick = this.onLogoutClick.bind(this);
  }

  onLogoutClick() {
    this.props.logout();
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <li className='nav-item'>
        <UserMenu user={user} onLogoutClick={this.onLogoutClick}></UserMenu>
      </li>
    );

    const guestLinks = (
      <Fragment>
        <li className='nav-item'>
          <Link to='/register' className='nav-link'>Register</Link>
        </li>
        <li className='nav-item'>
          <Link to='/login' className='nav-link'>Log In</Link>
        </li>
      </Fragment>
    );

    return (
      <nav className='navbar bg-color-blue'>
        <Link to='/' className='navbar-brand'>Marker</Link>

        <ul className='navbar-nav'>
          { isAuthenticated ? authLinks : guestLinks }
        </ul>
      </nav>
    );
  }

}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  logout
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);