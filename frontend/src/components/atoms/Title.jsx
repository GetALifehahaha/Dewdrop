import React from 'react'

const Title = ({variant="pageTitle", text="Text"}) => {

    const titleVariants = {
        pageTitle: "text-lg font-semibold tracking-wide text-text",
        blockTitle: "text-lg font-semibold text-text/75",
    }

    return (
        <h1 className={titleVariants[variant] || titleVariants["pageTitle"]}>
            {text}
        </h1>
    )
}

export default Title
