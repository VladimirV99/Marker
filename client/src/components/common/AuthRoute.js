import React from 'react';
import { connect } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const AuthRoute = ({ component: Component, auth, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      !auth.isLoaded || auth.isAuthenticated ? (
        <Component {...props} />
      ) : (
        <Redirect to='/login' />
      )
    }
  />
);

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(AuthRoute);