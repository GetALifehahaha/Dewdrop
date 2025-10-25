import React, {useState, useEffect} from 'react'
import {TicketServices} from '../services'
import { useSearchParams } from 'react-router-dom';

const useTicketData = () => {
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const fetchTicketData = async () => {
            try {
                const params = Object.fromEntries(searchParams.entries());
                const data = await TicketServices(params);

                setTicketData(data);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchTicketData();
    }, [searchParams])

    return {ticketData, loading, error}
}

export default useTicketData
