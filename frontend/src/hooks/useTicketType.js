import { useState, useEffect } from "react";
import { TicketTypeServices } from "../services"; // make sure this exists

export default function useTicketType() {
    const [ticketTypeResponse, setTicketTypeResponse] = useState();
    const [ticketTypeData, setTicketTypeData] = useState([]);
    const [ticketTypeLoading, setTicketTypeLoading] = useState(true);
    const [ticketTypeError, setTicketTypeError] = useState(null);

    // GET LIST
    const fetchTicketTypes = async () => {
        try {
            setTicketTypeLoading(true);

            const data = await TicketTypeServices();
            setTicketTypeData(data);
        } catch (err) {
            setTicketTypeError({ status: "error", detail: "Failed to read ticket types." });
        } finally {
            setTicketTypeLoading(false);
        }
    };

    // CREATE
    const postTicketType = async (params) => {
        setTicketTypeLoading(true);
        try {
            await TicketTypeServices(params, null, "POST");
            setTicketTypeResponse({ status: "success", detail: "Ticket type created successfully." });
            fetchTicketTypes();
        } catch (err) {
            setTicketTypeError({ status: "error", detail: "Failed to create ticket type." });
            setTicketTypeResponse(null);
        } finally {
            setTicketTypeLoading(false);
        }
    };

    // UPDATE
    const patchTicketType = async (id, params) => {
        setTicketTypeLoading(true);
        try {
            await TicketTypeServices(params, id, "PATCH");
            setTicketTypeResponse({ status: "success", detail: "Ticket type updated successfully." });
            fetchTicketTypes();
        } catch (err) {
            setTicketTypeError({ status: "error", detail: "Failed to update ticket type." });
            setTicketTypeResponse(null);
        } finally {
            setTicketTypeLoading(false);
        }
    };

    // DELETE
    const deleteTicketType = async (id) => {
        setTicketTypeLoading(true);
        try {
            await TicketTypeServices(null, id, "DELETE");
            setTicketTypeResponse({ status: "success", detail: "Ticket type deleted successfully." });
            fetchTicketTypes();
        } catch (err) {
            setTicketTypeError({ status: "error", detail: "Failed to delete ticket type." });
            setTicketTypeResponse(null);
        } finally {
            setTicketTypeLoading(false);
        }
    };

    // Refresh
    const refresh = () => {
        fetchTicketTypes();
    };

    // Load on first render
    useEffect(() => {
        fetchTicketTypes();
    }, []);

    return {
        ticketTypeData,
        ticketTypeResponse,
        ticketTypeLoading,
        ticketTypeError,
        fetchTicketTypes,
        postTicketType,
        patchTicketType,
        deleteTicketType,
        refresh,
    };
}
