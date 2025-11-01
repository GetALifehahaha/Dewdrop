import React, { useEffect, useState } from 'react';
import { Button, Label } from '../atoms';

const ConfirmationModal = React.memo(({messages=[], onSetResponse}) => {

    const [show, setShow] = useState(false);

    const handleOnConfirm = () => {onSetResponse(true); setShow(false)}
    const handleOnCancel = () => {onSetResponse(false); setShow(false)}
    
    const listDetail = messages.map((message, index) => 
        <h5 className='text-text font-medium text-md' key={index}>{message}</h5>
    )

    useEffect(() => {
        if (messages.length !== 0) setShow(true);
    }, [messages])

    return (
        <div className={`${(show) ? 'flex' : 'hidden'} absolute top-0 left-0 w-screen h-screen backdrop-blur-md justify-center items-center`}>
            <div className='flex flex-col gap-4 p-4 rounded-md shadow-sm bg-main'>
                <div className='p-2 flex flex-col gap-1'>
                    {listDetail}
                </div>

                <div className='flex flex-row gap-2 justify-end'>
                    <Button variant="outline" text='Cancel' onClick={handleOnCancel}/>
                    <Button text='Confirm Delete' onClick={handleOnConfirm}/>
                </div>
            </div>
        </div>
    )
});

export default ConfirmationModal;