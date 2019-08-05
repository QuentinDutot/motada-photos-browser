import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import ParticleAnimation from 'react-particle-animation'

const styles = {
  background: {
    top: 0,
    width: '100%',
    height: '100%',
    position: 'absolute',
    '@media screen and (max-width: 1250px)': {
      display: 'none',
    },
  },
}

const Background = ({ classes }) => (
  <ParticleAnimation
    numParticles={45}
    interactive={false}
    color={{ r: 51, g: 51, b: 51, a: 255 }}
    background={{ r: 255, g: 255, b: 255, a: 255 }}
    className={classes.background}
  />
)

export default withStyles(styles)(Background)