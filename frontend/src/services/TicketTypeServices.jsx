import React from 'react'
import api from './api'

const TicketTypeServices = async (params, ticket_id = null, method="GET") => {

	try {
		if (method == "GET") {
			const response = await api.get(`/tickets/ticket_types/`);
	
			return response.data
		} else if (method == "POST") {
			const response = await api.post('/tickets/ticket_types/', params);

			return response.data
		} else if (method == "DELETE") {
			const response = await api.delete(`/tickets/ticket_types/${ticket_id}/`);

			return response
		} else if (method == "PATCH") {
			const response = await api.patch(`/tickets/ticket_types/${ticket_id}/`, params);

			return response
		}
	} catch (err) {
		throw err;
	}
}

export default TicketTypeServices
