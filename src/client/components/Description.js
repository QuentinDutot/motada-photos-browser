import React, { Component } from 'react';

class Description extends Component {
  state = {
    sources: ['unsplash', 'pixabay', 'pexels'],
  }

  render() {
    const { sources } = this.state;

    return (
      <div>
        {
          sources.map(source =>
            <a
              key={source}
              href={`https://${source}.com`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ marginRight: 10, fontSize: '0.9rem', color: '#ffffff' }}>
              {`${source}.com`}
            </a>)
        }
      </div>
    );
  }
}

export default Description;
