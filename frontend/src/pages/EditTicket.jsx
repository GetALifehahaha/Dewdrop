import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
import { useTicketData, usePatchTicket } from '../hooks';
import { Label, Title, Dropdown, Button } from '../components/atoms';
import { Breadcrumbs, Toast } from '../components/molecules';
import { Pen, X, Check } from 'lucide-react';
import { SeveritySelectionConfig } from '../config/SeveritySelectionConfig';

const EditTicket = ({}) => {
    const {ticket_id} = useParams();
    const {ticketData, error, loading} = useTicketData();
    const {loading: editLoading, error: editError, response: editResponse, patchTicket} = usePatchTicket();
    const [oldTitle, setOldTitle] = useState("");
    const [title, setTitle] = useState("");
    const [oldDescription, setOldDescription] = useState("");
    const [description, setDescription] = useState();
    const [oldSeverity, setOldSeverity] = useState("");
    const [severity, setSeverity] = useState();
    const [errorMessages, setErrorMessages] = useState([]);
    const [toastMessages, setToastMessages] = useState([]);
    
    useEffect(() => {
        if (ticketData){
            setTitle(ticketData.title);
            setOldTitle(ticketData.title)
            setDescription(ticketData.description);
            setOldDescription(ticketData.description);
            setSeverity(ticketData.severity)
            setOldSeverity(ticketData.severity)
        }
    }, [ticketData]);

    useEffect(() => {
        if (editResponse) {
            setToastMessages([{
                message: "Ticket has been edited successfully",
                status: "success",
                icon: Check
            }])
        }
        if (editError) {
            setToastMessages([{
                message: "Failed to edit ticket. Something went wrong",
                status: "error",
                icon: X
            }])
        }
    }, [editResponse, editError]);

    useEffect(() => {
        if (toastMessages.length > 0) {
            const timer = setTimeout(() => setToastMessages([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessages])

    if (loading) return <p>Loading</p>
    if (error) return <p>Error</p>  
    
    const handleSetTitle = (value) => setTitle(value);
    const handleSetDescription = (value) => setDescription(value);
    const handleSetSeverity = (value) => setSeverity(value);
    
    const listErrorMessages = errorMessages.map((message, index) => <h5 key={index} className='text-sm text-red-400 font-medium flex items-center gap-2'><X size={14} />{message}</h5>)

    const breadcrumb = [
        {label: "Tickets", link: '/tickets'},
        {label: ticket_id, link: `/tickets/${ticket_id}`},
        {label: "Edit", link: `/tickets/${ticket_id}/edit`}
    ]

    const handleSubmitTicket = async () => {
        setErrorMessages([]);

        if (!title) setErrorMessages(er => [...er, "You cannot remove the title of your ticket"]);
        if (!description) setErrorMessages(er => [...er, "You cannot remove the description of your ticket."])
        if (!severity) setErrorMessages(er => [...er, "You cannot remove the severity of your ticket."]);

        if (title && description && severity) {
            let params = {};

            if (title != oldTitle) params = {title: title};
            if (description != oldDescription) params = {...params, description: description};
            if (severity != oldSeverity) params = {...params, severity: severity};

            if (params) await patchTicket(ticketData.id, params);
        }
    }

    const handleResetDetails = () => {
        setTitle(oldTitle);
        setDescription(oldDescription);
        setSeverity(oldSeverity);
    }

    return (
        <>
            <Toast toastMessages={toastMessages} />
            <div className="flex flex-col">
                <Title text='Details' />
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
                        <div className='p-2 w-40'>
                            <Label text='Severity' required={true}/>
                            <Dropdown value={severity} selectionName='Severity' selections={SeveritySelectionConfig} onSelect={handleSetSeverity}/>
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
                        <Button text='Reset' onClick={handleResetDetails}/>
                        <Button text='Finish Editing' onClick={handleSubmitTicket}/>
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditTicket