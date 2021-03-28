import React from 'react'
import ParticleAnimation from 'react-particle-animation'

const Background = () => {

  const isIE = /MSIE|Trident/.test(window.navigator.userAgent)
  
  return isIE ? null : (
    <ParticleAnimation
      numParticles={45}
      interactive={false}
      color={{ r: 51, g: 51, b: 51, a: 255 }}
      background={{ r: 255, g: 255, b: 255, a: 255 }}
      className="absolute top-0 h-full w-full lg:block hidden"
    />
  )
}

export default Background
