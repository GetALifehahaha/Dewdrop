import React, { useState, useEffect } from 'react';
import { Title, Label, Input, Textarea, Dropdown, Button } from '../components/atoms'
import { Toast } from '../components/molecules'
import useTicket from '../hooks/useTicket';
import { X, Pen, Loader2, Check, Plus, Minus } from 'lucide-react';
import useAgent from '../hooks/useAgent';
import useDepartment from '../hooks/useDepartment';
import useTicketType from '../hooks/useTicketType';

const CreateAgent = () => {
    const { agentLoading, agentResponse, agentError, postAgent } = useAgent();
    const { departmentData, departmentLoading, departmentError } = useDepartment();
    const { ticketTypeData, ticketTypeLoading, ticketTypeError } = useTicketType();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState();
    const [specializations, setSpecializations] = useState([{ ticket_type_id: null }]);

    const [errorMessages, setErrorMessages] = useState([]);
    const [toastMessages, setToastMessages] = useState([]);

    useEffect(() => {
        if (agentResponse) {
            setToastMessages([{
                message: agentResponse.detail,
                status: agentResponse.status,
                icon: Check
            }]);
        }

        if (agentError) {
            setToastMessages([{
                message: agentError.detail,
                status: agentError.detail,
                icon: X
            }]);
        }
    }, [agentResponse, agentError]);

    useEffect(() => {
        if (toastMessages.length > 0) {
            const timer = setTimeout(() => setToastMessages([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessages]);

    if (departmentLoading || ticketTypeLoading) return <div className='absolute top-0 left-0 w-full h-screen z-10 flex justify-center items-center bg-black/5'>
        <Loader2 className='text-main animate-spin' size={60} />
    </div>
    if (departmentError) return <h5>Error loading departments...</h5>
    if (ticketTypeError) return <h5>Error loading ticket types...</h5>

    const handleSetFirstName = (value) => setFirstName(value);
    const handleSetLastName = (value) => setLastName(value);
    const handleSetEmail = (value) => setEmail(value);
    const handleSetDepartment = (value) => setDepartment(value);

    const handleAddSpecialization = () => {
        setSpecializations(prev => [...prev, { ticket_type_id: null }]);
    };

    const handleRemoveSpecialization = index => {
        setSpecializations(prev => prev.filter((_, i) => i !== index));
    };

    const handleSetSpecialization = (index, value) => {
        setSpecializations(prev => prev.map((spec, i) => i === index ? { ticket_type_id: value } : spec));
    };

    const departmentSelections = departmentData.map((type) => { return { name: type.name, value: type.id } })
    const ticketTypeSelections = ticketTypeData.map((type) => { return { name: type.name, value: type.id } })

    const listErrorMessages = errorMessages.map((message, index) => <h5 key={index} className='text-sm text-red-400 font-medium flex items-center gap-2'><X size={14} />{message}</h5>)

    const handleSubmitAgent = async () => {
        setErrorMessages([]);

        if (!firstName) setErrorMessages(er => [...er, "Please provide the first name of the agent"]);
        if (!lastName) setErrorMessages(er => [...er, "Please provide the last name of the agent."])
        if (!department) setErrorMessages(er => [...er, "Please select the department of the agent."]);
        if (!email) setErrorMessages(er => [...er, "Please provide the email of the agent. This email will be used to receive notifications from the system"]);
        if (specializations.some(spec => !spec.ticket_type_id)) setErrorMessages(er => [...er, "All specializations must have a ticket type selected."]);

        if (firstName && lastName && email && department && !specializations.some(spec => !spec.ticket_type_id)) {
            await postAgent({ first_name: firstName, last_name: lastName, email: email, department: department, specializations });
        }
    }

    return (
        <>
            <Toast toastMessages={toastMessages} />
            <Title text='Create a new agent' />

            <div className='p-4 bg-main rounded-md shadow-sm'>
                <Title variant='blockTitle' text='Agent Information' icon={Pen} />
                <div className='flex flex-col'>
                    <div className="flex flex-col gap-2">
                        <div className='p-2 flex gap-4'>
                            <div className='flex flex-col'>
                                <Label text='First name' required={true} />
                                <Input placeholder='First name of the agent' onChange={handleSetFirstName} />
                            </div>
                            <div className='flex flex-col'>
                                <Label text='Department' required={true} />
                                <Dropdown value={department} selectName="Department" selectItems={departmentSelections} onSelect={handleSetDepartment} />
                            </div>
                        </div>
                        <div className='p-2 flex flex-col'>
                            <Label text='Last name' required={true} />
                            <Input placeholder='Last name of the agent' onChange={handleSetLastName} />
                        </div>
                        <div className='p-2 flex flex-col'>
                            <Label text='Email' required={true} />
                            <Input placeholder='This will be used for notification purposes' onChange={handleSetEmail} />
                        </div>
                        <div className='flex flex-col gap-2 p-2'>
                            <Label text='Specializations' required={true} />
                            {specializations.map((spec, index) => (
                                <div key={index} className='flex items-center gap-2'>
                                    <Dropdown
                                        value={spec.ticket_type_id}
                                        selectName={`Ticket Type ${index + 1}`}
                                        selectItems={ticketTypeSelections}
                                        onSelect={value => handleSetSpecialization(index, value)}
                                    />
                                    {specializations.length != 1 &&
                                        <button type='button' onClick={() => handleRemoveSpecialization(index)}><Minus size={16} /></button>
                                    }
                                    {index === specializations.length - 1 &&
                                        <button type='button' onClick={handleAddSpecialization}><Plus size={16} /></button>
                                    }
                                </div>
                            ))}
                        </div>
                    </div>

                    {errorMessages &&
                        <div className='flex flex-col gap-1 p-2'>
                            {listErrorMessages}
                        </div>}

                    <div className='mx-auto mt-18'>
                        {agentResponse ?
                            <h5 className='text-accent-deepblue font-semibold'>Agent Created Successfully!</h5> :
                            agentLoading ?
                                <h5 className='flex gap-2 items-center'><Loader2 className='text-accent-blue' size={16} /> Creating new agent</h5> :
                                <Button text='Create New Agent' onClick={handleSubmitAgent} />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateAgent;