import React, {useState, useEffect} from 'react'
import {Input, Dropdown, Button,} from '../atoms'
import {TicketFilter} from './'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import {SeveritySelectionConfig} from '../../config/SeveritySelectionConfig'

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

    return (
        <div className='flex gap-2'>
            <Input value={search} placeholder="Search tickets by title" icon={Search} onChange={(value) => handleSetSearch(value)}/>
            <Dropdown value={SeveritySelectionConfig.find(item => item.value === severity)?.name} selectionName="Severity" selections={SeveritySelectionConfig} onSelect={(value) => handleSeveritySelection(value)}/>
            <TicketFilter />

            <Button text='Search' onClick={handleSetParameters}/>
        </div>
    )
}

export default Searchbar
