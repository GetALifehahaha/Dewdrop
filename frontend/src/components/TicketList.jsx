import React from 'react';
import { useTicketData } from '../hooks';
import {Ticket} from './'

const TicketList = () => {

    const {ticketData, error, loading} = useTicketData();
    
    if (loading) return <p>Loading Tickets...</p>
    if (error) return <p>Error</p>

    const listTickets = ticketData.map((ticket, index) => 
        <Ticket key={index} ticket={ticket}/>
    )


    return (
        <div className='flex flex-col gap-4 h-[60vh] overflow-auto'>
            {listTickets}
        </div>
    )
}

export default TicketList;
