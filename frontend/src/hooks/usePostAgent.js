import React, {useState, useEffect} from 'react';
import { TicketServices } from '../services';

const usePostTicket = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const postTicket = async (ticketData) => {
        setLoading(true);

        try {
            const res = await TicketServices(ticketData, null,  "POST");

            setResponse(res);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false)
        }
    }

    return {loading, error, response, postTicket}

}

export default usePostTicket;