import React, { useState } from 'react'
import { AgentServices } from '../services';

const usePatchTicket = () => {

    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const patchAgent = async (id, params) => {
        setLoading(true);

        try {
            const res = AgentServices(params, id, "PATCH");

            console.log(params)
            setResponse(res);
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false);
        }

    }

    return {loading, error, response, patchAgent}
}

export default usePatchAgent
