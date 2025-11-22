import React from 'react';

const StatusDisplay = ({status, status_display}) => {

    const statusVariant = {
        pending: 'text-main-gray',
        assessing: 'text-orange-400',
        assigned: 'text-orange-400',
        resolved: 'text-green-500',
    }

    return (
        <div className={`font-medium tracking-wide px-4 w-fit rounded-md shadow-md ${statusVariant[status]}`}>{status_display}</div>
    )
}

export default StatusDisplay;