import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { updateDisplay } from '../reducer';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardMedia from '@material-ui/core/CardMedia';
import OpenWith from '@material-ui/icons/OpenWith';
import Zoom from '@material-ui/core/Zoom';
import axios from 'axios';

const styles = {
  card: {
    width: 'calc(25% - 5px)',
    margin: 2.5
  },
  image: {
    width: '100%',
    display: 'block'
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    opacity: .1,
    backgroundColor: 'grey'
  },
  icon: {
    position: 'absolute',
    width: '80px',
    height: '80px',
    top: 'calc(50% - 40px)',
    left: 'calc(50% - 40px)',
    color: 'white'
  },
};

class Image extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired,
    data: PropTypes.object.isRequired,
    updateDisplay: PropTypes.func.isRequired,
  };

  state = {
    mouseOver: false,
  }

  mouseClick() {
    const { updateDisplay, data } = this.props;
    updateDisplay(data);
    this.setState({ mouseOver: false });
    axios.patch(`/api/images/${data.id}`, { click: data.click + 1 });
  }

  render() {
    const { classes, format, data } = this.props;
    const { mouseOver } = this.state;

    // TODO card width responsive
    // TODO image format
    return (
      <div
        className={classes.card}
        onClick={() => this.mouseClick()}
        onMouseEnter={() => this.setState({ mouseOver: true })}
        onMouseLeave={() => this.setState({ mouseOver: false })} >
        <img
          className={classes.image}
          src={`${data.url}?w=700`}
          alt={data.title} />
        { mouseOver && <div className={classes.overlay}></div> }
        <Zoom in={mouseOver}><OpenWith className={classes.icon} /></Zoom>
      </div>
    );
  }
}

const mapState = state => ({
  format: state.format,
});

const mapDispatch = dispatch => ({
  updateDisplay: image => dispatch(updateDisplay(image)),
});

export default compose(withStyles(styles), connect(mapState, mapDispatch))(Image);
