import React from 'react';

export default function ValidationBlock(props) {
  return (
    <ul className='validation-block'>
      {props.validations.map(validation => (
        <li key={validation.key} className={`validation-item ${'validation-'+validation.type}`}>{validation.message}</li>
      ))}
    </ul>
  );
}