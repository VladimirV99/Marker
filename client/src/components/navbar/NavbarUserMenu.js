import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Switch from '../switch/Switch';

class NavbarUserMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false
    };

    this.toggleDropdown = this.toggleDropdown.bind(this);
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  toggleDropdown() {
    if(this.state.open) {
      this.setState({ open: false });
      document.removeEventListener('click', this.handleClickOutside);
    } else {
      this.setState({ open: true });
      document.addEventListener('click', this.handleClickOutside);
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && (event.target.tagName==='A' || !this.wrapperRef.contains(event.target))) {
      this.toggleDropdown();
    }
  }

  render() {
    const { user } = this.props;

    if(!user)
      return null;

    return (
      <div ref={this.setWrapperRef} className={`dropdown ${this.state.open? 'dropdown-open': ''}`}>
        <div className='dropdown-toggle'>
          <div id='user-menu' className='nav-link' onClick={this.toggleDropdown}>
            <span className='profile-name'>{user.first_name + ' ' + user.last_name}</span>
            <img className='profile-icon' src={'http://localhost:5000/'+user.photo} alt={user.username} />
          </div>
        </div>

        {this.state.open ?
          <div className='dropdown-content'>
            <ul className='dropdown-menu'>
              <li className='dropdown-item'><Link className='dropdown-link' to='/profile'>Profile</Link></li>
              <li className='dropdown-item dropdown-switch'>
                Dark mode
                <Switch checked={user.dark_mode} onCheck={this.props.onDarkModeChange}></Switch>
              </li>
              <hr className='dropdown-divider'/>
              <li className='dropdown-item'>
                <a className='dropdown-link' href='/#' onClick={this.props.onLogoutClick}>Log Out</a>
              </li>
            </ul>
          </div>
        : null}
      </div>
    );
  }
}

export default NavbarUserMenu;