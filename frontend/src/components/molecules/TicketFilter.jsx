import React, {useState} from 'react';
import {Selection, Label, Button} from '../atoms'

const TicketFilter = ({onApply}) => {

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

    const handleApplyFilter = () => {
        onApply();
    }

    return (
        <div className='basis-1/5 relative'>   
            <h5 className='bg-main text-text/75 p-2 rounded-md shadow-sm cursor-pointer hover:bg-main-hover' onClick={handleSetFilterShown}>Filter</h5>

            {filterShown && 
            <div className='absolute flex flex-col gap-2 items-center top-full translate-y-2 -translate-x-1/12'>
                <div className='flex flex-col bg-main gap-2 rounded-sm p-2'>
                    <Label text='Date Created'/>
                    <div className='flex flex-row justify-between gap-2'>
                        <div className='bg-main p-2'>
                            <Label text='Start' variant='small' />
                            <input type='date' className='cursor-text border-b-2 border-border'/>
                        </div>
                        <div className='bg-main p-2'>
                            <Label text='End' variant='small' />
                            <input type='date'/>
                        </div>
                    </div>
                </div>
                <Selection selectionName='Status' selections={statusSelections} onChange={(value) => {handleStatusSelectionChange(value)}}/>
                    
                <Button text='Apply Filter' onClick={handleApplyFilter}/>
            </div>
            }
        </div>
    )
}

export default TicketFilter;