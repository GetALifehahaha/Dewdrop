import React, {useState, useEffect} from 'react'
import DashboardServices from '../services/DashboardServices'

const useDashboardData = () => {
    const [dashboardCounts, setDashboardCounts] = useState(null);
    const [latestTicket, setLatestTicket] = useState(null);
    const [mostSent, setMostSent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await DashboardServices();
                setDashboardCounts(data.dashboard_counts);
                setLatestTicket(data.latest_ticket);
                setMostSent(data.most_sent_ticket_type);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [])

    return {dashboardCounts, mostSent, latestTicket, loading, error}
}

export default useDashboardData;