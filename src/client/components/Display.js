import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { I18n } from 'react-i18nify'
import { connect } from 'react-redux'
import { makeSearch, updateDisplay, updateNotification } from '../reducer'
import FileSaver from 'file-saver'
import axios from 'axios'

class Display extends Component {
  static propTypes = {
    display: PropTypes.object.isRequired,
    makeSearch: PropTypes.func.isRequired,
    updateDisplay: PropTypes.func.isRequired,
    updateNotification: PropTypes.func.isRequired,
  }

  state = {
    loaded: false,
    admin: false,
  }

  static getDerivedStateFromProps(props) {
    document.body.style.overflow = props.display && props.display.url ? 'hidden' : null
    return null
  }

  componentDidMount() {
    window.addEventListener('keydown', this.checkAdmin)
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.checkAdmin)
  }

  async saveImage(url) {
    let filename = url.substring(url.lastIndexOf('/')+1)
    if (filename.indexOf('.jpeg') === -1
     && filename.indexOf('.jpg') === -1
     && filename.indexOf('.png') === -1) {
      filename += '.jpg'
    }
    FileSaver.saveAs(url, filename)
  }

  exploreTag(tag) {
    const { updateDisplay, makeSearch } = this.props
    updateDisplay({})
    makeSearch(tag)
  }

  checkAdmin = ({ keyCode }) => {
    const { admin } = this.state
    if (!admin) {
      this.setState({
        admin: (keyCode == 46)
      })
    }
  }

  render() {
    const { display, updateDisplay, updateNotification } = this.props
    const { loaded, admin } = this.state

    if (!display || !display.url) return null

    return (
      <div className="fixed top-0 h-full w-full bg-gray-300 bg-opacity-80 z-10" onClick={() => updateDisplay({})}>

        <div
          className="absolute top-0 left-0 right-0 w-full h-14 flex items-center justify-between bg-white border p-4"
          onClick={event => event.stopPropagation()}
        >
          <p className="text m-0">{display.title}</p>
          <div className="flex flex-wrap">
            <button
              type="button"
              className="flex-none flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 mr-4 px-2 py-1"
              onClick={() => this.saveImage(display.url)}
            >
              <p className="text-gray-900 mr-3">{I18n.t('tooltips.download')}</p>
              <i className="fa fa-download text-gray-900" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="flex-none flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 px-2 py-1"
              onClick={() => updateDisplay()}
            >
              <p className="text-gray-900 mr-3">{I18n.t('tooltips.close')}</p>
              <i className="fa fa-times text-gray-900" aria-hidden="true" />
            </button>
          </div>
        </div>

        {!loaded && (
          <div className="flex items-center justify-center absolute top-0 right-0 bottom-0 left-0 m-auto">
            <i className="fa fa-circle-o-notch fa-spin text-white text-8xl" style={{ height: 'fit-content' }} aria-hidden="true" />
          </div>
        )}

        <img
          src={display.url}
          alt={display.title}
          style={loaded ? {} : { display: 'none' }}
          className="absolute top-0 right-0 bottom-0 left-0 rounded shadow m-auto"
          style={{ maxHeight: '80%', maxWidth: '80%' }}
          onClick={event => event.stopPropagation()}
          onLoad={() => this.setState({ loaded: true })}
        />

        <div
          className="absolute bottom-0 left-0 right-0 w-full h-14 flex items-center justify-between bg-white border p-4"
          onClick={event => event.stopPropagation()}
        >
          <p className="m-0">
            <span>{`${I18n.t('tooltips.keywords')}: `}</span>
            {Array.from(new Set(display.tags)).map(tag =>
              <button
                key={tag}
                className="h-9 bg-blue-100 hover:bg-blue-300 text-blue-900 hover:text-white rounded ml-4 px-2 py-1"
                onClick={() => this.exploreTag(tag)}
              >
                {tag}
              </button>
            )}
          </p>
          {admin && (
            <input
              type="text"
              className="flex-none flex items-center justify-center rounded border border-gray-900 hover:bg-gray-50 mr-4 px-2 py-1"
              onChange={({ target }) => {
                const { value } = target
                if (value === process.env.ADMIN_KEY) {
                  axios.delete(`/api/images/${display._id}`).then(({ data }) => {
                    if (data) {
                      this.setState({ admin: false })
                      location.reload()
                    }
                  })
                }
              }}
            />
          )}
        </div>

      </div>
    )
  }
}

const mapState = state => ({
  display: state.display,
})

const mapDispatch = dispatch => ({
  makeSearch: search => dispatch(makeSearch(search)),
  updateDisplay: image => dispatch(updateDisplay(image)),
  updateNotification: notification => dispatch(updateNotification(notification)),
})

export default connect(mapState, mapDispatch)(Display)
