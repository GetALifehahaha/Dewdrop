import React from 'react';
import { LucideDot } from 'lucide-react';

const DateTime = ({variant="base", dateTime, hasDate=false, hasTime=false}) => {

    const dateTimeVariant = {
        base: 'text-text',
        transparent: 'text-text/50',
    }

    const formatDateFromIso = (dateString) => {
        let unformattedDate = new Date(dateString);
        
        const date = unformattedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        return date;
    }

    const formatTimeFromIso = (dateString) => {
        let unformattedDate = new Date(dateString);

        const time = unformattedDate.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });

        return time;
    }

    return (
        <div className={`flex items-center ${dateTimeVariant[variant]} font-medium`}>
            {hasDate && <h5>{formatDateFromIso(dateTime)}</h5>}
            {(hasDate && hasTime) && <LucideDot />}
            {hasTime && <h5>{formatTimeFromIso(dateTime)}</h5>}
        </div>
    )
}

export default DateTime;