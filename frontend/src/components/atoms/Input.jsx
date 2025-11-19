import React from 'react'

const Input = ({value=null, placeholder="This is an input", icon: Icon, onChange}) => {

    const setOnChange = (value) => {
        onChange(value);
    } 

    return (
        <div className='flex gap-2 items-center px-6 py-2 rounded-md bg-main w-fit shadow-sm focus:shadow-md border-main-dark border'>
            {Icon && <Icon width={16} className='text-text/50'/>}
            <input value={value} type='text' onChange={(e) => setOnChange(e.target.value)} placeholder={placeholder} size={40} className='outline-none focus:outline-none px-2'/> 
        </div>
    ) 
}

export default Input
