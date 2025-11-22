import React from 'react'

const Button = ({variant="block", text="Button", icon: Icon, onClick}) => {

    const buttonVariants = {
        outline: 'px-8 py-1 border-1 border-accent-blue text-accent-deepblue',
        block: 'px-8 py-1 bg-accent-blue text-white hover:bg-accent-deepblue',
        icon: 'bg-accent-blue border-accent-blue text-white border aspect-square px-1'
    }
    
    return (
        <button 
        onClick={onClick}
        className={`w-fit rounded-sm flex gap-4 items-center ${buttonVariants[variant]} cursor-pointer`}>
            {Icon && <Icon width={18}/>}
            {text && text}
        </button>
    )
}

export default Button
