import React, { useState } from 'react'
import { TicketServices } from '../services';

const usePatchTicket = () => {

    const [loading, setLoading] = useState(null);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);

    const patchTicket = async (id, params) => {
        setLoading(true);

        try {
            const res = TicketServices(params, id, "PATCH");

            console.log(params)
            setResponse(res);
        } catch (err) {
            setError(err)
        } finally {
            setLoading(false);
        }

    }

    return {loading, error, response, patchTicket}
}

export default usePatchTicket
