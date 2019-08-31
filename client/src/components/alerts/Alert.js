import React from 'react';
import { connect } from 'react-redux';

import { dismissAlert } from '../../actions/alertActions';

function Alert(props) {
  function handleClick(event) {
    event.preventDefault();
    props.dismissAlert(props.id);
  }

  return (
    <div className={`alert alert-${props.type}`}>
      { props.message }
      <span className='alert-delete' onClick={handleClick}>&times;</span> 
    </div>
  );
}

const mapDispatchToProps = {
  dismissAlert
};

export default connect(
  null,
  mapDispatchToProps
)(Alert);