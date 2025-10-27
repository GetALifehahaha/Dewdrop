import React, {useState} from 'react';
import {Selection, Input, Label} from '../'

const TicketFilter = ({onChange={}}) => {

    const [status, setStatus] = useState();
    const [filterShown, setFilterShown] = useState(false);

    const statusSelections = [
        {name: "Pending", value: "pending"},
        {name: "Assessing", value: "assessing"},
        {name: "Assigned", value: "assigned"},
        {name: "Resolved", value: "resolved"},
    ]

    const handleStatusSelectionChange = (value) => {
        console.log(value);
    }

    const handleSetFilterShown = () => {
        setFilterShown(!filterShown);
    }

    return (
        <div className='basis-1/5'>   
            <h5 className='relative bg-main text-text/75 p-2 rounded-md shadow-sm' onClick={handleSetFilterShown}>Filter</h5>

            {filterShown && <div className='absolute transform-x-4'>
                <div className='flex flex-col bg-main gap-2 rounded-sm p-2'>
                    <Label text='Date Created'/>
                    <div className='flex flex-row justify-between gap-2'>
                        <div className='bg-main p-2'>
                            <Label text='Start' variant='small' />
                            <input type='date'/>
                        </div>
                        <div className='bg-main p-2'>
                            <Label text='End' variant='small' />
                            <input type='date'/>
                        </div>
                    </div>
                </div>
                <Selection selectionName='Status' selections={statusSelections} onChange={(value) => {handleStatusSelectionChange(value)}}/>
            </div>}
        </div>
    )
}

export default TicketFilter;