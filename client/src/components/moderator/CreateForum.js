import React, { Component } from 'react';
import { connect } from 'react-redux';

import { clearAlerts } from '../../actions/alertActions';

import Validation from '../../util/Validation';
import ValidationBlock from '../validation/ValidationBlock';

class CreateForum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      forum_name: '',
      forum_validation: [],
      forum_error: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    let res = Validation.validateForum(event.target.value);
    this.setState({
      forum_name: event.target.value,
      forum_validation: res.validation,
      forum_error: res.error
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.clearAlerts();

    const { forum_name } = this.state;

    let newForum = {
      name: forum_name,
      category: this.props.category
    };

    this.props.createForum(newForum);
    this.setState({ forum_name: '' });
  }

  render() {
    const { forum_name, forum_validation, forum_error } = this.state;
    const canSubmit = forum_name && !forum_error;

    return (
      <form onSubmit={this.handleSubmit} className='forum-create'>
        <div className='form-group-inline'>
          <input type='text' className='form-control' name='forum_name' value={forum_name} onChange={this.handleChange}></input>
          <input type='submit' disabled={!canSubmit} className='btn btn-primary' value='Create Forum'></input>
          <ValidationBlock validations={forum_validation}></ValidationBlock>
        </div>
      </form>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

const mapDispatchToProps = {
  clearAlerts
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateForum);