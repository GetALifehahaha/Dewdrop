import React, {useState, useEffect} from 'react'
import {Input, Dropdown, Button,} from '../atoms'
import { Search, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import {SeveritySelectionConfig} from '../../config/SeveritySelectionConfig'

const Searchbar = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [input, setInput] = useState(searchParams.get("title") || "");
    const [search, setSearch] = useState(searchParams.get("title") || "");
    const [severity, setSeverity] = useState(searchParams.get("severity") || null);
    const [filters, setFilters] = useState([]);

    const severitySelections = {
        Low: "low",
        Medium: "medium",
        Urgent: "urgent",
    }

    const handleSetSearch = (value) => {
        setSearch(value);
    }

    const handleSetInput = (value) => {
        setInput(value)
    }

    const handleSetSeverity = (value) => {
        setSeverity(value);
    }

    const handleSetParameters = () => {
        let params = new URLSearchParams();
        let filters = [];
        if (search) {params.set("title", search); filters = [...filters, {Search: search}]}
        if (severity) {params.set("severity", severity); filters = [...filters, {Severity: severity}]}
        setFilters(filters) 
        setSearchParams(params);
    }

    const removeFilter = (type) => {
        if (type == "search") {setSearch(); setInput('')};
        if (type == "severity") setSeverity();
    }

    const clearParameters = () => {
        setInput("")
        setSearch();
        setSeverity();
    }
    
	// const capitalize = (string) => string[0].toUpperCase() + string.slice(1)

    useEffect(() => {
        handleSetParameters()
    }, [severity, search]);

    const listFilters = filters?.map((filter, index) => {
            const [key, value] = Object.entries(filter)[0];
            return <div key={index} className='text-text/50 text-xs flex gap-2 px-2 py-0.5 rounded-full bg-main shadow-sm items-center'><h5>{key}: {value}</h5><X size={12} className='cursor-pointer' onClick={() => removeFilter(key.toLowerCase())}/></div>
        }
    )

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
        <div className='flex flex-col gap-1'>
            <div className='flex gap-2'>
                <Input value={input} placeholder="Search tickets by title" icon={Search} onChange={handleSetInput}/>
                <Button variant='block' text='' icon={Search} onClick={() => setSearch(input)}/>
                <Dropdown value={severity} selectName="Severity" selectItems={severitySelections} onSelect={handleSetSeverity}/>
            </div>
            <div className='flex items-center gap-2 p-1'>
                {listFilters}

                {filters.length > 0 && <div className='text-text/75 text-xs font-medium flex items-center gap-2 cursor-pointer' onClick={clearParameters}><h5>Clear</h5><X size={12} /></div>}
            </div>
        </div>
    )
}

export default Searchbar
