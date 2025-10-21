import React from 'react'

const Title = ({variant=0, text="Text"}) => {

    return (
        <h1 className={`${variant ? 'text-md font-semibold text-text/75' : 'text-lg font-semibold tracking-wide text-text'}`}>
            {text}
        </h1>
    )
}

export default Title
