import React from 'react'

const Title = ({variant="pageTitle", text="Text", icon: Icon}) => {

    const titleVariants = {
        pageTitle: "text-lg font-semibold tracking-wide text-text",
        blockTitle: "text-lg font-semibold text-text/75",
    }

    return (
        <h1 className={`flex gap-2 items-center ${titleVariants[variant]}`}>
            {Icon && <Icon size={18} />}
            {text}
        </h1>
    )
}

export default Title
