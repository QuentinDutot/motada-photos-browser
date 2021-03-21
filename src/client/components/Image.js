import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { updateDisplay } from '../reducer'
import Zoom from '@material-ui/core/Zoom'
import axios from 'axios'

class Image extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired,
    updateDisplay: PropTypes.func.isRequired,
  }

  state = {
    mouseOver: false,
    loaded: false,
    favorites: this.getFavorites(),
  }

  mouseClick() {
    const { updateDisplay, data } = this.props
    updateDisplay(data)
    this.setState({ mouseOver: false })
    axios.patch(`/api/images/${data._id}`, { click: data.click + 1 })
  }

  getFavorites() {
    const min = 0
    const max = 10 * (this.props.data.click + 1)

    const favorites = (Math.floor(Math.random() * (max - min + 1)) + min).toString()

    const thousands = favorites.substring(0, favorites.length-3)
    const hundreds = favorites.substring(favorites.length-3, favorites.length-2)

    return favorites < 1000 ? favorites : `${thousands}.${hundreds} k`
  }

  render() {
    const { data } = this.props
    const { mouseOver, loaded, favorites } = this.state

    return (
      <div
        className="lg:w-3/12 md:4/12 sm:w-6/12 w-full rounded cursor-pointer p-1"
        onClick={() => this.mouseClick()}
        onMouseEnter={() => this.setState({ mouseOver: true })}
        onMouseLeave={() => this.setState({ mouseOver: false })}
      >

        <img
          onLoad={() => this.setState({ loaded: true })}
          className="block w-full rounded shadow"
          src={`${data.url}?w=700`}
          alt={data.title}
        />

        {loaded && (
          mouseOver ? (
            <div className="flex items-center justify-center absolute top-0 left-0 h-full w-full bg-gray-300 bg-opacity-30 rounded">
              <Zoom in={mouseOver}>
                <i className="fa fa-arrows-alt text-white text-6xl" aria-hidden="true" />
              </Zoom>
            </div>
          ) : (
            <div className="flex items-center justify-center w-1/3 bg-gray-800 text-white float-right opacity-90 rounded-l -mt-20 p-2">
              <span className="text-2xl leading-none">{favorites}</span>
              <i className="fa fa-heart text-white text-xl ml-4" aria-hidden="true" />
            </div>
          )
        )}

      </div>
    )
  }
}

const mapDispatch = dispatch => ({
  updateDisplay: image => dispatch(updateDisplay(image)),
})

export default connect(() => ({}), mapDispatch)(Image)
