import React from 'react';

const StatusDisplay = ({status, status_display}) => {

    const statusVariant = {
        pending: 'text-main-gray',
        assessing: 'text-orange-400',
        assigned: '',
        resolved: 'text-green-400',
    }

    return (
        <div className={`font-medium tracking-wide px-4 rounded-md shadow-md ${statusVariant[status]}`}>{status_display}</div>
    )
}

export default StatusDisplay;