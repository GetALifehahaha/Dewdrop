import React, {useState, useEffect} from 'react'
import {TicketServices} from '../services'

const useTicketData = () => {
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const data = await TicketServices();

                setTicketData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchTicketData();
    }, [])

    return {ticketData, loading, error}
}

export default useTicketData
