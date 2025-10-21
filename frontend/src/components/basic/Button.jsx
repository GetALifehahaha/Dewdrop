import React from 'react'

const Button = ({variant=0, text="Button", icon=null, onClick}) => {
    return (
        <button 
        onClick={onClick}
        className={`w-fit px-4 py-3 rounded-sm ${variant ? 'bg-red-400 text-white ' : 'border-1 border-red-400 text-red-400'} cursor-pointer`}>
            Halo
        </button>
    )
}

export default Button
