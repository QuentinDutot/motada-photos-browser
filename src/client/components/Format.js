import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { updateFormat } from '../reducer';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ViewComfy from '@material-ui/icons/ViewComfy';
import ViewCompact from '@material-ui/icons/ViewCompact';

class Format extends Component {
  static propTypes = {
    format: PropTypes.string.isRequired,
    updateFormat: PropTypes.func.isRequired,
  };

  render() {
    const { updateFormat, format } = this.props;

    return (
      <ToggleButtonGroup
        exclusive
        value={format}
        style={{ float: 'right' }}
        onChange={(event, newFormat) => updateFormat(newFormat || 'medium')}>
        <ToggleButton value="medium">
          <ViewComfy />
        </ToggleButton>
        <ToggleButton value="large">
          <ViewCompact />
        </ToggleButton>
      </ToggleButtonGroup>
    );
  }
}

const mapState = state => ({
  format: state.format,
});

const mapDispatch = dispatch => ({
  updateFormat: format => dispatch(updateFormat(format)),
});

export default connect(mapState, mapDispatch)(Format);
