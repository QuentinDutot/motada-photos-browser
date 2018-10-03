import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardMedia from '@material-ui/core/CardMedia';
import Download from '@material-ui/icons/OpenWith';
import Zoom from '@material-ui/core/Zoom';

const styles = {
  card: {
    marginLeft: 4,
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden',
    textAlign: 'center',
  },
  media: {
    height: 360,
    width: 360,
  },
  large: {
    transform: 'scale(2)',
  },
  overlay: {
    position: 'absolute',
    width: 80,
    height: 80,
    top: 140, // -> (media.height/2)-(download.height/2)
    left: 140, // -> (media.width/2)-(download.width/2)
    color: 'white',
  },
};

class Image extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    source: PropTypes.string.isRequired,
  };

  state = {
    mouseOver: false,
    clicked: false,
  }

  mouseClick() {
    const { source } = this.props;
    this.setState({ clicked: true });
    setTimeout(() => {
      window.open(source);
      this.setState({ clicked: false });
    }, 1000);
  }

  render() {
    const { classes, source } = this.props;
    const { mouseOver, clicked } = this.state;

    return (
      <Zoom in>
        <Card
          className={[classes.card, classes.media, mouseOver && classes.large].join(' ')}
          onClick={() => this.mouseClick()}
          onMouseEnter={() => this.setState({ mouseOver: true })}
          onMouseLeave={() => this.setState({ mouseOver: false })} >
          <CardActionArea>
            <CardMedia className={classes.media} image="a" />
            {
              // <CardMedia className={classes.media} image={`${source}?w=700`} />

              clicked
              ? <CircularProgress className={classes.overlay} size={60} />
              : <Zoom in={mouseOver}><Download className={classes.overlay}/></Zoom>
            }
          </CardActionArea>
        </Card>
      </Zoom>
    );
  }
}

export default withStyles(styles)(Image);
