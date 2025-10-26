// input
// urgency type
// common filter (start and end date, status)
// display clearable filter
// clear

import React, {useState, useEffect} from 'react'
import {Input, Dropdown, Button} from './'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

const Searchbar = () => {

    const [search, setSearch] = useState("");
    const [severity, setSeverity] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const handleSeveritySelection = (value) => {
        setSeverity(value);
        console.log(value)
    }

    const handleSetSearch = (value) => {
        setSearch(value);
    }

    const handleSetParameters = () => {
        setSearchParams((prev) => {
            let params = new URLSearchParams(prev);

            if (searchParams.get("page")) {
                params.set("page", searchParams.get("page"));
            }

            setOrDeleteParam(params, "title", search);
            setOrDeleteParam(params, "severity", severity);

            return params;
        })
    }

    const setOrDeleteParam = (params, key, value) => {
        if (value) params.set(key, value);
        else params.delete(key);
    };

    const severitySelections = [
        {name: "Low", value: "lw"},
        {name: "Medium", value: "md"},
        {name: "Urgent", value: "ur"},
    ]

    return (
        <div className='flex gap-2'>
            <Input placeholder="Search tickets by title" icon={Search} onChange={(value) => handleSetSearch(value)}/>
            <Dropdown selectionName="Severity" selections={severitySelections} onSelect={(value) => handleSeveritySelection(value)}/>

            <Button text='Search' onClick={handleSetParameters}/>
        </div>
    )
}

export default Searchbar
