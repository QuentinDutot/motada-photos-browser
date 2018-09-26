import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import ParticleAnimation from 'react-particle-animation';
import Image from './Image';
import Search from './Search';

const ImageBank = require('../../../splashbase-api-interface/index.js');

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
  header: {
    top: 0,
    width: '70%',
    padding: '5% 15% 5% 15%',
    position: 'relative',
  },
  title: {
    color: '#ffffff',
    textAlign: 'left',
    fontSize: '1.2rem',
  },
  loadingBar: {
    top: 0,
    width: '100%',
    zIndex: 9999,
    position: 'fixed',
  },
  gallery: {
    top: 20,
    position: 'relative',
  },
};

class Home extends Component {
  state = {
    loading: false,
    images: [],
  }

  componentDidMount() {
    window.addEventListener('scroll', () => this.checkScrolling());
    // TODO checkApi
    this.loadDefault();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', () => this.checkScrolling());
  }

  loadDefault() {
    this.setState({ images: [] });
    this.loadLast();
    this.loadRandom(5);
  }

  saveImages(newImages) {
    for (let i=0;i<newImages.length;i++) {
      setTimeout(() => {
        const images = this.state.images;
        images.push(newImages[i]);
        this.setState({ images });
      } , i*500);
    }
  }

  saveApiResult(error, results) {
    console.log(error, results);
    this.setState({ loading: false });
    if (error) {
      // TODO
    } else {
      //const results = ['a', 'b', 'c', 'd', 'e', 'f'];// test only
      this.saveImages(results);
    }
  }

  checkApi() {
    ImageBank.check((err, res) => {
      // TODO
    });
  }

  loadSearch(search) {
    this.setState({ loading: true, images: [] });
    ImageBank.search(search, (err, res) => this.saveApiResult(err, res));
  }

  loadLast() {
    this.setState({ loading: true });
    ImageBank.last((err, res) => this.saveApiResult(err, res));
  }

  loadRandom(limit) {
    this.setState({ loading: true });
    ImageBank.random(limit, (err, res) => this.saveApiResult(err, res));
  }

  checkScrolling() {
    const windowHeight = "innerHeight" in window ? window.innerHeight : document.documentElement.offsetHeight;
    const body = document.body;
    const html = document.documentElement;
    const docHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight,  html.scrollHeight, html.offsetHeight);
    const windowBottom = windowHeight + window.pageYOffset;
    if (windowBottom >= docHeight && !this.state.loading) {
      this.loadRandom(5);
    }
  }

  render() {
    const { classes } = this.props;
    const { loading, images } = this.state;

    return (
      <div className={classes.root}>

        {// Background
          <ParticleAnimation
            numParticles={70}
            interactive={false}
            color={{ r: 130, g: 247, b: 249, a: 255 }}
            background={{ r: 30, g: 46, b: 79, a: 255 }}
            //background={{ r: 240, g: 240, b: 240, a: 255 }}
            className={classes.background} />
        }

        {// Loading animation
          loading && <LinearProgress className={classes.loadingBar}/>
        }

        {// Header with a search bar and suggestions
          <div className={classes.header}>
            <p className={classes.title}>Thousands of free images</p>
            <Search search={(keyword) => keyword ? this.loadSearch(keyword) : this.loadDefault()} />
          </div>
        }

        {// No data message
          !loading && images.length === 0 && <Typography variant="display3">No data found..</Typography>
        }

        {// Show the gallery
          <div className={classes.gallery}>
            { images.map((image) => <Image key={image} source={image} />) }
          </div>
        }

      </div>
    );
  }
}

export default withStyles(styles)(Home);
