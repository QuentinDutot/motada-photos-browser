import React, { Component } from 'react';

class Description extends Component {
  state = {
    sources: ['unsplash.com', 'pexels.com', 'negativespace.co'],
  }

  render() {
    const { sources } = this.state;

    return (
      <div>
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
