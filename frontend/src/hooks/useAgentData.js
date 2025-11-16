import { useState, useEffect } from 'react'
import { AgentServices } from '../services'
import { useSearchParams, useParams } from 'react-router-dom'

const useAgentData = () => {
    const [agentData, setAgentData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [searchParams] = useSearchParams()
    const { agent_id } = useParams()

    useEffect(() => {
        const fetchAgentData = async () => {
            try {
                const params = Object.fromEntries(searchParams.entries())
                const data = await AgentServices(params, agent_id)

                setAgentData(data)
            } catch (err) {
                setError({ status: err.response?.status })
                setAgentData(null)
            } finally {
                setLoading(false)
            }
        }

        fetchAgentData()
    }, [searchParams, agent_id])

    return { agentData, loading, error }
}

export default useAgentData