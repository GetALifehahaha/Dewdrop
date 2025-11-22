import { useState, useEffect } from "react";
import { TicketStatsServices } from "../services";

export default function useTicketStats() {
    const [ticketStatsData, setTicketStatsData] = useState([]);
    const [ticketStatsLoading, setTicketStatsLoading] = useState(true);
    const [ticketStatsError, setTicketStatsError] = useState(null);

    // GET LIST
    const fetchTickets = async () => {
        setTicketStatsLoading(true);
        try {
            const data = await TicketStatsServices();
            
            setTicketStatsData(data);
        } catch (err) {
            setTicketStatsError({status: "error", detail: "Failed to fetch ticket stats."});
        } finally {
            setTicketStatsLoading(false);
        }
    };

    // Load on first render
    useEffect(() => {
        fetchTickets();
    }, []);

    return {
        ticketStatsData,
        ticketStatsLoading,
        ticketStatsError
    };
}
