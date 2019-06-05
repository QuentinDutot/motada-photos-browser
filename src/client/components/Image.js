import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { updateDisplay } from '../reducer';
import OpenWith from '@material-ui/icons/OpenWith';
import FavoriteBorder from '@material-ui/icons/FavoriteBorder';
import Zoom from '@material-ui/core/Zoom';
import axios from 'axios';

const styles = {
  card: {
    cursor: 'pointer',
    margin: 2.5,
    '@media screen and (min-width: 1251px)': { width: 'calc(25% - 5px)' },
    '@media screen and (max-width: 1250px)': { width: 'calc(33% - 5px)' },
    '@media screen and (max-width: 950px)': { width: 'calc(50% - 5px)' },
    '@media screen and (max-width: 630px)': { width: 'calc(100% - 5px)' },
  },
  image: {
    width: '100%',
    display: 'block'
  },
  bar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '45%',
    height: 50,
    marginTop: -65,
    float: 'right',
    opacity: .9,
    color: 'white',
    fontSize: '28px',
    borderRadius: '27px 0 0 27px',
    backgroundColor: '#00000099'
  },
  heart: {
    width: '32px',
    height: '32px',
    marginLeft: 10
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
    data: PropTypes.object.isRequired,
    updateDisplay: PropTypes.func.isRequired,
  };

  state = {
    mouseOver: false,
    favorites: this.getFavorites(),
  }

  mouseClick() {
    const { updateDisplay, data } = this.props;
    updateDisplay(data);
    this.setState({ mouseOver: false });
    axios.patch(`/api/images/${data.id}`, { click: data.click + 1 });
  }

  getFavorites() {
    const min = 10;
    const max = 2000;

    const favorites = (Math.floor(Math.random() * (max - min + 1)) + min).toString();

    const thousands = favorites.substring(0, favorites.length-3);
    const hundreds = favorites.substring(favorites.length-3, favorites.length-2);

    return favorites < 1000 ? favorites : `${thousands}.${hundreds} k`;
  }

  render() {
    const { classes, data } = this.props;
    const { mouseOver, favorites } = this.state;

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
        { mouseOver
          ? <div className={classes.overlay}></div>
          :  <div className={classes.bar}>
          {favorites}
          <FavoriteBorder className={classes.heart} fontSize="large" />
        </div>}
        <Zoom in={mouseOver}><OpenWith className={classes.icon} /></Zoom>
      </div>
    );
  }
}

const mapDispatch = dispatch => ({
  updateDisplay: image => dispatch(updateDisplay(image)),
});

export default compose(withStyles(styles), connect(() => {}, mapDispatch))(Image);
