import React, { Component } from 'react';
import ParticleAnimation from 'react-particle-animation';

class Background extends Component {
  render() {
    return (
      <ParticleAnimation
        numParticles={70}
        interactive={false}
        color={{ r: 130, g: 247, b: 249, a: 255 }}
        background={{ r: 30, g: 46, b: 79, a: 255 }}
        style={{
          top: 0,
          width: '100%',
          height: '100%',
          position: 'absolute',
        }} />
    );
  }
}

export default Background;
