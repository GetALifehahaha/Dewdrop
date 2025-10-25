import React from 'react';
import { LucideDot } from 'lucide-react';

const Ticket = ({ticket}) => {

    const formatDateFromIso = (dateString) => {
		let unformattedDate = new Date(dateString);
		
		const date = unformattedDate.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});

		return date;
	}

	const formatTimeFromIso = (dateString) => {
		let unformattedDate = new Date(dateString);

		const time = unformattedDate.toLocaleTimeString('en-US', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true
		});

		return time;
	}

    const capitalize = (string) => string[0].toUpperCase() + string.slice(1)

    return (
        <div className='flex-1 bg-main rounded-lg p-8 flex flex-col justify-between shadow-md'>
            <div className='flex items-center gap-2'>
                <h5 className='text-text font-semibold text-xl'>{ticket.title}</h5>
                <h5 className='text-text/50 font-medium'>{ticket.severity}</h5>
            </div>

            <div className='flex items-center gap-2'>
                <h5 className='text-text/50 text-sm'>Status</h5>
                <h3 className='text-text font-semibold'>{capitalize(ticket.status)}</h3>
            </div>

            <div className='flex text-text/50 font-semibold text-sm items-center'>
                <h5>{formatDateFromIso(ticket.created_at)}</h5>
                <LucideDot />
                <h5>{formatTimeFromIso(ticket.created_at)}</h5>
            </div>
        </div>
    )
}

export default Ticket;