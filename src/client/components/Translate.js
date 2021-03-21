import React from 'react'
import { I18n } from 'react-i18nify'
import translations from '../../assets/translations/translations'
import FlagIcon from 'react-flag-kit/lib/CDNFlagIcon'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Dialog from '@material-ui/core/Dialog'

const Translate = ({ open = false, close = () => {} }) => {

  const translate = (lang) => {
    close()
    localStorage.setItem('motada_language', lang)
    location.reload()
  }

  const languages = Object.keys(translations).map(key => (
    <ListItem
      button
      key={translations[key].flag}
      onClick={() => translate(translations[key].code)}
    >
      <FlagIcon code={translations[key].flag} size={32} />
      <ListItemText primary={translations[key].language} />
    </ListItem>
  ))

  return (
    <Dialog
      open={open}
      onClose={close}
      maxWidth="xs"
      fullWidth={true}
    >

      <DialogTitle>
        {I18n.t('tooltips.translations')}
      </DialogTitle>

      <List className="flex flex-wrap">
        <div className="flex-1">
          {languages.map((l, i) => i % 2 == 0 ? l : null)}
        </div>
        <div className="flex-1">
          {languages.map((l, i) => i % 2 != 0 ? l : null)}
        </div>
      </List>

    </Dialog>
  )
}

export default Translate
