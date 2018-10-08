import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { I18n } from 'react-i18nify';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import ProgressiveImage from 'react-progressive-image-loading';
import FileSaver from 'file-saver';
import Save from '@material-ui/icons/Save';
import Close from '@material-ui/icons/Close';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { makeSearch } from '../reducer';

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
    open: PropTypes.bool.isRequired,
    close: PropTypes.func.isRequired,
    source: PropTypes.string.isRequired,
    tags: PropTypes.array.isRequired,
    makeSearch: PropTypes.func.isRequired,
  };

  saveImage(url) {
    const filename = url.substring(url.lastIndexOf('/')+1)+'.jpg';
    FileSaver.saveAs(url, filename);
  }

  exploreTag(tag) {
    const { close, makeSearch } = this.props;
    close();
    makeSearch(tag);
  }

  render() {
    const { classes, open, close, source, tags } = this.props;

    return (
      <Dialog maxWidth="lg" open={open} onClose={() => close()}>
        <ProgressiveImage
          preview={`${source}?w=100`}
          src={source}
          render={(src) => <img src={src} className={classes.image} />} />
        <div className={classes.toolbar} >
          <Button
            variant="contained"
            onClick={() => close()}
            className={[classes.button, classes.action].join(' ')}>
            <Close className={[classes.icon].join(' ')} />
            {I18n.t('tooltips.close')}
          </Button>
          <Button
            variant="contained"
            onClick={() => this.saveImage(source)}
            className={[classes.button, classes.action].join(' ')}>
            <Save className={[classes.icon].join(' ')} />
            {I18n.t('tooltips.save')}
          </Button>
          {
            /*tags.map(tag =>
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

const mapDispatch = dispatch => ({
  makeSearch: search => dispatch(makeSearch(search)),
});

export default compose(withStyles(styles), connect(null, mapDispatch))(Display);
