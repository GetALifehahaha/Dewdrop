import React from 'react'
import api from './api'

const TicketStatsServices = async () => {
	try {
		const response = await api.get('/tickets/stats/')
		
		return response.data
	} catch (err) {
		return err;
	}
}

export default TicketStatsServices
