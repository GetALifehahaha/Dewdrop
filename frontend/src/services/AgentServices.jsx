import api from './api'

const AgentServices = async (params = null, agent_id = null) => {
    try {
        if (agent_id) {
            const response = await api.get(`/tickets/agents/${agent_id}/`);
            return response.data;
        }

        const response = await api.get(`/tickets/agents/`);
        return response.data;

    } catch (err) {
        throw err;
    }
};

export default AgentServices