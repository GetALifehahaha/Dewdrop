import React from 'react';
import { Clock4, BookOpen, UserCheck2, TicketCheckIcon } from 'lucide-react';

const StatusDisplayBar = ({currentStatus="pending"}) => {

    const progress = {
        pending: "w-4",
        assessing: "w-1/2",
        assigned: "w-3/4",
        resolved: "w-full"
    }

    const progressIcons = {
        pending: <Clock4 size={18}/>,
        assessing: <BookOpen size={18}/>,
        assigned: <UserCheck2 size={18}/>,
        resolved: <TicketCheckIcon size={18}/>,
    }

    const capitalize = (string) => string[0].toUpperCase() + string.slice(1);

    const getStatusColor = (status, array) => {

        if (currentStatus == "resolved") return 'bg-accent-blue'

        const currentIndex = array.indexOf(capitalize(currentStatus));
        const statusIndex = array.indexOf(status);

        return statusIndex < currentIndex ? 'bg-accent-blue' :
                statusIndex === currentIndex ? 'bg-accent-deepblue' : 'bg-main-gray';
    }

    const getStatusTextColor = (status, array) => {

        if (currentStatus == "resolved") return 'text-accent-blue'

        const currentIndex = array.indexOf(capitalize(currentStatus));
        const statusIndex = array.indexOf(status);

        return statusIndex < currentIndex ? 'text-accent-blue' :
                statusIndex === currentIndex ? 'text-accent-deepblue' : 'text-main-gray';
    }

    const listStatus = ["Pending", "Assessing", "Assigned", "Resolved"].map((status, index, array) =>
        <div key={index} className='flex flex-col gap-4 items-center'>
            <div className={`${getStatusColor(status, array)} w-5 h-5 rounded-full outline-4 outline-main`}>
            </div>

            <div className={`flex items-center gap-2 ${getStatusTextColor(status, array)}`}>
                <h5 className={`font-semibold`}>{status}</h5>
                {progressIcons[status.toLowerCase()]}
            </div>
        </div>
    )
    
    return (
        <div className='h-24'>
            <div className={`bg-main-dark h-3 rounded-xl relative`}>
                <div className={`h-full rounded-xl bg-accent-blue ${progress[currentStatus]}`}>
                </div>
                <div className='flex flex-row justify-between absolute w-full -top-1'>
                    {listStatus}
                </div>
            </div>
        </div>
    )
}

export default StatusDisplayBar;