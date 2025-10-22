import React from 'react'

const DateBlock = ({variant="blockDate", hasWeekday=false, hasNamedMonth=false}) => {

    const dateBlockVariants = {
        blockDate: "text-sm font-medium flex flex-row gap-2 px-4 py-1 outline-1 outline-text/25 text-text/50 rounded-sm w-fit",
        cardDate: "text-xl font-bold flex flex-col-reverse text-text"
    }

    const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const weekdayNames = [
        "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"
    ];

    const unparsedDate = new Date();
    const currentDate = `${(hasNamedMonth) ? monthNames[unparsedDate.getMonth() + 1] : unparsedDate.getMonth() + 1} / ${unparsedDate.getDate()} / ${unparsedDate.getFullYear()} ${(hasWeekday) ? weekdayNames[unparsedDate.getDay()] : ''}`;

    return (
        <div className={dateBlockVariants[variant]}>
            <h5 className={`${(variant=="cardDate") && 'text-sm text-text/50 font-semibold'}`}>Date: </h5>
            {currentDate}
        </div>
    )
}

export default DateBlock
