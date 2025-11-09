import React from 'react'
import {SquareArrowOutUpRightIcon} from 'lucide-react'
import {Button} from '../atoms';
import { useNavigate } from 'react-router-dom';

const LatestTicketCard = ({severity_display="Low", title="Title", description="Description", datetime="datetime", agent="Agent Ironman", id=1}) => {

    const navigate = useNavigate();

    const openTicketDetails = () => navigate('/tickets/'+id)

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

    return (
        <div className='bg-main shadow-md rounded-xl font-medium flex-1 flex flex-col relative
                        before:content-[""] before:absolute before:bg-accent-blue before:w-1/3 before:h-2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-full
        '>
            <div className='px-4 py-4 flex justify-between bg-main-dark items-center rounded-t-xl'>
                <h5 className='font-semibold'>Latest Ticket</h5>
                <h5 className='px-4 rounded-sm h-fit text-sm text-text/50 border-1 border-text/50'>{severity_display}</h5>
            </div>

            <div className='flex flex-col justify-evenly px-4 py-4 gap-8'>
                <div className='flex gap-2 items-center'>
                    <h5 className='text-text font-semibold text-md'>{title}</h5>
                    <h5 className='text-text/50 font-base text-sm'>{formatDateFromIso(datetime)}</h5>
                    <h5 className='text-text/50 font-base text-sm'>{formatTimeFromIso(datetime)}</h5>
                </div>

                <div className=''>
                    <h3 className='text-text font-medium text-xl'>{description}</h3>
                </div>

                <div className='mt-10 border-t-1 border-text/25 flex pt-4 items-center justify-end'>
                    <Button text='View Ticket' icon={SquareArrowOutUpRightIcon} onClick={openTicketDetails}/>
                </div>
            </div>
        </div>
    )
}

export default LatestTicketCard
