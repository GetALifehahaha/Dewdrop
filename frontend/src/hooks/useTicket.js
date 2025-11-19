import { useState, useEffect } from "react";
import { TicketServices } from "../services";
import { useParams, useSearchParams } from "react-router-dom";

export default function useTicket() {
	const [ticketResponse, setTicketResponse] = useState();
    const [ticketData, setTicketData] = useState([]);
    const [ticketLoading, setTicketLoading] = useState(true);
    const [ticketError, setTicketError] = useState(null);
	const [searchParams] = useSearchParams();
    const {ticket_id} = useParams()

    // GET LIST
    const fetchTickets = async () => {
        try {
            setTicketLoading(true);
            const params = Object.fromEntries(searchParams.entries());
            const data = await TicketServices(params, ticket_id);

            setTicketData(data);
        } catch (err) {
            setTicketError(err);
        } finally {
            setTicketLoading(false);
        }
    };

	const postTicket = async (ticketData) => {
        setTicketLoading(true);

        try {
            const res = await TicketServices(ticketData, null,  "POST");

            setTicketResponse({status: "success", detail: "Ticket submitted successfully."});
        } catch (err) {
            setTicketError({status: "error", detail: "Failed to submit ticket."});
            setTicketResponse(null);
        } finally {
            setTicketLoading(false)
        }
    }

    const patchTicket = async (id, params) => {
        setTicketLoading(true);

        try {
            const res = TicketServices(params, id, "PATCH");

            setTicketResponse({status: "success", detail: "Ticket edited successfully."});
			fetchTickets();
        } catch (err) {
            setTicketError({status: "error", detail: "Failed to edit ticket."});
            setTicketResponse(null);
        } finally {
            setTicketLoading(false);
        }

    }

    const deleteTicket = async (id) => {
        setTicketLoading(true);

        try {
            const res = await TicketServices(null, id, "DELETE");
    
            setTicketResponse({status: "success", detail: "Ticket deleted successfully."});
        } catch (err) {
            setTicketError({status: "error", detail: "Failed to delete ticket."});
            setTicketResponse(null);
        } finally {
            setTicketLoading(false);
        }
    }

    const refresh = async () => {
        fetchTickets();
    }

    // Load on first render
    useEffect(() => {
        fetchTickets();
    }, []);

    return {
        ticketData,
		ticketResponse,
        ticketLoading,
        ticketError,
        fetchTickets,
        postTicket,
        patchTicket,
        deleteTicket,
        refresh
    };
}
