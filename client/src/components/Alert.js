import React, { Component } from 'react';
import { connect } from 'react-redux';

import './Alert.css';

class Alert extends Component {
  render() {
    return (
      <div className={`alert alert-error${this.props.alert.message?'':' alert-hide'}`}>
        { this.props.alert.message }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  alert: state.alert
});

export default connect(
  mapStateToProps,
  null
)(Alert);