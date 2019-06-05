import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { I18n } from 'react-i18nify';
import { connect } from 'react-redux';
import { updateNotification, isLoading, cleanImages, addImage, reachBottom } from '../reducer';
import Image from '../components/Image';
import Masonry from 'react-masonry-component';
import axios from 'axios';

class Gallery extends Component {
  static propTypes = {
    search: PropTypes.string.isRequired,
    bottomReached: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    images: PropTypes.array.isRequired,
    isLoading: PropTypes.func.isRequired,
    updateNotification: PropTypes.func.isRequired,
    cleanImages: PropTypes.func.isRequired,
    reachBottom: PropTypes.func.isRequired,
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
  }

  saveImages(currentSearch, newImages) {
    const { addImage } = this.props;
    for (let i = 0; i < newImages.length; i++) {
      setTimeout(() => {
        const { search, images } = this.props;
        if (!images.find(e => e.id === newImages[i].id) && currentSearch === search) {
          addImage(newImages[i]);
        }
      }, i * 500);
    }
  }

  request(url) {
    const { search } = this.props;
    axios(url)
      .then((res) => {
        console.log(res.data);
        if (res.data && res.data.length > 0) {
          this.saveImages(search, res.data);
        } else {
          updateNotification(I18n.t('no_results'));
        }
      })
      .catch((err) => {
        console.log(err);
        updateNotification(I18n.t('unknow'));
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
    const { images } = this.props;

    return (
      <Masonry style={{ top: 10, padding: 0 }} >
        { images.map(image => <Image key={image.id} data={image} />) }
      </Masonry>
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
});

export default connect(mapState, mapDispatch)(Gallery);
