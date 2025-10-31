import React from 'react';
import { TicketX } from 'lucide-react'

const NotFound = () => {
    return (
        <div className='bg-main-dark w-full h-screen flex flex-col justify-center items-center text-text/75 '>
            <TicketX size={80} className='text-text/50 animate-pulse'/>
            <h5 className='text-4xl font-bold tracking-tight'>404 Not Found</h5>
            <h5 className='text-lg font-semibold'>The developers didn't implemented this yet. Sorry!</h5>
        </div>
    )
}

export default NotFound;