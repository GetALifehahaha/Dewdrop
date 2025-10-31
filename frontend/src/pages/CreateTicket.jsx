import React, { useState } from 'react';
import {Title, Label, Input, Textarea, Dropdown, Button} from '../components/atoms'
import {SeveritySelectionConfig} from '../config/SeveritySelectionConfig';
import { X, Pen, Loader2 } from 'lucide-react';
import { usePostTicket } from '../hooks';

const CreateTicket = () => {
    const [title, setTitle] = useState();
    const [description, setDescription] = useState();
    const [severity, setSeverity] = useState();
    const [errorMessages, setErrorMessages] = useState([]);
    const { loading, error, responseData, postTicket } = usePostTicket();

    const handleSetTitle = (value) => setTitle(value);
    const handleSetDescription = (value) => setDescription(value);
    const handleSetSeverity = (value) => setSeverity(value);

    const listErrorMessages = errorMessages.map((message, index) => <h5 key={index} className='text-sm text-red-400 font-medium flex items-center gap-2'><X size={14} />{message}</h5>)

    const handleSubmitTicket = async () => {
        setErrorMessages([]);

        if (!title) setErrorMessages(er => [...er, "Please provide a title for your ticket"]);
        if (!description) setErrorMessages(er => [...er, "Please include a description of the issue."])
        if (!severity) setErrorMessages(er => [...er, "Please select a severity level."]);

        await postTicket({title: title, description: description, severity: severity});
    }

    return (
        <>
            {responseData && alert(responseData)}
            <Title text='Submit a Ticket' />

            <div className='p-4 bg-main rounded-md shadow-sm'>
                <Title variant='blockTitle' text='Ticket Information' icon={Pen}/>
                <div className='flex flex-col'>
                    <div className="flex gap-2">
                        <div className='p-2 flex flex-col'>
                            <Label text='Title'/>
                            <Input placeholder='What is this request all about?' onChange={handleSetTitle}/>
                        </div>
                        <div className='p-2 w-40'>
                            <Label text='Severity'/>
                            <Dropdown selectionName='Severity' selections={SeveritySelectionConfig} onSelect={handleSetSeverity}/>
                        </div>
                    </div>
                    <div className='p-2 flex flex-col'>
                        <Label text='Description' type='textbox'/>
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
                        {loading ? 
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