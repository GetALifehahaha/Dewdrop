import React from 'react';
import { useTicketData } from '../../hooks';
import {Pagination} from '../molecules'
import {Ticket} from '../organisms'
import { PAGINATION } from '../../services/constants';

const TicketList = () => {

    const {ticketData, error, loading} = useTicketData();
    

    console.log(ticketData)

    if (loading) return <p>Loading Tickets...</p>
    if (error) return <div className='w-full h-80 flex flex-col gap-2 justify-center items-center'>
        <h5 className='text-text/50 text-4xl font-bold'>{error.status}</h5> 
        <h5 className='text-text font-medium text-lg'>{error.message}</h5>
    </div>
    if (ticketData == null || ticketData.count == 0) return <div className='w-full h-80 flex flex-col gap-2 justify-center items-center'>
        <h5 className='text-text font-medium text-lg'>No ticket found</h5> 
    </div>

    const listTickets = ticketData.results.map((ticket, index) => 
        <Ticket key={index} ticket={ticket}/>
    )

    const maxPage = Math.ceil(ticketData.count / PAGINATION);

    return (
        <div>
            <div className='flex flex-col gap-4 h-[60vh] overflow-auto snap-y rounded-md'>
                {listTickets}
            </div>

            <Pagination maxPage={maxPage}/>
        </div>
    )
}

export default TicketList;
