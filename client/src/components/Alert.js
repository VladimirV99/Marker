import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Alert.css';

import { returnErrors } from '../actions/errorActions';

class Alert extends Component {
  render() {
    return (
      <div className={`alert alert-error${this.props.error.message?'':' alert-hide'}`}>
        { this.props.error.message }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.error
});

const mapDispatchToProps = {
  returnErrors
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Alert);