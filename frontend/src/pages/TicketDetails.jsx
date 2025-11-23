import React, {useContext, useEffect, useState} from 'react';
import useTicket from '../hooks/useTicket';
import useAgent from '../hooks/useAgent';
import { Title, DateTime, Label, Button } from '../components/atoms';
import { Breadcrumbs, SeverityDisplay, Guard, Toast ,ConfirmationModal } from '../components/molecules';
import { PreviewImage, StatusDisplayBar } from '../components/organisms'
import { Hourglass, UserCircle, Loader2, ScrollText, Calendar, CheckCircleIcon, Trash, Pen, Check, X, Trash2, ALargeSmall, Image, ImageOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import emailjs from '@emailjs/browser';

const TicketDetails = () => {
    const {user} = useContext(AuthContext);
    const {ticketResponse, ticketData, deleteTicket, patchTicket, ticketError, ticketLoading, refresh} = useTicket();
    const {agentData, agentLoading, agentError} = useAgent();
    const [confirmationMessage, setConfirmationMessage] = useState();
    const navigate = useNavigate();
    const [toastMessages, setToastMessages] = useState([]);
    const [showAgents, setShowAgents] = useState(false);
    const [chosenAgentId, setChosenAgentId] = useState(-1);
    const [deleted, setDeleted] = useState(false);
    const [showPreviewImage, setShowPreviewImage] = useState(false);
    const requesterTemplate = import.meta.env.VITE_REQUESTER_TEMPLATE_ID
    const agentTemplate = import.meta.env.VITE_AGENT_TEMPLATE_ID
    const serviceId = import.meta.env.VITE_EMAIL_SERVICE_ID

    const sendEmail = async (templateId, templateParams) => {
        console.log(templateParams)

        try {
            await emailjs.send(
                serviceId,
                templateId,
                templateParams
            );

            console.log("Good!")
        } catch (error) {
            console.log({Bad: error})
            setToastMessages([{
                message: "Failed to send email: ", error,
                status: "error",
                icon: X
            }]);
        }
    };

    
    useEffect(() => {
        if (toastMessages.length > 0) {
            const timer = setTimeout(() => setToastMessages([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessages]);

    const handlePatchTicket = async (method) => {
        if (method == "assessing") {
            try {
                await patchTicket(ticketData.id, {status: "assessing"});

                const payload = {
                    requester_email: ticketData.requester_details.email, 
                    ticket_title: ticketData.title, 
                    status: "Assessing", 
                    requester_name: ticketData.requester_details.first_name, 
                    header_message: `Your ticket: ${ticketData.title} is now under assessment.`,
                    second_message: "Please wait for the Manager to assign an agent."
                }

                await sendEmail(requesterTemplate, payload)
            } catch (err) {
                setToastMessages({
                    message: `Something went wrong: ${err}`,
                    status: "error",
                    icon: X
                })
            }

        }
        refresh();
    }

    useEffect(() => {
        if (!ticketData) return

        if (user.groups == "Managers" && ticketData.status == "pending") {
            handlePatchTicket("assessing");
            refresh();
        }
    }, [ticketData])

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
    
    if (ticketLoading) return <Guard message="Loading ticket details" />
    if (ticketError) return <Guard type='error' message={ticketError} />    
    if (agentLoading) return <Guard message="Loading agent details" />
    if (agentError) return <Guard type='error' message={ticketError} />    

    const breadcrumb = [
        {label: 'Tickets', link: '/tickets'},
        {label: ticketData.id, link: `/tickets/${ticketData.id}`},
    ]

    const sortedAgents = [...agentData].sort((a, b) => {
        const matchA = a.specializations.some(spec => spec.name == ticketData.ticket_type_details.name) ? 0 : 1
        const matchB = b.specializations.some(spec => spec.name == ticketData.ticket_type_details.name) ? 0 : 1

        return matchA - matchB 
    })

    const listAgents = sortedAgents.map((agent, index) => 
        <div key={index} className={`py-2 px-4 rounded-md shadow-sm 'bg-main' hover:bg-main-hover cursor-pointer flex flex-col gap-1 relative`} onClick={() => handleSetChosenAgent(agent.id)}>
            {chosenAgentId == agent.id && 
            <div className='content-[""] absolute -left-2 top-1/2 w-1 h-3/4 bg-accent-blue -translate-y-1/2 rounded-full'>

            </div>
            }
            {agent.specializations.some(spec => spec.name == ticketData.ticket_type_details.name) &&
                <h5 className='absolute px-4 py-1 right-4 top-1/2 bg-green-500 shadow-sm -translate-y-1/2 rounded-full text-sm font-bold text-main animate-pulse'>RECOMMENDED</h5>
            }
            <div className='font-semibold flex text-text gap-1'>
                <h5 className=''>
                    {agent.first_name} 
                </h5>
                <h5>
                    {agent.last_name}
                </h5>
                <h5 className='ml-4 font-semibold text-text/50'>
                    {agent.department_details.name}
                </h5>

            </div>

            <h5 className='font-medium text-text/75'>
                {agent.email} 
            </h5>
            <div className='flex gap-2'>
                {agent.specializations.map((spec) => <h5 className={`${ticketData.ticket_type_details.id === spec.id ? 'text-text font-bold' : 'text-text/50 font-semibold'}  text-sm`}>{spec.name}</h5>)}
            </div>

        </div>)

    const handleRedirectToEdit = () => navigate(`edit`);

    const handleSetDeleteTicket = () => {
        setConfirmationMessage(["Are you sure you want to delete this ticket? This action cannot be undone."])
    }
    
    const handleDeleteTicket = async (response) => {
        if (response) {
            await deleteTicket(ticketData.id)

            setDeleted(true)
        }
        setConfirmationMessage([]);
    }

    const handleSetChosenAgent = (id) => {
        setChosenAgentId(curr => {
            let agentId = curr;

            if (agentId == id) return -1;

            return id
        }) 
    }
    
    const handleAssignAgent = async () => {
        const response = await patchTicket(ticketData.id, {assigned_agent: chosenAgentId, status: "assigned"});

        if (!response || !response.data) {
            console.error("Patch failed, stopping email send.");
            return; 
        }

        const emailContext = response.data.email_context;
        const resolveUrl = emailContext ? emailContext.resolve_url : null;

        // 1. Send Email to Requester
        const requesterPayload = {
            requester_email: ticketData.requester_details.email,
            ticket_title: ticketData.title,
            status: "Assigned",
            requester_name: `${ticketData.requester_details.first_name} ${ticketData.requester_details.last_name}`,
            header_message: `Update here! Your ticket: ${ticketData.title} has been assigned to ${emailContext.agent_name}.`,
            second_message: "Please wait for the agent to finish the task at hand"
        };

        await sendEmail(requesterTemplate, requesterPayload);

        if (resolveUrl) {
            const agentPayload = {
                agent_name: emailContext.agent_name, 
                agent_email: emailContext.agent_email,
                ticket_title: ticketData.title,
                header_message: `Hello there, agent! You have been assigned the ticket: ${ticketData.title}`,
                second_message: 'Click the link below if you have resolved the ticket. Good luck!',
                resolve_link: resolveUrl, 
            };

            await sendEmail(agentTemplate, agentPayload);
        }

        refresh();
        setShowAgents(false);
    }

    const handleResolveTicket = async () => {
        const response = await patchTicket(ticketData.id, {status: "resolved"});

        if (!response) {
            console.error("Failed to resolve ticket in DB. Skipping email.");
            return; 
        }

        const payload = {
            requester_email: ticketData.requester_details.email,
            ticket_title: ticketData.title,
            status: "Resolved",
            requester_name: `${ticketData.requester_details.first_name} ${ticketData.requester_details.last_name}`,
            header_message: `Good news! Your ticket: ${ticketData.title} has been resolved.`,
            second_message: "If you have further issues, please submit a new ticket."
        };

        await sendEmail(requesterTemplate, payload);
        refresh();
    }

    const handleShowPreview = () => {
        setShowPreviewImage(true);
    }
    
    const handleClosePreview = () => {
        setShowPreviewImage(false);
    }

    if (deleted) return <div className='flex justify-center items-center w-full h-full flex-col text-text'><Trash className='text-text/50 animate-bounce' /><h5 className='font-semibold text-40'>Ticket has been deleted!</h5></div>

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
                    <div className='flex flex-row gap-4 items-center'>
                        <h1 className='text-xl text-text font-semibold'>{ticketData.title}</h1>
                        <SeverityDisplay severity={ticketData.severity} severityDisplay={ticketData.severity_display}/>
                        <h5 className='text-base text-text/50 font-bold'>{ticketData.ticket_type_details.name}</h5>
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

                        {/* Requester Information */}
                        {user.groups == "Managers" && ticketData.requester_details && 
                        <div className='flex flex-col gap-2'>
                            <Title variant='blockTitle' text='Requester' icon={CheckCircleIcon}/>
                            <div className='flex flex-col gap-4'>
                                <div>
                                    <Label variant='small' text='Full Name' />

                                    <h5 className='text-text font-medium'>{ticketData.requester_details.first_name} {ticketData.requester_details?.last_name || null}</h5>
                                </div>
                                <div>
                                    <Label variant='small' text='Email' />

                                    <h5 className='text-text font-medium'>{ticketData.requester_details.email}</h5>
                                </div>
                            </div>
                        </div>}

                        {/* Agent Details */}
                        {ticketData.assigned_agent_details && <div className='flex flex-col gap-2'>
                            <Title variant='blockTitle' text='Agent Details' icon={UserCircle}/>
                            <div className='flex flex-col gap-4'>
                                <div className='flex flex-row'>
                                    <div className='flex flex-col flex-1'>
                                        <Label variant='small' text='Agent Name' />
                                        <h5 className='text-text font-medium'>{ticketData.assigned_agent_details.first_name} {ticketData.assigned_agent_details.last_name}</h5>
                                    </div>
                                    <div className='flex flex-col flex-1'>
                                        <Label variant='small' text='Department' />
                                        <h5 className='text-text font-medium'>{ticketData.assigned_agent_details.department_details?.name}</h5>
                                    </div>
                                </div>
                                <div>
                                    <Label variant='small' text='Email' />
                                    <h5 className='text-text font-medium'>{ticketData.assigned_agent_details.email}</h5>
                                </div>
                            </div>
                        </div>}
                    </div>
                </div>
            </div>


            {/* Image Block */}
            <div className='py-6 px-8 bg-main rounded-2xl shadow-sm flex flex-col gap-4 items-center'>
                <span className='mr-auto'>
                    <Title text='Image' variant='blockTitle' icon={Image}/>
                </span>
                {ticketData.image 
                ?   <img src={ticketData.image} className='cursor-pointer p-2 rounded-md border-2 border-gray-200 object-contain' onClick={handleShowPreview}/> 
                :   <div className='flex flex-col gap-8 justify-center items-center'>
                        <ImageOff size={96} className='text-text/25 '/>
                        <h5 className='text-md font-semibold text-text/50'>No Image Sent</h5>
                    </div>
                }
            </div>

            {/* Status Block */}
            <div className='py-6 px-8 bg-main rounded-2xl shadow-sm flex flex-col gap-4'>
                <Title text='Status' variant='blockTitle' icon={Loader2}/>
                <StatusDisplayBar currentStatus={ticketData.status}/>
            </div>
            
            {/* Agent Block */}
            {user.groups == "Managers" ? 
            <div className='py-6 px-8 bg-main rounded-2xl shadow-sm flex flex-col gap-4'>
                <Title text='Manager Actions' variant='blockTitle' icon={UserCircle}/>
                {
                    ticketData.status == "resolved" ?
                    <div className='text-md font-semibold text-accent-deepblue flex flex-col gap-8 justify-center items-center'>
                        <Check size={96} className='text-accent-blue animate-bounce'/>
                        <h5>Ticket has been resolved</h5>
                    </div>
                    :
                    <>
                        <div className='text-md font-semibold text-text/50 flex flex-col gap-8 justify-center items-center'>
                            {
                                ticketData.status == "assigned" ?
                                <>
                                    <Hourglass size={96} className='text-text/25 animate-spin-delay'/>
                                    <h5>An agent is underway. Agent finished?</h5>
                                </> 
                                :
                                <>
                                    <Hourglass size={96} className='text-text/25 animate-spin-delay'/>
                                    <h5>No agent has been assigned yet. Assign an agent to this ticket.</h5>
                                </> 
                            }
                        </div>
                        
                        <span className='mx-auto'>
                            {["pending", "assessing"].includes(ticketData.status) && 
                                <Button text={showAgents ? 'Hide agents' : 'Show agents'} onClick={() => setShowAgents(!showAgents)} />
                            }

                            {ticketData.assigned_agent_details && 
                                <Button text='Resolve Ticket' onClick={handleResolveTicket} />
                            }
                        </span>
                    </>
                }
            </div> 
            : 
            !ticketData.assigned_agent_details &&
                <div className='py-6 px-8 bg-main rounded-2xl shadow-sm flex flex-col gap-4'>
                    <Title text='Assigned Agent' variant='blockTitle' icon={UserCircle}/>

                    <div className='text-md font-semibold text-text/50 flex flex-col gap-8 justify-center items-center'>
                        <Hourglass size={96} className='text-text/25 animate-spin-delay'/>
                        <h5>No agent has been assigned yet. Let's wait for the manager to assign someone.</h5>
                    </div>
                </div>
            }

            {showAgents && 
            <div className='py-6 px-8 bg-main rounded-2xl shadow-sm flex flex-col gap-4'>
                <Title text='Agents' variant='blockTitle'/>

                <div className='flex flex-col gap-4'>
                    {listAgents}
                </div>

                <span className='mx-auto'>
                    <Button text='Assign' icon={Check} onClick={handleAssignAgent} />
                </span>
            </div>}

            <ConfirmationModal messages={confirmationMessage} onSetResponse={handleDeleteTicket}/>

            {showPreviewImage &&
                <PreviewImage src={ticketData.image} onClose={handleClosePreview} />
            }
        </>
    )
}

export default TicketDetails;
