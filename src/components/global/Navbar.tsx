import React from 'react'

export function NavBar() {
  return (
    <div className='flex justify-between items-center w-full px-4 py-4 bg-transparent border-b border-gray-800 fixed top-0'>
      <div className='text-white text-md font-bold'>SmartSnip</div>
      <div className='flex space-x-4 text-sm'>
        <a href='#' className='text-gray-400'>Home</a>
        <a href='#' className='text-gray-400'>Features</a>
        <a href='#' className='text-gray-400'>Pricing</a>
        <a href='#' className='text-gray-400'>Contact</a>
      </div>
    </div>
  )
}


