import React, { Component, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { logout, setDarkMode } from '../../actions/authActions';
import NavbarUserMenu from './NavbarUserMenu';

import './Navbar.css';

class Navbar extends Component {
  constructor(props) {
    super(props);

    this.onLogoutClick = this.onLogoutClick.bind(this);
    this.onDarkModeChange = this.onDarkModeChange.bind(this);
  }

  onLogoutClick() {
    this.props.logout();
  }

  onDarkModeChange(flag) {
    this.props.setDarkMode(flag);
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    const authLinks = (
      <li className='nav-item nav-item-dropdown'>
        <NavbarUserMenu user={user} onLogoutClick={this.onLogoutClick} onDarkModeChange={this.onDarkModeChange}></NavbarUserMenu>
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
      <nav className='navbar'>
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
  logout, setDarkMode
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navbar);