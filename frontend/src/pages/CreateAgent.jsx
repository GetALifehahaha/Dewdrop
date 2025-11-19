import React, { useState, useEffect } from 'react';
import { Title, Label, Input, Textarea, Dropdown, Button } from '../components/atoms'
import { Toast } from '../components/molecules'
import useTicket from '../hooks/useTicket';
import { X, Pen, Loader2, Check } from 'lucide-react';
import useAgent from '../hooks/useAgent';
import useDepartment from '../hooks/useDepartment';

const CreateAgent = () => {
    const {agentLoading, agentResponse, agentError, postAgent} = useAgent();
    const {departmentData, departmentLoading, departmentError} = useDepartment();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [department, setDepartment] = useState();

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

    if (departmentLoading) return <h5>Loading departments...</h5>
    if (departmentError) return <h5>Error loading departments...</h5>

    const handleSetFirstName = (value) => setFirstName(value); 
    const handleSetLastName = (value) => setLastName(value); 
    const handleSetEmail = (value) => setEmail(value); 
    const handleSetDepartment = (value) => setDepartment(value); 

    const departmentSelections = departmentData.reduce((acc, type) => {
        acc[type.name] = type.id;
        return acc
    }, {})

    const listErrorMessages = errorMessages.map((message, index) => <h5 key={index} className='text-sm text-red-400 font-medium flex items-center gap-2'><X size={14} />{message}</h5>)
    
    const handleSubmitAgent = async () => {
        setErrorMessages([]);

        if (!firstName) setErrorMessages(er => [...er, "Please provide the first name of the agent"]);
        if (!lastName) setErrorMessages(er => [...er, "Please provide the last name of the agent."])
        if (!department) setErrorMessages(er => [...er, "Please select the department of the agent."]);
        if (!email) setErrorMessages(er => [...er, "Please provide the email of the agent. This email will be used to receive notifications from the system"]);

        if (firstName && lastName && email && department) {
            await postAgent({first_name: firstName, last_name: lastName, email: email, department: department});
        }
    }

    return (
        <>
            <Toast toastMessages={toastMessages} />
            <Title text='Submit a Ticket' />
    
            <div className='p-4 bg-main rounded-md shadow-sm'>
                <Title variant='blockTitle' text='Ticket Information' icon={Pen}/>
                <div className='flex flex-col'>
                    <div className="flex flex-col gap-2">
                        <div className='p-2 flex gap-4'>
                            <div className='flex flex-col'>
                                <Label text='First name' required={true}/>
                                <Input placeholder='First name of the agent' onChange={handleSetFirstName}/>
                            </div>
                            <div className='flex flex-col'>
                                <Label text='Department' required={true}/>
                                <Dropdown value={department} selectName="Department" selectItems={departmentSelections} onSelect={handleSetDepartment}/>
                            </div>
                        </div>
                        <div className='p-2 flex flex-col'>
                            <Label text='Last name' required={true}/>
                            <Input placeholder='Last name of the agent' onChange={handleSetLastName}/>
                        </div>
                        <div className='p-2 flex flex-col'>
                            <Label text='Email' required={true}/>
                            <Input placeholder='This will be used for notification purposes' onChange={handleSetEmail}/>
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
                            <h5 className='flex gap-2 items-center'><Loader2 className='text-accent-blue' size={16}/> Creating new agent</h5> :
                            <Button text='Create New Agent' onClick={handleSubmitAgent}/>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateAgent;