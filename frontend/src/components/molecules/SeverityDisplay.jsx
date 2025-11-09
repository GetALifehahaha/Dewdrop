import React from 'react';

const SeverityDisplay = ({severity, severityDisplay}) => {

    const severityVariants = {
        low: 'text-main-gray',
        medium: 'text-orange-400',
        urgent: 'text-red-600',
    }

    return (
        <div className={`font-semibold ${severityVariants[severity]}`}>{severityDisplay}</div>
    )
}

export default SeverityDisplay;