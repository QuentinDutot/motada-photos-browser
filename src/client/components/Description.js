import React, { Component } from 'react';

class Description extends Component {
  state = {
    sources: ['unsplash.com', 'pexels.com', 'negativespace.co', 'kaboompics.com'],
  }

  render() {
    const { sources } = this.state;

    const style = {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      marginTop: '2rem'
    }

    return (
      <div style={style} >
        {
          sources.map(source =>
            <a
              key={source}
              href={`https://${source}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                marginRight: 10,
                fontSize: '0.9rem',
                color: '#333',
              }}>
              {source}
            </a>)
        }
      </div>
    );
  }
}

export default Description;
