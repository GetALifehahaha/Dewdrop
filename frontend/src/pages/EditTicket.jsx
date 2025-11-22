import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Label, Title, Dropdown, Button } from '../components/atoms';
import { Breadcrumbs, Toast } from '../components/molecules';
import { Pen, X, Check, ArrowLeft, RotateCcw,  } from 'lucide-react';
import useTicket from '../hooks/useTicket';
import useTicketType from '../hooks/useTicketType';

const EditTicket = ({}) => {
    const {ticket_id} = useParams();
    const {ticketData, ticketError, ticketLoading, ticketResponse, patchTicket} = useTicket();
    const {ticketTypeData, ticketTypeError, ticketTypeLoading} = useTicketType(); 
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState(null);
    const [ticketType, setTicketType] = useState(null);
    const [errorMessages, setErrorMessages] = useState([]);
    const [toastMessages, setToastMessages] = useState([]);

    useEffect(() => {
        if (ticketData){
            setTitle(ticketData.title);
            setDescription(ticketData.description);
            setSeverity(ticketData.severity)
            setTicketType(ticketData?.ticket_type_details?.name)
        }
    }, [ticketData]);

    useEffect(() => {
        if (ticketResponse) {
            setToastMessages([{
                message: ticketResponse.detail,
                status: ticketResponse.status,
                icon: Check
            }])
        }
        if (ticketError) {
            setToastMessages([{
                message: ticketError.detail,
                status: ticketError.status,
                icon: X
            }])
        }
    }, [ticketResponse, ticketError]);

    useEffect(() => {
        if (toastMessages.length > 0) {
            const timer = setTimeout(() => setToastMessages([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessages])

    if (ticketLoading) return <p>Loading</p>
    if (ticketError) return <p>Error</p>  
    if (ticketTypeLoading) return <p>Loading</p>
    if (ticketTypeError) return <p>Error</p>  
    
    const handleSetTitle = (value) => setTitle(value);
    const handleSetDescription = (value) => setDescription(value);
    const handleSetSeverity = (value) => setSeverity(value);
    const handleSetTicketType = (value) => setTicketType(value);
    
    const listErrorMessages = errorMessages.map((message, index) => <h5 key={index} className='text-sm text-red-400 font-medium flex items-center gap-2'><X size={14} />{message}</h5>)

    const breadcrumb = [
        {label: "Tickets", link: '/tickets'},
        {label: ticket_id, link: `/tickets/${ticket_id}`},
        {label: "Edit", link: `/tickets/${ticket_id}/edit`}
    ]

    const severitySelections = [
        {name: "Low", value: "low"},
        {name: "Medium", value: "medium"},
        {name: "Urgent", value: "urgent"},
    ]
    
    const ticketTypeSelections = ticketTypeData.map((type) => {return {name: type.name, value: type.id}})

    const handleSubmitTicket = async () => {
        setErrorMessages([]);

        if (!title) setErrorMessages(er => [...er, "You cannot remove the title of your ticket"]);
        if (!description) setErrorMessages(er => [...er, "You cannot remove the description of your ticket."])
        if (!severity) setErrorMessages(er => [...er, "You cannot remove the severity of your ticket."]);

        if (title && description && severity) {
            let params = {};

            if (title != ticketData.title) params = {title: title};
            if (description != ticketData.description) params = {...params, description: description};
            if (severity != ticketData.severity) params = {...params, severity: severity};
            if (ticketType != ticketData.ticket_type) params = {...params, ticket_type: ticketType};

            if (params) await patchTicket(ticketData.id, params);
        }
    }

    const handleResetDetails = () => {
        setTitle(ticketData.title);
        setDescription(ticketData.description);
        setSeverity(ticketData.severity);
        setTicketType(ticketData.ticket_type)
    }

    return (
        <>
            <Toast toastMessages={toastMessages} />
            <div className="flex flex-col gap-1">
                <div className='flex gap-2'>
                    <Button text='' icon={ArrowLeft} variant='icon' onClick={() => navigate(`/tickets/${ticket_id}`)}/>
                    <Title text='Details' />
                </div>
                <Breadcrumbs breadcrumb={breadcrumb}/>
            </div>

            <div className='p-4 bg-main rounded-md shadow-sm'>
                <Title variant='blockTitle' text='Ticket Information' icon={Pen}/>
                <div className='flex flex-col'>
                    <div className="flex gap-2">
                        <div className='p-2 flex flex-col'>
                            <Label text='Title' required={true}/>
                            <input 
                            value={title} 
                            type='text' 
                            onChange={(e) => handleSetTitle(e.target.value)} 
                            size={40} 
                            className='px-6 py-2 rounded-md bg-main w-fit shadow-sm focus:shadow-md outline-none focus:outline-none'/> 
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
                        <textarea 
                            value={description} 
                            onChange={(e) => handleSetDescription(e.target.value)} 
                            rows={8}
                            className='px-6 py-2 rounded-md bg-main w-full shadow-sm focus:shadow-md outline-none focus:outline-none'>
                        </textarea> 
                    </div>
                    <div className='p-2 flex flex-col'>
                        <Label text='Images' />
                    </div>

                    {errorMessages && 
                    <div className='flex flex-col gap-1 p-2'>
                        {listErrorMessages}
                    </div>}
                    
                    <div className='ml-auto flex gap-2'>
                        <Button text='Reset' onClick={handleResetDetails} icon={RotateCcw}/>
                        <Button text='Save' onClick={handleSubmitTicket}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditTicket