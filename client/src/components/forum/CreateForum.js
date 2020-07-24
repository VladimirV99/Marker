import React, { Component } from 'react';
import { connect } from 'react-redux';

import { clearAlerts } from '../../actions/alertActions';

class CreateForum extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.props.clearAlerts();

    const { name } = this.state;

    let newForum = {
      name,
      category: this.props.category
    };

    this.props.createForum(newForum);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className='forum-create'>
        <div className='form-group-inline'>
          <input type='text' className='form-control' name='name' onChange={this.handleChange}></input>
          <input type='submit' className='btn btn-primary' value='Create Forum'></input>
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