import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import axios from 'axios';

import { clearAlerts } from '../../actions/alertActions';
import { register } from '../../actions/authActions';

import Validation from '../../util/Validation';
import ValidationBlock from '../validation/ValidationBlock';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      username_validation: [],
      username_error: false,
      first_name: '',
      first_name_validation: [],
      first_name_error: false,
      last_name: '',
      last_name_validation: [],
      last_name_error: false,
      email: '',
      email_validation: [],
      email_error: false,
      password: '',
      password_validation: [],
      password_error: false,
      password_confirm: '',
      password_confirm_validation: [],
      password_confirm_error: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillUnmount() {
    this.props.clearAlerts();
  }

  handleChange(event) {
    let res;
    switch(event.target.name) {
      case 'username':
        res = Validation.validateUsername(event.target.value);
        if(!res.error) {
          axios.get(`/api/users/checkUsername/${event.target.value}`).then(res => {
            this.setState({
              username_validation: [
                ...this.state.username_validation,
                { key: 10, message: 'Username is available', type: 'success' }
              ]
            });
          }).catch(err => {
            if(err.response.status === 400) {
              this.setState({
                username_validation: [
                  ...this.state.username_validation,
                  { key: 10, message: 'Username is already taken', type: 'error' }
                ],
                username_error: true
              });
            }
          });
        }
        this.setState({ 
          username: event.target.value,
          username_validation: res.validation,
          username_error: res.error
        });
        break;
      case 'first_name':
        res = Validation.validateFirstName(event.target.value);
        this.setState({ 
          first_name: event.target.value,
          first_name_validation: res.validation,
          first_name_error: res.error
        });
        break;
      case 'last_name':
        res = Validation.validateLastName(event.target.value);
        this.setState({ 
          last_name: event.target.value,
          last_name_validation: res.validation,
          last_name_error: res.error,
          input_dirty: true
        });
        break;
      case 'email':
        res = Validation.validateEmail(event.target.value);
        if(!res.error) {
          axios.get(`/api/users/checkEmail/${event.target.value}`).then(res => {
            this.setState({
              email_validation: [
                ...this.state.username_validation,
                { key: 10, message: 'Email is available', type: 'success' }
              ]
            });
          }).catch(err => {
            if(err.response.status === 400) {
              this.setState({
                email_validation: [
                  ...this.state.email_validation,
                  { key: 10, message: 'Email is already taken', type: 'error' }
                ],
                email_error: true
              });
            }
          });
        }
        this.setState({ 
          email: event.target.value,
          email_validation: res.validation,
          email_error: res.error
        });
        break;
      case 'password':
        res = Validation.validatePassword(event.target.value);
        this.setState({ 
          password: event.target.value,
          password_validation: res.validation,
          password_error: res.error
        });
        break;
      case 'password_confirm':
        res = Validation.validatePasswordConfirm(this.state.password, event.target.value);
        this.setState({ 
          password_confirm: event.target.value,
          password_confirm_validation: res.validation,
          password_confirm_error: res.error
        });
        break;
      default:
        this.setState({ 
          [event.target.name]: event.target.value
        });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const { username, first_name, last_name, email, password } = this.state;

    const newUser = {
      username,
      first_name,
      last_name,
      email,
      password
    };

    this.props.register(newUser, this.props.history);
  }

  render() {
    const { 
      username, username_validation, username_error,
      first_name, first_name_validation, first_name_error,
      last_name, last_name_validation, last_name_error,
      email, email_validation, email_error,
      password, password_validation, password_error,
      password_confirm, password_confirm_validation, password_confirm_error
    } = this.state;

    const can_submit = (username && first_name && last_name && email && password && password_confirm) && !(username_error || first_name_error || last_name_error || email_error || password_error || password_confirm_error);

    return(
      <div className='container'>
        <form onSubmit={this.handleSubmit}>
          <div className='form-group'>
            <label htmlFor='username'>Username</label>
            <input type='text' className={`form-control ${username_error? 'form-control-invalid' : ''}`} name='username' onChange={this.handleChange}></input>
            <ValidationBlock validations={username_validation}></ValidationBlock>
          </div>
          <div className='form-row'>
            <div className='form-group w-50 pr-025'>
              <label htmlFor='first_name'>First Name</label>
              <input type='text' className={`form-control ${first_name_error? 'form-control-invalid' : ''}`} name='first_name' onChange={this.handleChange}></input>
              <ValidationBlock validations={first_name_validation}></ValidationBlock>
            </div>
            <div className='form-group w-50 pl-025'>
              <label htmlFor='last_name'>Last Name</label>
              <input type='text' className={`form-control ${last_name_error? 'form-control-invalid' : ''}`} name='last_name' onChange={this.handleChange}></input>
              <ValidationBlock validations={last_name_validation}></ValidationBlock>
            </div>
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='text' className={`form-control ${email_error? 'form-control-invalid' : ''}`} name='email' onChange={this.handleChange}></input>
            <ValidationBlock validations={email_validation}></ValidationBlock>
          </div>
          <div className='form-group'>
            <label htmlFor='password'>Password</label>
            <input type='password' className={`form-control ${password_error? 'form-control-invalid' : ''}`} name='password' onChange={this.handleChange}></input>
            <ValidationBlock validations={password_validation}></ValidationBlock>
          </div>
          <div className='form-group'>
            <label htmlFor='password_confirm'>Confirm Password</label>
            <input type='password' className={`form-control ${password_confirm_error? 'form-control-invalid' : ''}`} name='password_confirm' onChange={this.handleChange}></input>
            <ValidationBlock validations={password_confirm_validation}></ValidationBlock>
          </div>
          <input type='submit' disabled={!can_submit} className='btn btn-primary btn-block' value='Register'></input>
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
  clearAlerts, register
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(Register));