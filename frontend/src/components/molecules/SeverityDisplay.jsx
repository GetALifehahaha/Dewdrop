import React from 'react';

const SeverityDisplay = ({severity, severityDisplay}) => {

    const severityVariants = {
        lw: 'text-main-gray',
        md: 'text-orange-400',
        ur: 'text-red-600',
    }

    return (
        <div className={`font-semibold ${severityVariants[severity]}`}>{severityDisplay}</div>
    )
}

export default SeverityDisplay;