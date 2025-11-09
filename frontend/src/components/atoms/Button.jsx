import React from 'react'

const Button = ({variant="block", text="Button", icon: Icon, onClick}) => {

    const buttonVariants = {
        outline: 'border-1 border-accent-blue text-accent-deepblue',
        block: 'bg-accent-blue text-white hover:bg-accent-deepblue',
    }
    
    return (
        <button 
        onClick={onClick}
        className={`w-fit px-8 py-1 rounded-sm flex gap-4 items-center ${buttonVariants[variant]} cursor-pointer`}>
            {Icon && <Icon width={18}/>}
            {text && text}
        </button>
    )
}

export default Button
