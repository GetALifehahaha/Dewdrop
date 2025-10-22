import React, { useContext, useState, useEffect } from 'react'
import {AuthContext} from '../context/AuthContext'
import {Title, Button, DateBlock, Card, LatestTicketCard} from '../components'
import { TicketPlus } from 'lucide-react'
import { useDashboardData } from '../hooks'

const Home = () => {
	const {user} = useContext(AuthContext);
	const {dashboardCounts, latestTicket, loading, error} = useDashboardData();

	if (loading) return <p>Loading dashboard...</p>;
	if (error) return <p>Error loading dashboard data.</p>;

	console.log(latestTicket.created_at)

	const formatTitle = (title) => {
        let first = title.split('_')[0] || title;
        return first.charAt(0).toUpperCase() + first.slice(1);
    }

	const listDashboardCard = Object.entries(dashboardCounts || {}).map(([title, count], index) => 
		<Card key={index} title={formatTitle(title)} count={count}/>
	)

	return (
		<>
			{/* Welcome Block */}
			<div className="flex justify-between h-fit">
				<Title text={`Hello, ${user.first_name}`}/>
				<Button icon={TicketPlus} text='Create Request' onClick={() => console.log("Hi")}/>
			</div>

			{/* Recently Sent Tickets */}
			<div className='p-8 bg-main rounded-2xl shadow-sm flex flex-col gap-6'>
				<div className='flex justify-between'>
					<Title variant="blockTitle" text='Home'/>
					<DateBlock hasWeekday={true}/>
				</div>
				
				{/* 2 tickets: Urgent Priority */}
				<div className='flex flex-row gap-4'>
					<LatestTicketCard title={latestTicket.title} description={latestTicket.description} datetime={latestTicket.created_at}/>
					{listDashboardCard}
				</div>
			</div>
		</>
	)
}

export default Home
