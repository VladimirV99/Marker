import React, { Component } from 'react';
import { connect } from 'react-redux';

import { login } from '../actions/authActions';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();

    const { username, password } = this.state;

    const user = {
      username,
      password
    };

    this.props.login(user);
  }

  render() {
    return(
      <div className='container'>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label for='username'>Username</label>
            <input type='text' className='form-control' name='username' onChange={this.handleChange}></input>
          </div>
          <div className='form-group'>
            <label for='password'>Password</label>
            <input type='password' className='form-control' name='password' onChange={this.handleChange}></input>
          </div>
          <input type='submit' className='btn btn-blue btn-block' value='Log In'></input>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.auth.isAuthenticated,
  error: state.error
});

const mapDispatchToProps = {
  login
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);