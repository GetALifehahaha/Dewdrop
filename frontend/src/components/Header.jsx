import React from 'react'

const Header = ({username}) => {

  return (
    <div className='w-full p-8'>
      <h5 className='float-right'> {/* Change to link to account */}
        {username}
      </h5>
    </div>
  )
}

export default Header

