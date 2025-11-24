import React, { useState, useEffect } from 'react'
import { Input, Dropdown, Button, } from '../atoms'
import { Search, X } from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import useTicketType from '../../hooks/useTicketType'
import { DatePicker } from '.'

const Searchbar = () => {
    const { ticketTypeData, ticketTypeLoading, ticketTypeError } = useTicketType();
    const [searchParams, setSearchParams] = useSearchParams();
    const [input, setInput] = useState("");
    const [search, setSearch] = useState("");
    const [ticketType, setTicketType] = useState();
    const [severity, setSeverity] = useState();
    const [status, setStatus] = useState();
    const [startDate, setStartDate] = useState()
    const [endDate, setEndDate] = useState()
    const [filters, setFilters] = useState([]);

    const handleSetSearch = (e) => {
        e.preventDefault();
        setSearch(input);
    }

    const handleSetInput = (value) => {
        setInput(value)
    }

    const handleSetSeverity = (value) => {
        setSeverity(value);
    }

    const handleSetStatus = (value) => setStatus(value);

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
            filters.push({ Severity: severitySelections.map((sev) => { if (sev.value == severity) return sev.name }) });
        }

        if (status) {
            params.set("status", status);
            filters.push({ Status: status });
        }

        if (ticketType) {
            params.set("ticket_type", ticketType);
            filters.push({ "Ticket Type": ticketTypeSelections.map((type) => { if (type.value == ticketType) return type.name }) });
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
        if (type == "search") { setSearch(); setInput('') };
        if (type == "severity") setSeverity();
        if (type == "status") setStatus();
        if (type == "ticket type") setTicketType();
        if (type == "start date") setStartDate();
        if (type == "end date") setEndDate();
    }

    const clearParameters = () => {
        setInput("")
        setSearch("");
        setSeverity(null);
        setStatus(null);
        setTicketType(null);
        setStartDate(null);
        setEndDate(null);
    }

    const severitySelections = [
        { name: "Low", value: "low" },
        { name: "Medium", value: "medium" },
        { name: "Urgent", value: "urgent" },
    ]

    const statusSelections = [
        { name: "Pending", value: "pending" },
        { name: "Assessing", value: "assesssing" },
        { name: "Assigned", value: "assigned" },
        { name: "Resolved", value: "resolved" },
    ]

    const ticketTypeSelections = ticketTypeData.map((type) => { return { name: type.name, value: type.id } })

    useEffect(() => {
        handleSetParameters()
    }, [severity, search, ticketType, startDate, endDate, status]);

    const listFilters = filters?.map((filter, index) => {
        const [key, value] = Object.entries(filter)[0];
        return <div key={index} className='text-text/50 text-xs flex gap-2 px-2 py-0.5 rounded-full bg-main shadow-sm items-center'><h5>{key}: {value}</h5><X size={12} className='cursor-pointer' onClick={() => removeFilter(key.toLowerCase())} /></div>
    }
    )

    if (ticketTypeLoading) return <h5>Loading ticket types</h5>
    if (ticketTypeError) return <h5>Error loading ticket types</h5>

    return (
        <div className='flex flex-col gap-1 '>
            <div className='flex gap-2 flex-wrap'>
                <form className='w-120 md:w-80' onSubmit={(e) => handleSetSearch(e)}>
                    <Input variant='full' value={input} placeholder="Search tickets by title" icon={Search} onChange={handleSetInput} />
                </form>
                <Button variant='block' text='' icon={Search} onClick={handleSetSearch} />
                <Dropdown value={severity} selectName="Severity" selectItems={severitySelections} onSelect={handleSetSeverity} />
                <Dropdown value={status} selectName="Status" selectItems={statusSelections} onSelect={handleSetStatus} />
                <Dropdown value={ticketType} selectName="Ticket Type" selectItems={ticketTypeSelections} onSelect={handleSetTicketType} />
                <DatePicker label={'Start Date'} date={startDate} onSetDate={handleSetStartDate} />
                <DatePicker label={'End Date'} date={endDate} onSetDate={handleSetEndDate} />
            </div>
            <div className='flex items-center gap-2 p-1'>
                {listFilters}

                {filters.length > 0 && <div className='text-text/75 text-xs font-medium flex items-center gap-2 cursor-pointer' onClick={clearParameters}><h5>Clear</h5><X size={12} /></div>}
            </div>
        </div>
    )
}

export default Searchbar
