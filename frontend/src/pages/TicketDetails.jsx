import React, {useContext, useEffect, useState} from 'react';
import { useTicketData, useDeleteTicket, usePatchTicket } from '../hooks';
import { Title, DateTime, Label, Button } from '../components/atoms';
import { Breadcrumbs, SeverityDisplay, Guard, Toast ,ConfirmationModal } from '../components/molecules';
import { StatusDisplayBar } from '../components/organisms'
import { Hourglass, UserCircle, Loader2, ScrollText, Calendar, CheckCircleIcon, Trash, Pen, Check, X, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const TicketDetails = () => {
    const {user} = useContext(AuthContext);
    const {ticketData, error, loading} = useTicketData();
    const {response, error: deleteError, loading: deleteLoading, deleteTicket} = useDeleteTicket();
    const {response: patchResponse, error: patchError, loading: patchLoading, patchTicket} = usePatchTicket();
    const [confirmationMessage, setConfirmationMessage] = useState();
    const navigate = useNavigate();
    const [toastMessages, setToastMessages] = useState([]);
    
    useEffect(() => {
        if (toastMessages.length > 0) {
            const timer = setTimeout(() => setToastMessages([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessages]);

    useEffect(() => {
        if (!ticketData) return
        if (user.groups == "Managers" && ticketData.status == "pending") {
            handlePatchTicket("assessing")
        }
    }, [ticketData])

    useEffect(() => {
        if (response) {
            setToastMessages([{
                status: "success",
                message: "Successfully deleted ticket. Will be redirecting you shortly.",
                icon: Trash2
            }])

            const redirect = setTimeout(() => navigate('/tickets'), 5000);
            return () => clearTimeout(redirect);
        }
        if (deleteError){
            setToastMessages([{
                status: "error",
                message: "Failed to delete message",
                icon: Trash2
            }])
        }
    }, [response, deleteError])
    
    if (loading) return <Guard message="Loading ticket details" />
    if (error) return <Guard type='error' message={{status: error.status, detail: "Ticket doesn't exist"}} />

    const breadcrumb = [
        {label: 'Tickets', link: '/tickets'},
        {label: ticketData.id, link: `/tickets/${ticketData.id}`},
    ]

    const handleRedirectToEdit = () => navigate(`edit`);

    const handleSetDeleteTicket = () => {
        setConfirmationMessage(["Are you sure you want to delete this ticket? This action cannot be undone."])
    }

    const handleDeleteTicket = async (response) => {
        if (response) {
            await deleteTicket(ticketData.id)
        }
        setConfirmationMessage([]);
    }

    const handlePatchTicket = async (method) => {
        if (method == "assessing") {
            try {
                await patchTicket(ticketData.id, {status: "assessing"});
            } catch (err) {
                console.log(err);
            }
        }
    }

    return (
        <>
            {/* Page Header */}
            <Toast toastMessages={toastMessages}/>
            
            <div className='flex justify-between items-start'>
                <div className="flex flex-col">
                    <Title text='Details' />
                    <Breadcrumbs breadcrumb={breadcrumb}/>
                </div>
                {
                    (ticketData.status == "pending") &&

                    <div className='flex gap-2'>
                        <Button text='' icon={Pen} onClick={handleRedirectToEdit}/>
                        <Button text='' icon={Trash} onClick={handleSetDeleteTicket}/>
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
                        {/* Submission Date */}
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

                        {/* Resolved Date */}
                        {ticketData.resolved_at && <div className='flex flex-col gap-2'>
                            <Title variant='blockTitle' text='Resolved At' icon={CheckCircleIcon}/>
                            <div className='flex flex-row gap-8'>
                                <div>
                                    <Label variant='small' text='Date' />
                                    <DateTime dateTime={ticketData.resolved_at} hasDate={true}/>
                                </div>

                                <div>
                                    <Label variant='small' text='Time' />
                                    <DateTime dateTime={ticketData.resolved_at} hasTime={true}/>
                                </div>
                            </div>
                        </div>}

                        {/* Agent Details */}
                        {ticketData.assigned_agent && <div className='flex flex-col gap-2'>
                            <Title variant='blockTitle' text='Agent Details' icon={UserCircle}/>
                            <div className='flex flex-row gap-8'>
                                <div>
                                    <Label variant='small' text='Agent Name' />

                                    <h5 className='text-text font-medium'>{ticketData.assigned_agent.first_name} {ticketData.assigned_agent.last_name}</h5>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>

            </div>

            {/* Status Block */}
            <div className='py-6 px-8 bg-main rounded-2xl shadow-sm flex flex-col gap-4'>
                <Title text='Status' variant='blockTitle' icon={Loader2}/>
                <StatusDisplayBar currentStatus={ticketData.status}/>
            </div>

            {/* Agent Block */}
            {!ticketData.assigned_agent &&
                <div className='py-6 px-8 bg-main rounded-2xl shadow-sm flex flex-col gap-4'>
                    <Title text='Assigned Agent' variant='blockTitle' icon={UserCircle}/>

                    <div className='text-md font-semibold text-text/50 flex flex-col gap-8 justify-center items-center'>
                        <Hourglass size={96} className='text-text/25 animate-spin-delay'/>
                        <h5>No agent has been assigned yet. Let's wait for the manager to assign someone.</h5>
                    </div>
                </div>
            }

            <ConfirmationModal messages={confirmationMessage} onSetResponse={handleDeleteTicket}/>
        </>
    )
}

export default TicketDetails;
