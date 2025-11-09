import React, {useState} from 'react'
import { TicketServices } from '../services';

const useDeleteTicket = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const deleteTicket = async (id) => {
        setLoading(true);

        try {
            const res = await TicketServices(null, id, "DELETE");
    
            setResponse(res);
        } catch (err) {
            setError({status: err.response, detail: "HA?"});
            setResponse(null);
        } finally {
            setLoading(false);
        }
    }

    return {loading, response, error, deleteTicket}
}

export default useDeleteTicket
