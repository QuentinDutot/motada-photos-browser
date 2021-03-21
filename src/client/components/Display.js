import React, { useState, useEffect } from 'react'
import { I18n } from 'react-i18nify'
import { connect } from 'react-redux'
import { makeSearch, updateDisplay } from '../reducer'
import FileSaver from 'file-saver'
import axios from 'axios'

const Display = ({
  display = {},
  makeSearch = () => {},
  updateDisplay = () => {},
}) => {

  const [loaded, setLoaded] = useState(false)
  const [admin, setAdmin] = useState(false)

  const saveImage = async (url) => {
    let filename = url.substring(url.lastIndexOf('/')+1)
    if (filename.indexOf('.jpeg') === -1
     && filename.indexOf('.jpg') === -1
     && filename.indexOf('.png') === -1) {
      filename += '.jpg'
    }
    FileSaver.saveAs(url, filename)
  }

  const exploreTag = (tag) => {
    updateDisplay({})
    makeSearch(tag)
  }

  const onKeyDown = (event) => {
    if (!admin) {
      setAdmin(event.keyCode == 46)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [admin])

  useEffect(() => {
    document.body.style.overflow = display && display.url ? 'hidden' : null
  }, [JSON.stringify(display)])

  return display && display.url ? (
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
            onClick={() => saveImage(display.url)}
          >
            <p className="text-gray-900 mr-3">{I18n.t('tooltips.download')}</p>
            <i className="fa fa-download text-gray-900" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="flex-none flex items-center justify-center rounded border border-gray-300 hover:bg-gray-50 px-2 py-1"
            onClick={() => updateDisplay({})}
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
        onLoad={() => setLoaded(true)}
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
              onClick={() => exploreTag(tag)}
            >
              {tag}
            </button>
          )}
        </p>
        {admin && (
          <input
            type="text"
            className="flex-none flex items-center justify-center rounded border border-gray-900 hover:bg-gray-50 mr-4 px-2 py-1"
            onChange={(event) => {
              if (event.target.value === process.env.ADMIN_KEY) {
                axios.delete(`/api/images/${display._id}`).then(({ data }) => {
                  if (data) {
                    setAdmin(false)
                    location.reload()
                  }
                })
              }
            }}
          />
        )}
      </div>

    </div>
  ) : null
}

const mapState = state => ({
  display: state.display,
})

const mapDispatch = dispatch => ({
  makeSearch: search => dispatch(makeSearch(search)),
  updateDisplay: image => dispatch(updateDisplay(image)),
})

export default connect(mapState, mapDispatch)(Display)
