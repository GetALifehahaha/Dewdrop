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
		}
	} catch (err) {
		return err;
	}
}

export default TicketServices
