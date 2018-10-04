import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { reachBottom } from '../reducer';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import ParticleAnimation from 'react-particle-animation';
import Notification from './Notification';
import Header from './Header';
import Gallery from './Gallery';

const styles = {
  root: {
    paddingBottom: 50,
    backgroundColor: 'rgb(30, 46, 79)',
  },
  background: {
    top: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  loadingBar: {
    top: 0,
    width: '100%',
    zIndex: 9999,
    position: 'fixed',
  },
};

class Home extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    bottomReached: PropTypes.bool.isRequired,
    reachBottom: PropTypes.func.isRequired,
  };

  componentDidMount() {
    window.addEventListener('scroll', () => this.checkScrolling());
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', () => this.checkScrolling());
  }

  checkScrolling() {
    const { bottomReached, reachBottom } = this.props;
    const { body, documentElement } = document;
    const windowHeight = 'innerHeight' in window ? window.innerHeight : documentElement.offsetHeight;
    const windowBottom = windowHeight + window.pageYOffset + 300;
    const docHeight = Math.max(
      body.scrollHeight, body.offsetHeight,
      documentElement.clientHeight, documentElement.scrollHeight, documentElement.offsetHeight,
    );
    if (windowBottom >= docHeight && !bottomReached) {
      reachBottom(true);
    } else if(bottomReached) {
      reachBottom(false);
    }
  }

  render() {
    const { classes, loading } = this.props;

    const paBackgroundColor = {
      r: 30, g: 46, b: 79, a: 255,
    };
    const paColor = {
      r: 130, g: 247, b: 249, a: 255,
    };

    return (
      <div className={classes.root}>

        {// Background
          <ParticleAnimation
            numParticles={70}
            interactive={false}
            color={paColor}
            background={paBackgroundColor}
            // background={{ r: 240, g: 240, b: 240, a: 255 }}
            className={classes.background} />
        }

        { loading && <LinearProgress className={classes.loadingBar} /> }
        <Header />
        <Gallery />
        <Notification />

      </div>
    );
  }
}

const mapState = state => ({
  loading: state.loading,
  bottomReached: state.bottomReached,
});

const mapDispatch = dispatch => ({
  reachBottom: reached => dispatch(reachBottom(reached)),
});

export default compose(withStyles(styles), connect(mapState, mapDispatch))(Home);
