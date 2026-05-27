import React from 'react'

function Logo({width = '100px'}) {
  return (
    <div 
      style={{ width }}
      className='text-2xl font-bold text-gray-800'
    >
      YourBlog
    </div>
  )
}

export default Logo