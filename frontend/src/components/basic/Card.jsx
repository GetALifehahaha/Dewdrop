import React from 'react'
import {DateBlock} from '../'

const Card = ({title="Total", count=0}) => {

    const colorVariants = {
        Total: {
            text: 'text-main-gray',
            color: 'bg-main-dark',
            accent: 'bg-main-gray',
        },
        Urgent: {
            text: 'text-urgent',
            color: 'bg-urgent-light',
            accent: 'bg-urgent',
        },
        Resolved: {
            text: 'text-resolved',
            color: 'bg-resolved-light',
            accent: 'bg-resolved',
        }
    }

    return (
        <div className={`flex flex-col flex-1 font-medium rounded-md shadow-md overflow-hidden bg-main`}>
            <h5 className={`py-2 px-4 font-semibold shadow-sm ${colorVariants[title].text} ${colorVariants[title].color}`}>{title}</h5>
            <div className={`flex flex-col px-4 py-8 ${colorVariants[title].text}`}>
                <h2 className='text-4xl font-bold'>{count}</h2>
                <h5 className='text-text/50 text-sm'>Tickets Sent</h5>
            </div>
        </div>
    )
}

export default Card
