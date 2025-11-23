import React, { useState, useEffect } from 'react';
import useAgent from '../hooks/useAgent';
import { Title } from '../components/atoms';
import { Edit } from 'lucide-react';
import { EditAgent } from '../components/organisms';

const Agents = () => {

    const {agentData, agentError, agentLoading} = useAgent();
    const [editAgent, setEditAgent] = useState(null);

    if (agentLoading) return <h5>Loading agents...</h5>
    if (agentError) return <h5>Failed to load agent</h5>

    const handleSetEditAgent = (agent) => {
        setEditAgent(agent)
    }

    const handleConfirmEditAgent = (value) => {
        
    }

    const handleRemoveEditAgent = () => setEditAgent(null);

    const listAgents = agentData.map((agent, index) => 
        <div className='relative' key={index}>
            <div className='flex flex-col items-center gap-4 p-6 rounded-md shadow-sm bg-main hover:shadow-lg'>
                <div className='flex flex-row w-full justify-between items-center gap-4'>
                    <h5 className='w-8 h-fit aspect-square bg-accent-blue flex justify-center items-center font-bold text-xs text-main rounded-full'>{agent.first_name.toUpperCase().slice(0, 1)}{agent.last_name.toUpperCase().slice(0, 1)}</h5>
                    <div>
                        <h5 className='font-medium text-text'>{agent.first_name} {agent.last_name}</h5>
                        <h5 className='font-medium text-text/50 text-sm'>{agent.email}</h5>
                    </div>
                    <div className='ml-auto flex flex-col justify-between items-start'>
                        <h5 className='text-text font-medium self-start ml-auto'>{agent.department_details.name}</h5>
                    </div>
                </div>
                <div className='flex flex-row items-center w-full gap-4 mr-auto'>
                    {agent.specializations.map((spec, index) => <h5 key={index} className='text-xs text-text/50 font-semibold'>{spec.name}</h5>)}

                    <Edit className='ml-auto text-text/75 cursor-pointer' size={16} onClick={() => handleSetEditAgent(agent)}/>
                </div>
            </div>
        </div>
    )

    return (
        <>
            <Title text='Agents'/>

            <div className='p-4 grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
                {listAgents}
            </div>

            {editAgent &&
            <EditAgent agentDetails={editAgent} editAgent={handleConfirmEditAgent} onClose={handleRemoveEditAgent} />}
        </>
    )
}

export default Agents;