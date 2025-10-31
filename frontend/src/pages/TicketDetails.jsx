import React from 'react';
import { useTicketData } from '../hooks';
import { Title, DateTime, Label } from '../components/atoms';
import { Breadcrumbs, SeverityDisplay } from '../components/molecules';
import { StatusDisplayBar } from '../components/organisms'
import { Hourglass } from 'lucide-react';

const TicketDetails = ({ticket}) => {
    const {ticketData, error, loading} = useTicketData();

    if (loading) return <p>Loading Ticket Data...</p>
    if (error) return <p>Error</p>


    const breadcrumb = [
        {label: 'Tickets', link: '/tickets'},
        {label: ticketData.id, link: `/tickets/${ticketData.id}`},
    ]

    return (
        <div className='flex flex-col gap-4'>
            <div className="flex flex-col">
                <Title text='Details' />
                <Breadcrumbs breadcrumb={breadcrumb}/>
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
                        <Title variant='blockTitle' text='Description'/>
                        <h5 className='font-medium'>{ticketData.description}</h5>
                    </div>

                    {/* Details */}
                    <div className="basis-1/4 flex flex-col gap-8 shadow-sm hover:shadow-md ease-in duration-75 p-4 rounded-sm">
                        <div className='flex flex-col gap-2'>
                            <Title variant='blockTitle' text='Submitted At'/>
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
                <Title text='Status' variant='blockTitle' />
                <StatusDisplayBar currentStatus={ticketData.status}/>
            </div>

            {/* Agent Block */}
            <div className='py-6 px-8 bg-main rounded-2xl shadow-sm flex flex-col gap-4'>
                <Title text='Assigned Agent' variant='blockTitle' />

                {ticketData.assigned_agent ? <></> : 
                <div className='text-md font-semibold text-text/50 flex flex-col gap-8 justify-center items-center'>
                    <Hourglass size={96} className='text-text/25 animate-spin-delay'/>
                    <h5>No agent has been assigned yet. Let's wait for the manager to assign someone.</h5>
                </div>}
            </div>
        </div>
    )
}

export default TicketDetails;
