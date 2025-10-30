import React, {useState, useEffect} from 'react'
import {Input, Dropdown, Button,} from '../atoms'
import {TicketFilter} from './'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'

const Searchbar = () => {

    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("title") || "");
    const [severity, setSeverity] = useState(searchParams.get("severity") || "");

    const handleSeveritySelection = (value) => {
        setSeverity(value);
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
            <Input defaultValue={search} placeholder="Search tickets by title" icon={Search} onChange={(value) => handleSetSearch(value)}/>
            <Dropdown defaultValue={severitySelections.find(item => item.value === severity)?.name} selectionName="Severity" selections={severitySelections} onSelect={(value) => handleSeveritySelection(value)}/>
            <TicketFilter />

            <Button text='Search' onClick={handleSetParameters}/>
        </div>
    )
}

export default Searchbar
