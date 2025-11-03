import React from 'react'

const Label = ({text="Text", variant='medium', required=false}) => {

    const labelVariants = {
        medium: 'text-text/50 font-semibold text-md',
        small: 'text-text/75 font-semibold text-sm',
    }

    return (
        <h5 className={`${labelVariants[variant]} relative w-fit`} >{required && <div className='absolute w-1 h-1 rounded-full bg-red-500 -right-2 top-1'></div>}{text}</h5>
    )
}

export default Label