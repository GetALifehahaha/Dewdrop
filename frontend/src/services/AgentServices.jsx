import api from './api'

const AgentServices = async (params, agent_id = null, method="GET") => {

	try {
		if (method == "GET") {
			if (agent_id) {
				const response = await api.get(`/tickets/agents/${agent_id}/`);
	
				return response.data
			} 
	
			const response = await api.get(`/tickets/agents/`, {params});
	
			return response.data
		} else if (method == "POST") {
			const response = await api.post('/tickets/agents/', params);

			return response.data
		} else if (method == "DELETE") {
			const response = await api.delete(`/tickets/agents/${agent_id}/`);

			return response
		} else if (method == "PATCH") {
			const response = await api.patch(`/tickets/agents/${agent_id}/`, params);

			return response
		}
	} catch (err) {
		throw err;
	}
}

export default AgentServices