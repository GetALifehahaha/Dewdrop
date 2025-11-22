import React from 'react'
import {DateBlock} from '../atoms'

const DashboardCard = ({title="Total", count=0, description=""}) => {

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
        <div className={`flex flex-col font-medium rounded-md shadow-md overflow-hidden bg-main h-fit p-4 flex-1 border border-main-dark`}>
            <h5 className={`pb-2 font-semibold border-b border-b-main-dark ${colorVariants[title].text}`}>{title}</h5>
            <h5 className={`text-4xl font-bold py-4  ${colorVariants[title].text}`}>{count}</h5>
            <h5 className='text-text/50 text-sm'>{description}</h5>
        </div>
    )
}

export default DashboardCard
