import React from 'react'

const Button = ({variant="block", text="Button", icon: Icon, onClick}) => {

    const buttonVariants = {
        block: 'bg-accent-blue text-white hover:bg-accent-deepblue',
        outline: 'border-1 border-accent-blue text-accent-deepblue',
        text: 'text-text font-semibold'
    }
    
    return (
        <button 
        onClick={onClick}
        className={`w-fit px-8 py-1 rounded-sm flex gap-4 items-center cursor-pointer ${buttonVariants[variant]}`}>
            {Icon && <Icon width={18}/>}
            {text}
        </button>
    )
}

export default Button
