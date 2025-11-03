import React from 'react';
import { useParams } from 'react-router-dom';
import { useTicketData } from '../hooks';
import { Title } from '../components/atoms';
import { Breadcrumbs } from '../components/molecules';

const EditTicket = ({}) => {
    const {ticket_id} = useParams();
    const {ticketData, error, loading} = useTicketData();

    if (error) return <p>Error</p>
    if (loading) return <p>Loading</p>

    const breadcrumbs = {
        
    }

    return (
        <>
            <div>
                <Title text='Edit Ticket Details' />
                <Breadcrumbs />
            </div>
            <h5 className='text-text font-medium'>{ticketData.title}</h5>
            <h5 className='text-text font-medium'>{ticketData.description}</h5>
            <h5 className='text-text font-medium'>{ticketData.severity_display}</h5>
        </>
    )
}

export default EditTicket