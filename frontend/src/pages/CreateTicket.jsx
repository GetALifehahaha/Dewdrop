import React, { useState, useEffect } from 'react';
import { Title, Label, Input, Textarea, Dropdown, Button } from '../components/atoms'
import { Toast } from '../components/molecules'
import useTicket from '../hooks/useTicket';
import { X, Pen, Loader2, Check } from 'lucide-react';
import useTicketType from '../hooks/useTicketType';

const CreateTicket = () => {
    const {postTicket, ticketResponse, ticketError, ticketLoading} = useTicket();
    const {ticketTypeData, ticketTypeLoading, ticketTypeError} = useTicketType();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState();
    const [ticketType, setTicketType] = useState();
    const [errorMessages, setErrorMessages] = useState([]);
    const [toastMessages, setToastMessages] = useState([]);

    useEffect(() => {
        if (ticketResponse) {
            setToastMessages([{
                message: ticketResponse.detail,
                status: ticketResponse.status,
                icon: Check
            }]);
        }

        if (ticketError) {
            setToastMessages([{
                message: ticketError.detail,
                status: ticketError.detail,
                icon: X
            }]);
        }
    }, [ticketResponse, ticketError]);

    useEffect(() => {
        if (toastMessages.length > 0) {
            const timer = setTimeout(() => setToastMessages([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessages]);

    if (ticketTypeLoading) return <h5>Loading ticket types...</h5>
    if (ticketTypeError) return <h5>Error loading types...</h5>

    const handleSetTitle = (value) => setTitle(value);
    const handleSetDescription = (value) => setDescription(value);
    const handleSetSeverity = (value) => setSeverity(value);
    const handleSetTicketType = (value) => setTicketType(value);

    const severitySelections = {
        Low: "low",
        Medium: "medium",
        Urgent: "urgent",
    }

    const listErrorMessages = errorMessages.map((message, index) => <h5 key={index} className='text-sm text-red-400 font-medium flex items-center gap-2'><X size={14} />{message}</h5>)

    const ticketTypeSelections = ticketTypeData.reduce((acc, type) => {
        acc[type.name] = type.id;
        return acc;
    }, {});

    const handleSubmitTicket = async () => {
        setErrorMessages([]);

        if (!title) setErrorMessages(er => [...er, "Please provide a title for your ticket"]);
        if (!description) setErrorMessages(er => [...er, "Please include a description of the issue."])
        if (!severity) setErrorMessages(er => [...er, "Please select a severity level."]);
        if (!ticketType) setErrorMessages(er => [...er, "Please select a ticket type."]);

        if (title && description && severity && ticketType) {
            await postTicket({title: title, description: description, severity: severity, ticket_type: ticketType});
        }
    }

    return (
        <>  
            <Toast toastMessages={toastMessages} />
            <Title text='Submit a Ticket' />
    
            <div className='p-4 bg-main rounded-md shadow-sm'>
                <Title variant='blockTitle' text='Ticket Information' icon={Pen}/>
                <div className='flex flex-col'>
                    <div className="flex gap-2">
                        <div className='p-2 flex flex-col'>
                            <Label text='Title' required={true}/>
                            <Input placeholder='What is this request all about?' onChange={handleSetTitle}/>
                        </div>
                        <div className='p-2'>
                            <Label text='Severity' required={true}/>
                            <Dropdown value={severity} selectName="Severity" selectItems={severitySelections} onSelect={handleSetSeverity}/>
                        </div>
                        <div className='p-2'>
                            <Label text='Type' required={true}/>
                            <Dropdown value={ticketType} selectName="Type" selectItems={ticketTypeSelections} onSelect={handleSetTicketType}/>
                        </div>
                    </div>
                    <div className='p-2 flex flex-col'>
                        <Label text='Description' type='textbox' required={true}/>
                        <Textarea placeholder='What would be the content of this ticket request?' onChange={handleSetDescription}/>
                    </div>
                    <div className='p-2 flex flex-col'>
                        <Label text='Images' />
                    </div>

                    {errorMessages && 
                    <div className='flex flex-col gap-1 p-2'>
                        {listErrorMessages}
                    </div>}

                    <div className='mx-auto mt-18'>
                        {ticketResponse ? 
                        <h5 className='text-accent-deepblue font-semibold'>Ticket Submitted Successfully!</h5> :
                            ticketLoading ? 
                            <h5 className='flex gap-2 items-center'><Loader2 className='text-accent-blue' size={16}/> Submitting your ticket</h5> :
                            <Button text='Submit Your Ticket' onClick={handleSubmitTicket}/>
                            
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateTicket;