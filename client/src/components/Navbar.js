import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';

import { logout } from '../actions/authActions';

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
      <Fragment>
        <li className='nav-item'>

        <div className='dropdown'>

          <div className="dropdown-toggle">
            <a className='nav-link' href='/#' role='button'>
              { user ? this.props.auth.user.first_name + ' ' + this.props.auth.user.last_name : '' }
            </a>
          </div>

          <div className='dropdown-content'>
            <ul className='dropdown-menu'>
              <li className='dropdown-item'><a className='dropdown-link' href='/#'>Profile</a></li>
              <li className='dropdown-item'>
                Dark mode
                <label className='switch'>
                  <input type='checkbox'></input>
                </label>
              </li>
              <hr className='dropdown-divider'/>
              <li className='dropdown-item'>
                <a className='dropdown-link' href='/#' onClick={this.onLogoutClick}>Log Out</a>
              </li>
            </ul>

          </div>
        </div>

        </li>
      </Fragment>
    );

    const guestLinks = (
      <Fragment>
        <li className='nav-item'>
          <a className='nav-link' href='/#' role='button'>Register</a>
        </li>
        <li className='nav-item'>
          <a className='nav-link' href='/#' role='button'>Log In</a>
        </li>
      </Fragment>
    );

    return (
      <nav className='navbar bg-color-blue'>
        <a className='navbar-brand' href='/#'>Marker</a>

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