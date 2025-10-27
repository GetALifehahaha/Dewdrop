import React from 'react'
import {Label} from '../'

const Selection = ({selectionName="Selection", selections=[{name: "Select", value: "Value"}], onChange}) => {

    const handleSelectionChange = (value) => {
        onChange(value);
    }

    const listSelections = selections.map(({name, value}, index) => 
    <label 
    key={index}
    className='flex flex-row gap-2 basis-1/2 cursor-pointer font-medium text-text'
    >
        <input 
        type="radio" 
        name={selectionName} 
        value={value} 
        onClick={() => handleSelectionChange(value)}
        />
        {name}
    </label>)

    return (
        <div className='bg-main p-2 rounded-sm'>
            <Label text={selectionName}/>
            <div className='flex flex-row flex-wrap'>
                {listSelections}
            </div>
        </div>
    )
}

export default Selection