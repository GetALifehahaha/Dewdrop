import React from 'react'

const Button = ({variant=0, text="Button", icon: Icon, onClick}) => {
    
    return (
        <button 
        onClick={onClick}
        className={`w-fit px-8 py-1 rounded-sm flex gap-4 items-center ${variant ? 'border-1 border-accent-blue text-accent-deepblue' : 'bg-accent-blue text-white hover:bg-accent-deepblue' } cursor-pointer`}>
            {Icon && <Icon width={18}/>}
            {text}
        </button>
    )
}

export default Button
