import React, {useState, useEffect} from 'react';
import { AgentServices } from '../services';

const usePostAgent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const postAgent = async (agentData) => {
        setLoading(true);

        try {
            const res = await AgentServices(agentData, null,  "POST");

            setResponse(res);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false)
        }
    }

    return {loading, error, response, postAgent}

}

export default usePostAgent;