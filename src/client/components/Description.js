import React, { Component } from 'react'

class Description extends Component {
  state = {
    sources: ['unsplash.com', 'pexels.com', 'negativespace.co', 'kaboompics.com'],
  }

  render() {
    const { sources } = this.state

    return (
      <div className="flex flex-wrap justify-center mt-8">
        {sources.map(source => (
          <a
            key={source}
            href={`https://${source}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mx-4 text-base text-gray-500 hover:text-gray-900 hover:underline"
          >
            {source}
          </a>  
        ))}
      </div>
    )
  }
}

export default Description
