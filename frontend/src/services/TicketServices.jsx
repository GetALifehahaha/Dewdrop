import React from 'react'
import api from './api'

const TicketServices = async () => {
	try {
		const response = await api.get('/tickets/tickets/');

		return response.data
	} catch (err) {
		return err;
	}
}

export default TicketServices
