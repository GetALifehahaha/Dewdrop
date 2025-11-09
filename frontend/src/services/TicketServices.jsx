import React from 'react'
import api from './api'

const TicketServices = async (params, ticket_id = null, method="GET") => {

	try {
		if (method == "GET") {
			if (ticket_id) {
				const response = await api.get(`/tickets/tickets/${ticket_id}/`);
	
				return response.data
			} 
	
			const response = await api.get(`/tickets/tickets/`, {params});
	
			return response.data
		} else if (method == "POST") {
			const response = await api.post('/tickets/tickets/', params);

			return response.data
		} else if (method == "DELETE") {
			const response = await api.delete(`/tickets/tickets/${ticket_id}/`);

			return response
		} else if (method == "PATCH") {
			const response = await api.patch(`/tickets/tickets/${ticket_id}`, {params});

			return response
		}
	} catch (err) {
		throw err;
	}
}

export default TicketServices
