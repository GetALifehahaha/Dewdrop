import React from 'react'
import api from './api'

const TicketServices = async (params = {}) => {

	try {
		const response = await api.get(`/tickets/tickets/`, {params});

		return response.data
	} catch (err) {
		return err;
	}
}

export default TicketServices
