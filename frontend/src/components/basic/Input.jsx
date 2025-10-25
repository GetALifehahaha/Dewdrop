import React from 'react'

const Input = ({placeholder="This is an input", icon: Icon}) => {
    return (
        <div className='flex gap-2 items-center px-6 py-4 rounded-md bg-main w-fit shadow-sm'>
            {Icon && <Icon width={16} className='text-text/50'/>}
            <input type='text' placeholder={placeholder} size={40} className='outline-none focus:outline-none px-2 border-b-2 border-main-gray'/>
        </div>
    ) 
}

export default Input
