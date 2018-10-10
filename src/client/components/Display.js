import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { I18n } from 'react-i18nify';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { makeSearch, updateDisplay } from '../reducer';
import ProgressiveImage from 'react-progressive-image-loading';
import FileSaver from 'file-saver';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

const styles = {
  image: {
    maxHeight: window.innerHeight-110,
    objectFit: 'contain',
  },
  toolbar: {
    bottom: 0,
    width: '100%',
    position: 'absolute',
  },
  action: {
    float: 'right',
  },
  button: {
    margin: 10,
  },
  icon: {
    marginRight: 10,
    fontSize: 20,
  },
};

class Display extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    display: PropTypes.object.isRequired,
    makeSearch: PropTypes.func.isRequired,
    updateDisplay: PropTypes.func.isRequired,
  };

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

    return (
      <Dialog maxWidth="lg" open={Object.keys(display).length !== 0} onClose={() => updateDisplay({})}>
        <ProgressiveImage
          preview={`${display.url}?w=700`}
          src={display.url}
          render={(src, style) => <img src={src} className={classes.image} />} />
        <div className={classes.toolbar} >
          <Button
            variant="contained"
            onClick={() => updateDisplay({})}
            className={[classes.button, classes.action].join(' ')}>
            <Close className={[classes.icon].join(' ')} />
            {I18n.t('tooltips.close')}
          </Button>
          <Button
            variant="contained"
            onClick={() => this.saveImage(display.source)}
            className={[classes.button, classes.action].join(' ')}>
            <Save className={[classes.icon].join(' ')} />
            {I18n.t('tooltips.save')}
          </Button>
          {
            /*display.tags.map(tag =>
              <Button
              key={tag}
              variant="contained"
              className={classes.button}
              onClick={() => this.exploreTag(tag)}>
              {tag}
              </Button>)*/
            }
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
