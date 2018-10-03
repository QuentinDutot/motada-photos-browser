import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { updateNotification, isLoading, cleanImages, addImage, reachBottom, loadRandomImages } from '../reducer';
import axios from 'axios';
import Image from './Image';

const styles = {
  gallery: {
    top: 20,
    position: 'relative',
  },
};

class Gallery extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    search: PropTypes.string.isRequired,
    bottomReached: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    isLoading: PropTypes.func.isRequired,
    updateNotification: PropTypes.func.isRequired,
    cleanImages: PropTypes.func.isRequired,
    reachBottom: PropTypes.func.isRequired,
    loadRandomImages: PropTypes.func.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { search, loading, bottomReached, reachBottom, cleanImages } = this.props;
    if (prevProps.search !== search) {
      cleanImages();
      if (search) {
        this.loadSearch(search);
      } else {
        this.loadDefault();
      }
    }
    if(prevProps.bottomReached !== bottomReached && bottomReached && !search && !loading) {
      this.loadRandom(30);
    }
  }

  componentDidMount() {
    this.props.cleanImages();
    this.loadDefault();
  }

  loadDefault() {
    this.loadLast(15);
    this.loadRandom(30);
    // this.props.loadRandomImages(30);
  }

  saveImages(newImages) {
    const { addImage } = this.props;
    for (let i = 0; i < newImages.length; i++) {
      setTimeout(() => {
        const { images } = this.props;
        if (!images.find(e => e.id === newImages[i].id)) {
          addImage(newImages[i]);
        }
      }, i * 500);
    }
  }

  request(url) {
    axios(url)
      .then((res) => {
        console.log(res.data);
        if (res.data && res.data.length > 0) {
          this.saveImages(res.data);
        } else {
          updateNotification('Oops no results !');
        }
      })
      .catch((err) => {
        console.log(err);
        updateNotification('Oops an error has occurred !');
      })
      .then(() => {
        this.props.isLoading(false);
      });
  }

  loadSearch(search) {
    this.props.isLoading(true);
    this.request(`/api/images?tags=${search.split(' ').join(',')}`);
  }

  loadLast(limit) {
    this.props.isLoading(true);
    this.request(`/api/images?last=${limit}`);
  }

  loadRandom(limit) {
    this.props.isLoading(true);
    this.request(`/api/images?random=${limit}`);
  }

  render() {
    const { classes, images } = this.props;

    return (
      <div className={classes.gallery}>
        { images.map(image => <Image key={image.id} source={image.url} />) }
      </div>
    );
  }
}

const mapState = state => ({
  search: state.search,
  images: state.images,
  loading: state.loading,
  bottomReached: state.bottomReached,
});

const mapDispatch = dispatch => ({
  isLoading: loading => dispatch(isLoading(loading)),
  updateNotification: notification => dispatch(updateNotification(notification)),
  cleanImages: () => dispatch(cleanImages()),
  addImage: image => dispatch(addImage(image)),
  reachBottom: reached => dispatch(reachBottom(reached)),
  loadRandomImages: limit => dispatch(loadRandomImages(limit)),
});

export default compose(withStyles(styles), connect(mapState, mapDispatch))(Gallery);
