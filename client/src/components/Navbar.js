import React, { Component } from 'react';
import { connect } from 'react-redux';

class Navbar extends Component {

  render() {
    return (
      <nav className="navbar bg-color-blue">
        <a className="navbar-brand" href="#">Marker</a>

        <ul className="navbar-nav">
          <li className="nav-item">

            <div className="dropdown">

              <div className="dropdown-toggle">
                <a className="nav-link" href="#" role="button">
                  Name
                </a>
              </div>

              <div className="dropdown-content">
                <ul className="dropdown-menu">
                  <li className="dropdown-item"><a className="dropdown-link" href="#">Profile</a></li>
                  <li className="dropdown-item">
                    Dark mode
                    <label className="switch">
                      <input type="checkbox"></input>
                    </label>
                  </li>
                  <hr className="dropdown-divider"/>
                  <li className="dropdown-item"><a className="dropdown-link" href="#">Log Out</a></li>
                </ul>

              </div>
            </div>

          </li>
        </ul>
      </nav>
    );
  }

}

export default Navbar;