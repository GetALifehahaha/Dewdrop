// input
// urgency type
// common filter (start and end date, status)
// display clearable filter
// clear

import React from 'react'
import {Input, Dropdown} from './'
import { Search } from 'lucide-react'

const Searchbar = () => {

    const handleSeveritySelection = (value) => {
        console.log(value)
    }

    const severitySelections = [
        {name: "Low", value: "lw"},
        {name: "Medium", value: "md"},
        {name: "Urgent", value: "ur"},
    ]

    return (
        <div className='flex gap-4'>
            <Input placeholder="Search tickets by title" icon={Search}/>
            <Dropdown selectionName="Severity" selections={severitySelections} onSelect={(value) => handleSeveritySelection(value)}/>
        </div>
    )
}

export default Searchbar
