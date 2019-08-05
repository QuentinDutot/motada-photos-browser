import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { I18n } from 'react-i18nify'
import { connect } from 'react-redux'
import { updateNotification, isLoading, cleanImages, addImage, reachBottom } from '../reducer'
import Image from '../components/Image'
import Masonry from 'react-masonry-component'
import axios from 'axios'
import NoData from '../components/NoData'

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
  }

  state = {
    limit: 10,
  }

  componentDidUpdate(prevProps) {
    const { search, images, loading, bottomReached, cleanImages, reachBottom } = this.props
    const { limit } = this.state
    if (prevProps.search !== search) {
      cleanImages()
      if (search) this.loadSearch(search)
      else this.loadRandom(100)
    }
    if(prevProps.bottomReached !== bottomReached && bottomReached && !loading) {
      if (limit < images.length) this.setState({ limit: limit + 10 })
      else if (!search) this.loadRandom(50)
    }
  }

  componentDidMount() {
    const { cleanImages } = this.props
    cleanImages()
    this.loadRandom(100)
  }

  saveImages(currentSearch, newImages) {
    const { addImage } = this.props
    for (let i = 0; i < newImages.length; i++) {
      setTimeout(() => {
        const { search, images } = this.props
        if (!images.find(e => e._id === newImages[i]._id) && currentSearch === search) {
          addImage(newImages[i])
        }
      }, i * 500)
    }
  }

  request(url, type) {
    const { search } = this.props
    axios(url)
      .then((res) => {
        // console.log(res.data)
        if (res.data[type] && res.data[type].length > 0) {
          this.saveImages(search, res.data[type])
        } else {
          updateNotification(I18n.t('no_results'))
        }
      })
      .catch((err) => {
        // console.log(err)
        updateNotification(I18n.t('unknow'))
      })
      .then(() => {
        this.props.isLoading(false)
      })
  }

  loadSearch(search) {
    this.props.isLoading(true)
    this.request(`/api/images?tags=${search.split(' ').join(',')}`, 'tags')
  }

  loadRandom(limit) {
    this.props.isLoading(true)
    this.request(`/api/images?random=${limit}`, 'random')
  }

  render() {
    const { images } = this.props
    const { limit } = this.state

    return images.length
    ? (
      <Masonry style={{ top: 10, padding: 0 }} >
        { images.slice(0, limit).map(image => <Image key={image._id} data={image} />) }
      </Masonry>
    )
    : (
      <NoData />
    )
  }
}

const mapState = state => ({
  search: state.search,
  images: state.images,
  loading: state.loading,
  bottomReached: state.bottomReached,
})

const mapDispatch = dispatch => ({
  isLoading: loading => dispatch(isLoading(loading)),
  updateNotification: notification => dispatch(updateNotification(notification)),
  cleanImages: () => dispatch(cleanImages()),
  addImage: image => dispatch(addImage(image)),
  reachBottom: reached => dispatch(reachBottom(reached)),
})

export default connect(mapState, mapDispatch)(Gallery)
