import React, { useState, useEffect } from 'react';
import useAgent from '../hooks/useAgent';
import { Title } from '../components/atoms';

const Agents = () => {

    const {agentData, agentError, agentLoading} = useAgent();

    if (agentLoading) return <h5>Loading agents...</h5>
    if (agentError) return <h5>Failed to load agent</h5>

    const listAgents = agentData.results.map((agent, index) => 
        <div className='flex items-center gap-4 p-6 rounded-md shadow-sm bg-main hover:shadow-lg'>
            <h5 className='w-8 h-fit aspect-square bg-accent-blue flex justify-center items-center font-bold text-xs text-main rounded-full'>{agent.first_name.toUpperCase().slice(0, 1)}{agent.last_name.toUpperCase().slice(0, 1)}</h5>
            <div>
                <h5 className='font-medium text-text'>{agent.first_name} {agent.last_name}</h5>
                <h5 className='font-medium text-text/50 text-sm'>{agent.email}</h5>
            </div>
            <h5 className='text-text font-medium self-start ml-auto'>{agent.department_details.name}</h5>
        </div>
    )

    return (
        <>
            <Title text='Agents'/>

            <div className='p-4 grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
                {listAgents}
            </div>
        </>
    )
}

export default Agents;