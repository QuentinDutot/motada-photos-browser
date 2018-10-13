import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { I18n } from 'react-i18nify';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { makeSearch, updateDisplay } from '../reducer';
import ProgressiveImage from 'react-progressive-image-loading';
import LinearProgress from '@material-ui/core/LinearProgress';
import FileSaver from 'file-saver';
import Save from '@material-ui/icons/SaveAlt';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

const styles = {
  image: {
    maxHeight: window.innerHeight-110,
    objectFit: 'contain',
  },
  loadingbar: {
    top: 0,
    width: '100%',
    position: 'absolute',
  },
  toolbar: {
    bottom: 0,
    width: '100%',
    position: 'absolute',
    textAlign: 'left',
  },
  button: {
    margin: 5,
    height: 40,
  },
};

class Display extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    display: PropTypes.object.isRequired,
    makeSearch: PropTypes.func.isRequired,
    updateDisplay: PropTypes.func.isRequired,
  };

  state = {
    loading: false,
  }

  saveImage(url) {
    const filename = url.substring(url.lastIndexOf('/')+1)+'.jpg';
    FileSaver.saveAs(url, filename);
  }

  exploreTag(tag) {
    const { updateDisplay, makeSearch } = this.props;
    updateDisplay({});
    makeSearch(tag);
  }

  render() {
    const { classes, display, updateDisplay } = this.props;
    const { loading } = this.state;

    return (
      <Dialog
        maxWidth="lg"
        open={Object.keys(display).length !== 0}
        onClose={() => updateDisplay({})}>
        { loading && <LinearProgress className={classes.loadingbar} /> }
        <ProgressiveImage
          preview={`${display.url}?w=700`}
          src={display.url}
          render={(src, style) => {
            const loadingState = style.filter.charAt(5) === '1';
            if(loading !== loadingState) this.setState({ loading: loadingState  });
            return <img src={src} className={classes.image} />;
          }} />
        <div className={classes.toolbar} >
        {
          display.tags && display.tags.map(tag =>
            <Button
              key={tag}
              size="small"
              color="primary"
              variant="contained"
              className={classes.button}
              onClick={() => this.exploreTag(tag)}>
              {tag}
            </Button>)
         }
         <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={() => updateDisplay({})}
            className={classes.button}
            style={{ float: 'right' }}>
            <Close />
          </Button>
          <Button
            size="small"
            color="primary"
            variant="contained"
            onClick={() => this.saveImage(display.url)}
            className={classes.button}
            style={{ float: 'right' }}>
            <Save />
          </Button>
        </div>
      </Dialog>
    );
  }
}

const mapState = state => ({
  display: state.display,
});

const mapDispatch = dispatch => ({
  makeSearch: search => dispatch(makeSearch(search)),
  updateDisplay: image => dispatch(updateDisplay(image)),
});

export default compose(withStyles(styles), connect(mapState, mapDispatch))(Display);
