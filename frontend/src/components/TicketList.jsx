import React from 'react';
import { useTicketData } from '../hooks';
import {Ticket, Pagination} from './'

const TicketList = () => {

    const {ticketData, error, loading} = useTicketData();
    
    if (loading) return <p>Loading Tickets...</p>
    if (error) return <p>Error</p>

    const listTickets = ticketData.results.map((ticket, index) => 
        <Ticket key={index} ticket={ticket}/>
    )

    const maxPage = Math.ceil(ticketData.count / 5)


    return (
        <div>
            <div className='flex flex-col gap-4 h-[60vh] overflow-auto'>
                {listTickets}
            </div>

            <Pagination maxPage={maxPage}/>
        </div>
    )
}

export default TicketList;
