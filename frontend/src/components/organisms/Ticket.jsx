import React from 'react';
import {DateTime} from '../atoms';
import {StatusDisplay, SeverityDisplay} from '../molecules';

const Ticket = ({ticket}) => {

    return (
        <div 
        onClick={() => console.log(ticket.id)}
        className='bg-main rounded-lg p-6 flex flex-col gap-2 shadow-md cursor-pointer hover:bg-main-hover duration-75 ease-out mr-2 snap-start'>
            <div className='flex items-center justify-between'>
                <div className="flex items-end gap-4">
                    <h5 className='text-text font-semibold text-lg'>{ticket.title}</h5>
                    <SeverityDisplay severity={ticket.severity} severityDisplay={ticket.severity_display} />
                </div>

                <div>
                    <DateTime dateTime={ticket.created_at}/>
                </div>
            </div>

            <div className='flex items-center gap-4'>
                <StatusDisplay status={ticket.status} status_display={ticket.status_display}/>
                <div className='flex gap-2 font-medium text-text/75'>
                    { (ticket.assigned_agent) ? 
                        <>
                            <h5>Assigned Agent:</h5>
                            <h5>{ticket.assigned_agent.first_name + ' ' + ticket.assigned_agent.last_name}</h5>
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