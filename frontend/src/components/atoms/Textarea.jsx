import React from 'react';

const Textarea = ({value="", placeholder="This is a textbox", onChange}) => {

    const handleOnChange = (value) => {
        onChange(value);
    }

    return (
        <textarea placeholder={placeholder} rows={8} onChange={(e) => handleOnChange(e.target.value)} className='px-8 py-2 focus:outline-none focus:shadow-md bg-main rounded-md shadow-sm'>
        </textarea>
    )
}

export default Textarea;