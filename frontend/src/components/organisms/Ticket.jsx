import React from 'react';
import {DateTime} from '../atoms';
import {StatusDisplay, SeverityDisplay} from '../molecules';
import { useNavigate } from 'react-router-dom';

const Ticket = ({ticket}) => {

    const navigate = useNavigate();

    const handleNavigate = (id) => {
        navigate(`/tickets/${id}`)
    }

    return (
        <div 
        onClick={() => handleNavigate(ticket.id)}
        className='bg-main rounded-lg p-6 flex flex-col gap-2 shadow-md cursor-pointer hover:bg-main-hover duration-75 ease-out mr-2 snap-start'>
            <div className='flex items-center justify-between'>
                <div className="flex items-end gap-4">
                    <h5 className='text-text font-semibold text-lg'>{ticket.title}</h5>
                    <SeverityDisplay severity={ticket.severity} severityDisplay={ticket.severity_display} />
                </div>

                <div>
                    <DateTime variant='transparent' dateTime={ticket.created_at} hasDate={true} hasTime={true}/>
                </div>
            </div>

            <div className='flex items-center gap-4'>
                <StatusDisplay status={ticket.status} status_display={ticket.status_display}/>
                <div className='flex gap-2 font-medium text-text/75'>
                    { (ticket.assigned_agent_details) ? 
                        <>
                            <h5>Assigned Agent:</h5>
                            <h5>{ticket.assigned_agent_details.first_name + ' ' + ticket.assigned_agent_details.last_name}</h5>
                        </>
                        :
                        <h5>
                            No Agent Assigned Yet
                        </h5>
                    }
                </div>
            </div>
        </div>
    )
}

export default Ticket;