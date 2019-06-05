import React, { Component } from 'react';
import ParticleAnimation from 'react-particle-animation';

class Background extends Component {
  render() {
    return (
      <ParticleAnimation
        numParticles={45}
        interactive={false}
        color={{ r: 51, g: 51, b: 51, a: 255 }}
        background={{ r: 255, g: 255, b: 255, a: 255 }}
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
