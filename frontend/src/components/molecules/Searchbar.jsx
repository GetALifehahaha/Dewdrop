import React, {useState, useEffect} from 'react'
import {Input, Dropdown, Button,} from '../atoms'
import {Filters, TicketFilter} from './'
import { Search } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import {SeveritySelectionConfig} from '../../config/SeveritySelectionConfig'

const Searchbar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("title") || "");
    const [severity, setSeverity] = useState(searchParams.get("severity") || null);

    const handleSetSearch = (value) => {
        setSearch(value);
    }

    const handleSetSeverity = (value) => {
        setSeverity(value);
    }

    const handleSetParameters = (param) => {
        let params = new URLSearchParams();
        if (search) params.set("title", search)
        if (severity) params.set("severity", severity)
        setSearchParams(params);
    }

    useEffect(() => {
        setSearch((searchParams.get("title") || ""));
        setSeverity((searchParams.get("severity") || null));
    }, [searchParams])

    // const handleSetParameters = () => {
    //     setSearchParams((prev) => {
    //         let params = new URLSearchParams(prev);

    //         if (searchParams.get("page")) {
    //             params.set("page", searchParams.get("page"));
    //         }

    //         setOrDeleteParam(params, "title", search);
    //         setOrDeleteParam(params, "severity", severity);

    //         return params;
    //     })
    // }

    // const setOrDeleteParam = (params, key, value) => {
    //     if (value) params.set(key, value);
    //     else params.delete(key);
    // };

    // useEffect(() => {
    //     setSeverity(searchParams.get("severity") || "");
    //     setSearch(searchParams.get("title") || "");
    // }, [searchParams])

    return (
        <div className='flex gap-2'>
            <Input value={search} placeholder="Search tickets by title" icon={Search} onChange={handleSetSearch}/>
            <Button text='' icon={Search} onClick={handleSetParameters}/>
            <Dropdown value={severity} selectionName="Severity" selections={SeveritySelectionConfig} onSelect={handleSetSeverity}/>
            {/* 
            <div className='w-20'></div>
            <TicketFilter /> */}
        </div>
    )
}

export default Searchbar
