import React, {useState, useEffect} from 'react'
import DashboardServices from '../services/DashboardServices'

const useDashboardData = () => {
    const [dashboardCounts, setDashboardCounts] = useState(null);
    const [latestTicket, setLatestTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const data = await DashboardServices();
                setDashboardCounts(data.dashboard_counts);
                setLatestTicket(data.latest_ticket)
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        }

        fetchDashboardData();
    }, [])

    return {dashboardCounts, latestTicket, loading, error}
}

export default useDashboardData;