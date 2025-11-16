import React, {useState, useEffect} from 'react'
import {TicketServices} from '../services'
import { useSearchParams, useParams } from 'react-router-dom';

const useTicketData = () => {
    const [ticketData, setTicketData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchParams] = useSearchParams();
    const {ticket_id} = useParams()

    const fetchTicketData = async () => {
        try {
            const params = Object.fromEntries(searchParams.entries());
            const data = await TicketServices(params, ticket_id);

            setTicketData(data);
        } catch (err) {
            setError({status: err.response.status});
            setTicketData(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {

        fetchTicketData();
    }, [searchParams])

    return {ticketData, loading, error, refresh: fetchTicketData}
}

export default useTicketData
