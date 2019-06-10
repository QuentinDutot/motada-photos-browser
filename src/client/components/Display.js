import React, { Component } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { I18n } from 'react-i18nify';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import { makeSearch, updateDisplay, updateNotification } from '../reducer';
import CircularProgress from '@material-ui/core/CircularProgress';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Close from '@material-ui/icons/Close';
import FileSaver from 'file-saver';

const styles = {
  overlay: {
    position: 'fixed',
    backgroundColor: '#9e9e9ec7',
    height: '100%',
    width: '100%',
    top: 0,
    zIndex: 1,
  },
  image: {
    maxHeight: '80%',
    maxWidth: '80%',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    margin: 'auto',
  },
  toolbar: {
    position: 'absolute',
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'white',
    color: 'rgb(51, 51, 51)',
    textAlign: 'left',
    fontSize: 16,
    padding: 15,
    left: 0,
    right: 0,
  },
  bottomToolbar: {
    bottom: 0,
  },
  button: {
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    height: 'fit-content',
    border: '1px solid rgb(51, 51, 51)',
    padding: '0px 30px',
    borderRadius: 3,
    '&:hover': { backgroundColor: '#b3b3b326' },       
  },
  buttonIcon: {
    fontSize: 20,
  },
  buttonText: {
    margin: '0 10px 0 0',
  },
  title: {
    flexBasis: '100%',
    margin: 0,
  },
  link: {
    cursor: 'pointer',
    textDecoration: 'underline',
  },
};

class Display extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    display: PropTypes.object.isRequired,
    makeSearch: PropTypes.func.isRequired,
    updateDisplay: PropTypes.func.isRequired,
    updateNotification: PropTypes.func.isRequired,
  };

  state = {
    loaded: false,
  }

  static getDerivedStateFromProps(props) {
    document.body.style.overflow = props.display && props.display.url ? 'hidden' : null;
    return null;
  }

  saveImage(url) {
    let filename = url.substring(url.lastIndexOf('/')+1);
    if (filename.indexOf('.jpeg') === -1 && filename.indexOf('.jpg') === -1 && filename.indexOf('.png') === -1) {
      filename += '.jpg';
    }
    FileSaver.saveAs(url, filename);
  }

  exploreTag(tag) {
    const { updateDisplay, makeSearch } = this.props;
    updateDisplay({});
    makeSearch(tag);
  }

  render() {
    const { classes, display, updateDisplay, updateNotification } = this.props;
    const { loaded } = this.state;

    // TODO downloading animation
    // TODO debug download logic
    // TODO dl button 'download' instead of 'save' ??
    // TODO translate 'Related keywords'

    if (!display || !display.url) return null;

    return (
      <div className={classes.overlay} onClick={() => updateDisplay({})} >

        <div className={classes.toolbar} onClick={e => e.stopPropagation()} >
          <p className={classes.title}>{display.title}</p>

          <div className={classes.button} style={{ marginRight: 12 }} onClick={e => e.stopPropagation()} >
            <p className={classes.buttonText} >{I18n.t('tooltips.save')}</p>
            <SaveAlt className={classes.buttonIcon} />
          </div>

          <div className={classes.button} onClick={() => updateDisplay({})} >
            <p className={classes.buttonText} >{I18n.t('tooltips.close')}</p>
            <Close className={classes.buttonIcon} />
          </div>
        </div>

        {!loaded && <CircularProgress className={classes.image} style={{ width: 60, height: 60, color: 'white' }} />}

        <img
          src={display.url}
          alt={display.title}
          style={loaded ? {} : { display: 'none' }}
          className={classes.image}
          onClick={e => e.stopPropagation()}
          onLoad={() => this.setState({ loaded: true })}
        />

        <div className={[classes.toolbar, classes.bottomToolbar].join(' ')} onClick={e => e.stopPropagation()} >
          <p className={classes.title}>
            Related keywords :{` `}
            {display.tags.map((tag, index) =>
              <span key={tag} >
                <span className={classes.link} onClick={() => this.exploreTag(tag)} >{tag}</span>
                { index != display.tags.length-1 && <span>, </span>}
              </span>
            )}
          </p>
        </div>

      </div>
    );
  }
}

const mapState = state => ({
  display: state.display,
});

const mapDispatch = dispatch => ({
  makeSearch: search => dispatch(makeSearch(search)),
  updateDisplay: image => dispatch(updateDisplay(image)),
  updateNotification: notification => dispatch(updateNotification(notification)),
});

export default compose(withStyles(styles), connect(mapState, mapDispatch))(Display);
