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
    
            setResponse({status: res, detail: "Ticket deleted successfully."});
        } catch (err) {
            setError({status: err.response.status, detail: "Failed to delete ticket."});
            setResponse(null);
        } finally {
            setLoading(false);
        }
    }

    return {loading, response, error, deleteTicket}
}

export default useDeleteTicket
