import { useState, useEffect } from "react";
import { AgentServices } from "../services"; // Make sure this exists

export default function useAgent() {
    const [agentResponse, setAgentResponse] = useState();
    const [agentData, setAgentData] = useState([]);
    const [agentLoading, setAgentLoading] = useState(true);
    const [agentError, setAgentError] = useState(null);

    // GET LIST
    const fetchAgents = async () => {
        try {
            setAgentLoading(true);

            const data = await AgentServices();
            setAgentData(data);
        } catch (err) {
            setAgentError({ status: "error", detail: "Failed to read agents." });
        } finally {
            setAgentLoading(false);
        }
    };

    // CREATE
    const postAgent = async (params) => {
        setAgentLoading(true);
        try {
            await AgentServices(params, null, "POST");
            setAgentResponse({ status: "success", detail: "Agent created successfully." });
            fetchAgents();
        } catch (err) {
            setAgentError({ status: "error", detail: "Failed to create agent." });
            setAgentResponse(null);
        } finally {
            setAgentLoading(false);
        }
    };

    // UPDATE
    const patchAgent = async (id, params) => {
        console.log("Start")
        setAgentLoading(true);
        try {
            console.log("Doing")
            await AgentServices(params, id, "PATCH");
            setAgentResponse({ status: "success", detail: "Agent updated successfully." });
            fetchAgents();
            console.log("Success")
        } catch (err) {
            setAgentError({ status: "error", detail: "Failed to update agent." });
            setAgentResponse(null);
            console.log("Error")
        } finally {
            setAgentLoading(false);
        }
        console.log("End")
    };

    // DELETE
    const deleteAgent = async (id) => {
        setAgentLoading(true);
        try {
            await AgentServices(null, id, "DELETE");
            setAgentResponse({ status: "success", detail: "Agent deleted successfully." });
            fetchAgents();
        } catch (err) {
            setAgentError({ status: "error", detail: "Failed to delete agent." });
            setAgentResponse(null);
        } finally {
            setAgentLoading(false);
        }
    };

    // Refresh
    const refresh = () => {
        fetchAgents();
    };

    // Load on first render
    useEffect(() => {
        fetchAgents();
    }, []);

    return {
        agentData,
        agentResponse,
        agentLoading,
        agentError,
        fetchAgents,
        postAgent,
        patchAgent,
        deleteAgent,
        refresh,
    };
}
