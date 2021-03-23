import React from 'react'

const Description = () => (
  <div className="flex flex-wrap justify-center mt-8">
    {['unsplash.com', 'pexels.com', 'negativespace.co', 'kaboompics.com'].map(source => (
      <a
        key={source}
        href={`https://${source}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mx-4 text-base text-gray-500 hover:text-gray-900 hover:underline text-lg"
      >
        {source}
      </a>  
    ))}
  </div>
)

export default Description
