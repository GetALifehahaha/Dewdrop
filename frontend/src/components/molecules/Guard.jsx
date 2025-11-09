import React from 'react';
import { Hourglass, X } from 'lucide-react';

const Guard = ({type="loading", message={status: 400, detail: "Error"}||"Message" }) => {
    if (type=="loading") {
        return (    
            <div className='w-full h-80 flex gap-4 flex-col justify-center items-center'>
                <Hourglass className='text-text animate-spin-delay' size={40}/>
                <h5 className='text-text font-semibold text-lg'>{message}</h5>
            </div>
        )
    } else if (type=="error") {
        return (    
            <div className='w-full h-80 flex flex-col justify-center items-center'>
                <h5 className='text-text/50 font-semibold text-2xl'>{message.status}</h5>
                <h5 className='text-text font-semibold text-lg'>{message.detail}</h5>
            </div>
        )
    }
}

export default Guard;