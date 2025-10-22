import React from 'react'
import api from './api'

const DashboardServices = async () => {
	try {
		const response = await api.get('/tickets/dashboard/')
		
		return response.data
	} catch (err) {
		alert(err)
	}
}

export default DashboardServices
