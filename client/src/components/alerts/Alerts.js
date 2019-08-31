import React from 'react';
import { connect } from 'react-redux';

import Alert from './Alert';

import './Alerts.css';

function Alerts(props) {
  return (
    props.alerts.map(alert => (
      <Alert key={alert.id} id={alert.id} message={alert.message} type={alert.type}></Alert>
    ))
  );
}

const mapStateToProps = state => ({
  alerts: state.alert.list
});

export default connect(
  mapStateToProps,
  null
)(Alerts);