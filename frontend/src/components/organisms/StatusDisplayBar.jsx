import React from 'react';

const StatusDisplayBar = ({currentStatus="pending"}) => {

    const progress = {
        pending: "w-4",
        assessing: "w-1/3",
        assigned: "w-2/3",
        resolved: "w-full"
    }

    const capitalize = (string) => string[0].toUpperCase() + string.slice(1);

    const getStatusColor = (status, array) => {
        const currentIndex = array.indexOf(capitalize(currentStatus));
        const statusIndex = array.indexOf(status);

        return statusIndex < currentIndex ? 'bg-accent-deepblue' :
                statusIndex === currentIndex ? 'bg-accent-blue' : 'bg-main-gray';
    }

    const getStatusTextColor = (status, array) => {
        const currentIndex = array.indexOf(capitalize(currentStatus));
        const statusIndex = array.indexOf(status);

        return statusIndex < currentIndex ? 'text-accent-deepblue' :
                statusIndex === currentIndex ? 'text-accent-blue' : 'text-main-gray';
    }

    const listStatus = ["Pending", "Assessing", "Assigned", "Resolved"].map((status, index, array) =>
        <div key={index} className='flex flex-col gap-4 items-center'>
            <div className={`${getStatusColor(status, array)} w-3 h-3 rounded-full`}>
            </div>

            <h5 className={`font-semibold ${getStatusTextColor(status, array)}`}>{status}</h5>
        </div>
    )
    
    return (
        <div className='h-24 flex flex-col gap-4'>
            <div className={`border-2 border-main-dark h-3 rounded-xl`}>
                <div className={`h-full rounded-xl bg-accent-blue ${progress[currentStatus]}`}>
                </div>
            </div>
            <div className='flex flex-row justify-between'>
                {listStatus}
            </div>
        </div>
    )
}

export default StatusDisplayBar;