import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { updateFormat } from '../reducer';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ViewComfy from '@material-ui/icons/ViewComfy';
import ViewCompact from '@material-ui/icons/ViewCompact';

const styles = {
  text: {
    padding: 0,
    lineHeight: 2.4,
    color: '#ffffff',
    textAlign: 'left',
    fontSize: '0.9rem',
  },
  link: {
    marginRight: 10,
    color: '#ffffff',
  },
  buttons: {
    float: 'right',
  },
};

class Description extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired,
    updateFormat: PropTypes.func.isRequired,
  };

  state = {
    sources: ['unsplash', 'pixabay', 'pexels'],
  }

  render() {
    const { classes, updateFormat, format } = this.props;
    const { sources } = this.state;

    return (
      <div className={classes.text}>
        {
          sources.map(source =>
            <a
              key={source}
              href={`https://${source}.com`}
              target="_blank"
              rel="noopener noreferrer"
              className={classes.link}>
              {`${source}.com`}
            </a>)
        }
        <ToggleButtonGroup value={format} exclusive className={classes.buttons} onChange={(event, newFormat) => updateFormat(newFormat || 'medium')}>
          <ToggleButton value="medium">
            <ViewComfy />
          </ToggleButton>
          <ToggleButton value="large">
            <ViewCompact />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
    );
  }
}

const mapState = state => ({
  format: state.format,
});

const mapDispatch = dispatch => ({
  updateFormat: format => dispatch(updateFormat(format)),
});

export default compose(withStyles(styles), connect(mapState, mapDispatch))(Description);
