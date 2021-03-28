import React, { useState, useEffect } from 'react'
import { I18n } from 'react-i18nify'
import { connect } from 'react-redux'
import { updateNotification, isLoading, cleanImages, addImage } from '../reducer'
import Image from '../components/Image'
import Masonry from 'react-masonry-component'
import axios from 'axios'
import NoData from '../components/NoData'

const Gallery = ({
  search = '',
  bottomReached = false,
  loading = false,
  images = [],
  isLoading = () => {},
  updateNotification = () => {},
  cleanImages = () => {},
  addImage = () => {},
}) => {

  const [limit, setLimit] = useState(10)

  const saveImages = (_search, _images) => {
    for (let i = 0; i < _images.length; i++) {
      setTimeout(() => {
        if (!images.find(image => image._id === _images[i]._id) && _search === search) {
          addImage(_images[i])
        }
      }, i * 500)
    }
  }

  const request = (url, type) => {
    axios(url)
      .then((response) => {
        // console.log(response.data)
        if (response.data[type] && response.data[type].length > 0) {
          saveImages(search, response.data[type])
        } else {
          updateNotification(I18n.t('errors.no_results'))
        }
      })
      .catch((error) => {
        // console.log(error)
        updateNotification(I18n.t('errors.unknow'))
      })
      .then(() => isLoading(false))
  }

  const loadSearch = (_search) => {
    isLoading(true)
    request(`/api/images?search=${_search}`, 'search')
  }

  const loadRandom = (_limit) => {
    isLoading(true)
    request(`/api/images?random=${_limit}`, 'random')
  }

  useEffect(() => {
    cleanImages()
    if (search) loadSearch(search)
    else loadRandom(100)
  }, [search])

  useEffect(() => {
    if (!bottomReached || loading) return
    if (limit < images.length) setLimit(limit + 10)
    else if (!search) loadRandom(50)
  }, [bottomReached, loading])

  return (
    images.length ? (
      <Masonry className="p-0">
        {images.slice(0, limit).map(image => (
          <Image key={image._id} data={image} />
        ))}
      </Masonry>
    ) : (
      <NoData />
    )
  )
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
})

export default connect(mapState, mapDispatch)(Gallery)
