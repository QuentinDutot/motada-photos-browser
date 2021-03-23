import React, { useState } from 'react'
import { connect } from 'react-redux'
import { updateDisplay } from '../reducer'
import Zoom from '@material-ui/core/Zoom'
import axios from 'axios'

const Image = ({ data = {}, updateDisplay = () => {} }) => {

  const [hover, setHover] = useState(false)
  const [loaded, setLoaded] = useState(false)

  const click = () => {
    updateDisplay(data)
    setHover(false)
    axios.patch(`/api/images/${data._id}`, { click: data.click + 1 })
  }

  // generate random views count
  const min = 0
  const max = 10 * (data.click + 1)
  let views = (Math.floor(Math.random() * (max - min + 1)) + min).toString()
  const thousands = views.substring(0, views.length-3)
  const hundreds = views.substring(views.length-3, views.length-2)
  views = views < 1000 ? views : `${thousands}.${hundreds} k`

  return (
    <div
      className="lg:w-1/4 md:w-1/3 sm:w-2/4 w-full rounded cursor-pointer p-1"
      onClick={click}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >

      <img
        onLoad={() => setLoaded(true)}
        className="block w-full rounded shadow"
        src={`${data.url}?w=700`}
        alt={data.title}
      />

      {loaded && (
        hover ? (
          <div className="flex items-center justify-center absolute top-0 left-0 h-full w-full bg-gray-300 bg-opacity-30 rounded">
            <Zoom in={hover}>
              <i className="fa fa-arrows-alt text-white text-6xl" aria-hidden="true" />
            </Zoom>
          </div>
        ) : (
          <div className="flex items-center justify-center bg-gray-800 text-white float-right opacity-90 rounded -mt-20 py-3 px-8">
            <span className="text-xl leading-none">{views}</span>
            <i className="fa fa-eye text-white text-xl ml-4" aria-hidden="true" />
          </div>
        )
      )}

    </div>
  )
}

const mapDispatch = dispatch => ({
  updateDisplay: image => dispatch(updateDisplay(image)),
})

export default connect(() => ({}), mapDispatch)(Image)
