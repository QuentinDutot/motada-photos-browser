import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';
import Download from '@material-ui/icons/AssignmentReturned';
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
  download: {
    position: 'absolute',
    width: 80,
    height: 80,
    top: 100, // -> (media.height/2)-(download.height/2)
    left: 100, // -> (media.width/2)-(download.width/2)
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
  }

  mouseClick() {
    /* TODO
    const { source } = this.props;
    axios({ url: source, method: 'GET', responseType: 'blob' })
      .then((response) => {
         const url = window.URL.createObjectURL(new Blob([response.data]));
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', source.split('/').pop());
         document.body.appendChild(link);
         link.click();
      });
    */
  }

  render() {
    const { classes, source } = this.props;
    const { mouseOver } = this.state;

    return (
      <Zoom in>
        <Card
          className={[classes.card, classes.media, mouseOver && classes.large].join(' ')}
          onClick={() => this.mouseClick()}
          onMouseEnter={() => this.setState({ mouseOver: true })}
          onMouseLeave={() => this.setState({ mouseOver: false })} >
          <CardActionArea>
            <CardMedia className={classes.media} image={`${source}?w=700`} />
            <Zoom in={mouseOver}>
              <Download className={classes.download} />
            </Zoom>
          </CardActionArea>
        </Card>
      </Zoom>
    );
  }
}


export default withStyles(styles)(Image);
