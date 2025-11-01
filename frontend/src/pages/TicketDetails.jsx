import React, {useEffect, useState} from 'react';
import { useTicketData } from '../hooks';
import { Title, DateTime, Label, Button } from '../components/atoms';
import { Breadcrumbs, SeverityDisplay, ConfirmationModal } from '../components/molecules';
import { StatusDisplayBar } from '../components/organisms'
import { Hourglass, UserCircle, Loader2, ScrollText, Calendar, Pen, Trash2 } from 'lucide-react';

const TicketDetails = () => {
    const {ticketData, error, loading} = useTicketData();
    const [confirmationMessage, setConfirmationMessage] = useState();

    if (loading) return <p>Loading Ticket Data...</p>
    if (error) return <p>Error</p>

    const breadcrumb = [
        {label: 'Tickets', link: '/tickets'},
        {label: ticketData.id, link: `/tickets/${ticketData.id}`},
    ]

    const handleSetDeleteTicket = () => {
        setConfirmationMessage(["Are you sure you want to delete this ticket? This action cannot be undone."])
    }

    const handleDeleteTicket = (response) => {
        if (response) {console.log("Deleted")} 
        else {console.log("Not Deleted")}
        
        setConfirmationMessage([]);
    }

    return (
        <>
            {/* Page Header */}
            <div className='flex justify-between items-start'>
                <div className="flex flex-col">
                    <Title text='Details' />
                    <Breadcrumbs breadcrumb={breadcrumb}/>
                </div>
                {
                    (ticketData.status == "pending") &&

                    <div className='flex gap-2'>
                        <Button variant="outline" text='Edit' icon={Pen} onClick={() => console.log("Edit")}/>
                        <Button text='Delete' icon={Trash2} onClick={handleSetDeleteTicket}/>
                    </div>
                }
            </div>
            
            {/* Main Content */}
            <div className="py-6 px-8 bg-main rounded-2xl shadow-sm flex flex-col gap-4">
                {/* Head */}
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-row gap-4 items-end'>
                        <h1 className='text-xl text-text font-semibold'>{ticketData.title}</h1>
                        <SeverityDisplay severity={ticketData.severity} severityDisplay={ticketData.severity_display}/>
                    </div>

                    <h5 className='text-text/50 text-sm font-medium'>ID - {ticketData.id}</h5>
                </div>

                {/* Body */}
                <div className='flex flex-row gap-4'>
                    {/* Description */}
                    <div className='flex-1 flex flex-col gap-2 shadow-sm hover:shadow-md ease-in duration-75 p-4 rounded-sm'>
                        <Title variant='blockTitle' text='Description' icon={ScrollText}/>
                        <h5 className='font-medium'>{ticketData.description}</h5>
                    </div>

                    {/* Details */}
                    <div className="basis-1/4 flex flex-col gap-8 shadow-sm hover:shadow-md ease-in duration-75 p-4 rounded-sm">
                        <div className='flex flex-col gap-2'>
                            <Title variant='blockTitle' text='Submitted At' icon={Calendar}/>
                            <div className='flex flex-row gap-8'>
                                <div>
                                    <Label variant='small' text='Date' />
                                    <DateTime dateTime={ticketData.created_at} hasDate={true}/>
                                </div>

                                <div>
                                    <Label variant='small' text='Time' />
                                    <DateTime dateTime={ticketData.created_at} hasTime={true}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Status Block */}
            <div className='py-6 px-8 bg-main rounded-2xl shadow-sm flex flex-col gap-4'>
                <Title text='Status' variant='blockTitle' icon={Loader2}/>
                <StatusDisplayBar currentStatus={ticketData.status}/>
            </div>

            {/* Agent Block */}
            <div className='py-6 px-8 bg-main rounded-2xl shadow-sm flex flex-col gap-4'>
                <Title text='Assigned Agent' variant='blockTitle' icon={UserCircle}/>

                {ticketData.assigned_agent ? 
                <div>
                    <div>
                        <Label variant='medium' text='Agent Name'/>
                        <h5 className='font-medium'>{ticketData.assigned_agent.first_name + ' ' + ticketData.assigned_agent.last_name}</h5>
                    </div>
                </div> 
                : 
                <div className='text-md font-semibold text-text/50 flex flex-col gap-8 justify-center items-center'>
                    <Hourglass size={96} className='text-text/25 animate-spin-delay'/>
                    <h5>No agent has been assigned yet. Let's wait for the manager to assign someone.</h5>
                </div>}
            </div>

            <ConfirmationModal messages={confirmationMessage} onSetResponse={handleDeleteTicket}/>
        </>
    )
}

export default TicketDetails;
