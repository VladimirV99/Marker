import React, { Component } from 'react';

class UserMenu extends Component {
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
      document.removeEventListener('mousedown', this.handleClickOutside);
    } else {
      this.setState({ open: true });
      document.addEventListener('mousedown', this.handleClickOutside);
    }
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClickOutside(event) {
    if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
      this.toggleDropdown();
    }
  }

  render() {
    const { user } = this.props;

    return (
      <div ref={this.setWrapperRef} className={`dropdown ${this.state.open? 'dropdown-open': ''}`}>
        <div className='dropdown-toggle'>
          <a className='nav-link' href='/#' role='button' onClick={this.toggleDropdown}>
            { user ? user.first_name + ' ' + user.last_name : '' }
          </a>
        </div>

        {this.state.open ?
          <div>
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
                  <a className='dropdown-link' href='/#' onClick={this.props.onLogoutClick}>Log Out</a>
                </li>
              </ul>
            </div>
          </div>
        : null}
      </div>
    );
  }
}

export default UserMenu;