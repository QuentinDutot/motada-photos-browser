import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import LinearProgress from '@material-ui/core/LinearProgress';
import ParticleAnimation from 'react-particle-animation';
import FlagIcon from 'react-flag-kit/lib/FlagIcon';
import Snackbar from '@material-ui/core/Snackbar';
import axios from 'axios';
import Image from './Image';
import Search from './Search';

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
  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  state = {
    loading: false,
    count: 0,
    images: [],
    notification: '',
  }

  componentDidMount() {
    window.addEventListener('scroll', () => this.checkScrolling());
    this.loadCount();
    this.loadDefault();
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', () => this.checkScrolling());
  }

  loadDefault() {
    this.setState({ images: [] });
    this.loadLast(15);
    this.loadRandom(30);
  }

  saveImages(newImages) {
    for (let i = 0; i < newImages.length; i++) {
      setTimeout(() => {
        const { images } = this.state;
        if (!images.find(e => e.id === newImages[i].id)) {
          images.push(newImages[i]);
          this.setState({ images });
        }
      }, i * 500);
    }
  }

  request(url) {
    axios(url)
      .then((res) => {
        console.log(res.data);
        if(res.data && res.data.length > 0) {
          this.saveImages(res.data);
        } else {
          this.updateNotification('Oops no results !');
        }
      })
      .catch((err) => {
        console.log(err);
        this.updateNotification('Oops an error has occurred !');
      })
      .then(() => {
        this.setState({ loading: false });
      });
  }

  loadCount() {
    axios('/api/images?count').then((res) => this.setState({ count: res.data.images }));
  }

  loadSearch(search) {
    this.setState({ loading: true, images: [] });
    this.request(`/api/images?tags=${search.split(' ').join(',')}`);
  }

  loadLast(limit) {
    this.setState({ loading: true });
    this.request(`/api/images?last=${limit}`);
  }

  loadRandom(limit) {
    this.setState({ loading: true });
    this.request(`/api/images?random=${limit}`);
  }

  checkScrolling() {
    const { loading } = this.state;
    const { body, documentElement } = document;
    const windowHeight = 'innerHeight' in window ? window.innerHeight : documentElement.offsetHeight;
    const windowBottom = windowHeight + window.pageYOffset;
    const docHeight = Math.max(
      body.scrollHeight, body.offsetHeight,
      documentElement.clientHeight, documentElement.scrollHeight, documentElement.offsetHeight,
    );
    if (windowBottom >= docHeight && !loading) {
      this.loadRandom(30);
    }
  }

  updateNotification(notification) {
    this.setState({ notification });
  }

  render() {
    const { classes } = this.props;
    const { loading, images, count, notification } = this.state;
    const formattedCount = count !== 0 ? count : 'thousands';

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

        {// Loading animation
          loading && <LinearProgress className={classes.loadingBar} />
        }

        {// Header with a search bar and suggestions
          <div className={classes.header}>
            <p className={classes.title}>{`Search over ${formattedCount} of free and hig-res images`}</p>
            <FlagIcon code="GB" size={32} style={{ cursor: 'pointer' }} onClick={() => console.log('translation !')}/>
            <Search search={keyword => keyword ? this.loadSearch(keyword) : this.loadDefault()} />
          </div>
        }

        {// Show the gallery
          <div className={classes.gallery}>
            { images.map(image => <Image key={image.id} source={image.url} />) }
          </div>
        }

        {// Error informations
          <Snackbar
            open={notification.length > 0}
            autoHideDuration={6000}
            onClose={() => this.updateNotification('')}
            message={notification} />
        }

      </div>
    );
  }
}

export default withStyles(styles)(Home);
