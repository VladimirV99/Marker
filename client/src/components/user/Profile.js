import React, { Component } from 'react';
import { connect } from 'react-redux';

import { clearAlerts } from '../../actions/alertActions';
import { updateProfile, updatePassword, updatePhoto } from '../../actions/authActions';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first_name: this.props.auth.isAuthenticated ? this.props.auth.user.first_name : '',
      last_name: this.props.auth.isAuthenticated ? this.props.auth.user.last_name : '',
      email: this.props.auth.isAuthenticated ? this.props.auth.user.email : '',
      current_password: '',
      new_password: '',
      new_password_confirm: '',
      photo_file: null,
      photo_name: '',
      photo_url: null
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleProfileSubmit = this.handleProfileSubmit.bind(this);
    this.handlePasswordSubmit = this.handlePasswordSubmit.bind(this);
    this.handlePhotoSelect = this.handlePhotoSelect.bind(this);
    this.handlePhotoSubmit = this.handlePhotoSubmit.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if(this.props.auth.isAuthenticated && this.props.auth.user !== prevProps.auth.user) {
      const { user } = this.props.auth;
      this.setState({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      });
    }
  }

  componentWillUnmount() {
    this.props.clearAlerts();
  }

  handleProfileSubmit(event) {
    event.preventDefault();
    this.props.clearAlerts();

    const { first_name, last_name, email } = this.state;

    const newProfile = {
      first_name,
      last_name,
      email
    };

    this.props.updateProfile(newProfile);
  }

  handlePasswordSubmit(event) {
    event.preventDefault();
    this.props.clearAlerts();

    const { current_password, new_password } = this.state;

    const newPassword = {
      old_password: current_password,
      new_password
    };

    this.props.updatePassword(newPassword);
  }

  handlePhotoSelect(event) {
    this.setState({
      photo_file: event.target.files[0],
      photo_name: event.target.files[0].name,
      photo_url: URL.createObjectURL(event.target.files[0])
    });
  }

  handlePhotoSubmit(event) {
    event.preventDefault();
    this.props.clearAlerts();

    this.props.updatePhoto(this.state.photo_file);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  render() {
    const { isAuthenticated, user } = this.props.auth;

    if(!isAuthenticated) {
      return null;
    }

    return (
      <main className='container'>
        <h2 className='text-center'>Update Photo</h2>
        <form onSubmit={this.handlePhotoSubmit} encType='multipart/form-data'>
          <img src={user.photo} alt={user.username} className='profile-photo' />
          <label className='btn btn-blue'>Select photo<input type='file' name='photo' className='display-none' onChange={this.handlePhotoSelect}/></label>
          {this.state.photo_url? <img src={this.state.photo_url} alt={user.username} className='profile-photo' /> : null}
          <input type='submit' className='btn btn-blue' value='Update Photo' />
        </form>

        <h2 className='text-center'>Update Profile</h2>
        <form onSubmit={this.handleProfileSubmit}>
          <div className='form-group'>
            <label htmlFor='first_name'>First Name</label>
            <input type='text' className='form-control' name='first_name' value={this.state.first_name} onChange={this.handleChange}></input>
          </div>
          <div className='form-group'>
            <label htmlFor='last_name'>Last Name</label>
            <input type='text' className='form-control' name='last_name' value={this.state.last_name} onChange={this.handleChange}></input>
          </div>
          <div className='form-group'>
            <label htmlFor='email'>Email</label>
            <input type='text' className='form-control' name='email' value={this.state.email} onChange={this.handleChange}></input>
          </div>
          <input type='submit' className='btn btn-blue btn-block' value='Update Profile'></input>
        </form>

        <h2 className='text-center'>Change Password</h2>
        <form onSubmit={this.handlePasswordSubmit}>
          <div className='form-group'>
            <label htmlFor='current_password'>Current Password</label>
            <input type='password' className='form-control' name='current_password' onChange={this.handleChange}></input>
          </div>
          <div className='form-group'>
            <label htmlFor='new_password'>New Password</label>
            <input type='password' className='form-control' name='new_password' onChange={this.handleChange}></input>
          </div>
          <div className='form-group'>
            <label htmlFor='new_password_confirm'>Confirm New Password</label>
            <input type='password' className='form-control' name='new_password_confirm' onChange={this.handleChange}></input>
          </div>
          <input type='submit' className='btn btn-blue btn-block' value='Change Password'></input>
        </form>
      </main>
    );
  }

}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  clearAlerts, updateProfile, updatePassword, updatePhoto
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Profile);