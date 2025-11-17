import React, {useState} from 'react'
import { AgentServices } from '../services';

const useDeleteAgent = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const deleteAgent = async (id) => {
        setLoading(true);

        try {
            const res = await AgentServices(null, id, "DELETE");
    
            setResponse({status: res, detail: "Agent deleted successfully."});
        } catch (err) {
            setError({status: err.response.status, detail: "Failed to delete Agent."});
            setResponse(null);
        } finally {
            setLoading(false);
        }
    }

    return {loading, response, error, deleteAgent}
}

export default useDeleteAgent
