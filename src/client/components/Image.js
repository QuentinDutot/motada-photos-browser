import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CircularProgress from '@material-ui/core/CircularProgress';
import CardMedia from '@material-ui/core/CardMedia';
import Download from '@material-ui/icons/OpenWith';
import Zoom from '@material-ui/core/Zoom';
import axios from 'axios';

const styles = {
  card: {
    marginLeft: 4,
    position: 'relative',
    display: 'inline-block',
    overflow: 'hidden',
    textAlign: 'center',
  },
  medium: {
    height: 360,
    width: 360,
  },
  large: {
    height: 480,
    width: 480,
  },
  overlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    opacity: .1,
    backgroundColor: 'grey'
  },
  icon: {
    position: 'absolute',
    width: '26%',
    height: '26%',
    top: '37%',
    left: '37%',
    color: 'white',
  },
};

class Image extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    format: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
    click: PropTypes.number.isRequired,
  };

  state = {
    mouseOver: false,
    clicked: false,
  }

  mouseClick() {
    const { id, source, click } = this.props;
    this.setState({ clicked: true });
    setTimeout(() => {
      axios.patch(`/api/images/${id}`, { click: click+1 }).then(() => {
        const newWnd = window.open(source);
        newWnd.opener = null;
        this.setState({ clicked: false });
      });
    }, 1000);
  }

  render() {
    const { classes, source, format } = this.props;
    const { mouseOver, clicked } = this.state;

    return (
      <Zoom in>
        <Card
          className={classes.card}
          onClick={() => this.mouseClick()}
          onMouseEnter={() => this.setState({ mouseOver: true })}
          onMouseLeave={() => this.setState({ mouseOver: false })} >
          <CardMedia
            className={classes[format]}
            image={`${source}?w=${format === 'large' ? 1100 : 700}`} />
          { mouseOver && <div className={classes.overlay}></div> }
          <Zoom in={mouseOver}><Download className={classes.icon} /></Zoom>
        </Card>
      </Zoom>
    );
  }
}

const mapState = state => ({
  format: state.format,
});

export default compose(withStyles(styles), connect(mapState, null))(Image);
