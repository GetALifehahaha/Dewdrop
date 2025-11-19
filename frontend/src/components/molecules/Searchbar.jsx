import React, {useState, useEffect} from 'react'
import {Input, Dropdown, Button,} from '../atoms'
import { Search, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import useTicketType from '../../hooks/useTicketType'
import { DatePicker } from '.'

const Searchbar = () => {
    const {ticketTypeData, ticketTypeLoading, ticketTypeError} = useTicketType();
    const [searchParams, setSearchParams] = useSearchParams();
    const [input, setInput] = useState(searchParams.get("title") || "");
    const [search, setSearch] = useState(searchParams.get("title") || "");
    const [ticketType, setTicketType] = useState(searchParams.get("ticket_type") || null);
    const [severity, setSeverity] = useState(searchParams.get("severity") || null);
    const [startDate, setStartDate] = useState(searchParams.get("start_date") || null)
    const [endDate, setEndDate] = useState(searchParams.get("end_date") || null)
    const [filters, setFilters] = useState([]);

    const severitySelections = {
        Low: "low",
        Medium: "medium",
        Urgent: "urgent",
    }

    const ticketTypeSelections = ticketTypeData.reduce((acc, type) => {
        acc[type.name] = type.id;
        return acc;
    }, {});

    const handleSetSearch = (value) => {
        setSearch(value);
    }

    const handleSetInput = (value) => {
        setInput(value)
    }

    const handleSetSeverity = (value) => {
        setSeverity(value);
    }

    const formatDate = (date) => {
        const year = date.getFullYear();
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const day = date.getDate().toString().padStart(2, "0");
        return `${year}-${month}-${day}`;
    }

    const handleSetStartDate = (value) => {
        setStartDate(formatDate(value))
    }

    const handleSetEndDate = (value) => {
        setEndDate(formatDate(value))
    }

    const handleSetTicketType = (value) => setTicketType(value);

    const handleSetParameters = () => {
        let params = new URLSearchParams();
        let filters = [];

        if (search) {
            params.set("title", search);
            filters.push({ Search: search });
        }

        if (severity) {
            params.set("severity", severity);
            filters.push({ Severity: severity });
        }

        if (ticketType) {
            params.set("ticket_type", ticketType);
            const ticketName = Object.keys(ticketTypeSelections).find(
                (key) => ticketTypeSelections[key] === ticketType
            );
            filters.push({ "Ticket Type": ticketName });
        }

        if (startDate) {
            params.set("start_date", startDate);
            filters.push({ "Start Date": startDate });
        }

        if (endDate) {
            params.set("end_date", endDate);
            filters.push({ "End Date": endDate });
        }

        setFilters(filters);
        setSearchParams(params);
    }


    const removeFilter = (type) => {
        if (type == "search") {setSearch(); setInput('')};
        if (type == "severity") setSeverity();
        if (type == "ticket type") setTicketType();
        if (type == "start date") setStartDate();
        if (type == "end date") setEndDate();
    }

    const clearParameters = () => {
        setInput("")
        setSearch();
        setSeverity();
        setTicketType();    
        setStartDate();
        setEndDate();
    }
    
    useEffect(() => {
        handleSetParameters()
    }, [severity, search, ticketType, startDate, endDate]);

    const listFilters = filters?.map((filter, index) => {
            const [key, value] = Object.entries(filter)[0];
            return <div key={index} className='text-text/50 text-xs flex gap-2 px-2 py-0.5 rounded-full bg-main shadow-sm items-center'><h5>{key}: {value}</h5><X size={12} className='cursor-pointer' onClick={() => removeFilter(key.toLowerCase())}/></div>
        }
    )

    if (ticketTypeLoading) return <h5>Loading ticket types</h5>
    if (ticketTypeError) return <h5>Error loading ticket types</h5>

    return (
        <div className='flex flex-col gap-1'>
            <div className='flex gap-2'>
                <Input value={input} placeholder="Search tickets by title" icon={Search} onChange={handleSetInput}/>
                <Button variant='block' text='' icon={Search} onClick={() => setSearch(input)}/>
                <Dropdown value={severity} selectName="Severity" selectItems={severitySelections} onSelect={handleSetSeverity}/>
                <Dropdown value={ticketType} selectName="Ticket Type" selectItems={ticketTypeSelections} onSelect={handleSetTicketType}/>
                <DatePicker label={'Start Date'} date={startDate} onSetDate={handleSetStartDate}/>
                <DatePicker label={'End Date'} date={endDate} onSetDate={handleSetEndDate}/>
            </div>
            <div className='flex items-center gap-2 p-1'>
                {listFilters}

                {filters.length > 0 && <div className='text-text/75 text-xs font-medium flex items-center gap-2 cursor-pointer' onClick={clearParameters}><h5>Clear</h5><X size={12} /></div>}
            </div>
        </div>
    )
}

export default Searchbar
