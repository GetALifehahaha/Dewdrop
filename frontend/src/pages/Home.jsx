import React, { useContext, useState, useEffect } from 'react'
import {AuthContext} from '../context/AuthContext'
import {Title, Button, DateBlock} from '../components/atoms'
import {DashboardCard} from '../components/molecules'
import {LatestTicketCard} from '../components/organisms'
import { TicketPlus } from 'lucide-react'
import { useDashboardData } from '../hooks'
import { useNavigate } from 'react-router-dom'

const Home = () => {
	const {user} = useContext(AuthContext);
	const {dashboardCounts, latestTicket, loading, error} = useDashboardData();
	const navigate = useNavigate();

	if (loading) return <p>Loading dashboard...</p>;
	if (error) return <p>Error loading dashboard data.</p>;

	const formatTitle = (title) => {
        let first = title.split('_')[0] || title;
        return first.charAt(0).toUpperCase() + first.slice(1);
    }

	const redirectToCreateTicket = () => navigate('/ticket-create')

	const listDashboardCard = Object.entries(dashboardCounts || {}).map(([title, count], index) => 
		<DashboardCard key={index} title={formatTitle(title)} count={count}/>
	)

	return (
		<>
			{/* Welcome Block */}
			<div className="flex justify-between h-fit">
				<Title text={`Hello, ${user.first_name}`}/>
				<Button icon={TicketPlus} text='Create Request' onClick={redirectToCreateTicket}/>
			</div>

			{/* Recently Sent Tickets */}
			<div className='p-8 bg-main rounded-2xl shadow-sm flex flex-col gap-6'>
				<div className='flex justify-between'>
					<Title variant="blockTitle" text='Home'/>
					<DateBlock hasWeekday={true}/>
				</div>
				
				{/* 2 tickets: Urgent Priority */}
				<div className='flex flex-row gap-4'>
					{
						latestTicket && 
						<LatestTicketCard 
						severity_display={latestTicket.severity_display} 
						title={latestTicket.title} 
						description={latestTicket.description} 
						datetime={latestTicket.created_at}
						id={latestTicket.id}
						/>
					}
					<div className='h-fit flex-1 flex gap-2'>
						{listDashboardCard}
					</div>
				</div>
			</div>
		</>
	)
}

export default Home
