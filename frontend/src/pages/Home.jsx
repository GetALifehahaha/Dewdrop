import React, { useContext, useState, useEffect } from 'react'
import {AuthContext} from '../context/AuthContext'
import {Title, Button, DateBlock, DateTime} from '../components/atoms'
import {DashboardCard} from '../components/molecules'
import {LatestTicketCard} from '../components/organisms'
import { TicketPlus, TicketsIcon } from 'lucide-react'
import { useDashboardData, useTicketData } from '../hooks'
import { useNavigate } from 'react-router-dom'

const Home = () => {
	const {user} = useContext(AuthContext);
	const {dashboardCounts, latestTicket, loading, error} = useDashboardData();
	const {ticketData, error: ticketError, loading: ticketLoading} = useTicketData();
	const navigate = useNavigate();

	if (loading) return <p>Loading dashboard...</p>;
	if (ticketLoading) return <p>Loading tickets...</p>;
	if (error) return <p>Error loading dashboard data.</p>;
	if (ticketError) return <p>Error loading ticket data...</p>;

	const formatTitle = (title) => {
        let first = title.split('_')[0] || title;
        return first.charAt(0).toUpperCase() + first.slice(1);
    }

	const redirectToCreateTicket = () => navigate('/ticket-create')

	const listDashboardCard = Object.entries(dashboardCounts || {}).map(([title, count], index) => 
		<DashboardCard key={index} title={formatTitle(title)} count={count} description={user.groups == "Requesters" ? "Tickets Sent" : "Tickets Received"}/>
	)

	const listTicket = ticketData.results.map((ticket, index) => <div key={index} onClick={() => navigate(`/tickets/${ticket.id}`)} className='flex flex-1 text-text font-medium rounded-sm py-2 px-0.5 hover:bg-main-hover cursor-pointer'>
		<h5 className='flex-1'>{ticket.title}</h5>
		<h5 className='flex-1'>{ticket.status_display}</h5>
		<h5 className='flex-1'>{ticket.severity_display}</h5>
		<h5 className='flex-1'><DateTime dateTime={ticket.created_at} hasDate={true} /></h5>
	</div>)

	return (
		<>
			{/* Welcome Block */}
			<div className="flex justify-between h-fit">
				<Title text={`Hello, ${user.first_name}`}/>
				<Button icon={TicketPlus} text='Create Request' onClick={redirectToCreateTicket}/>
			</div>

			<div className='p-8 bg-main rounded-2xl shadow-sm flex flex-col gap-6'>
				<div className='flex justify-between'>
					<Title variant="blockTitle" text='Home'/>
					<DateBlock hasWeekday={true}/>
				</div>
				
				<div className='h-fit flex-1 flex gap-2'>
					{listDashboardCard}
				</div>
				
				<div className='flex gap-4 items-center'>
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
				</div>
			</div>

			<div className='p-8 bg-main rounded-2xl shadow-sm flex flex-col gap-6'>
				<div className='flex justify-between'>
					<Title variant="blockTitle" text='Tickets'/>
					<Button text='View Tickets' icon={TicketsIcon}/>
				</div>

				<div className='p-2 flex flex-col gap-4 rounded-md shadow-sm'>
					<div className='flex flex-1 text-text/50 font-semibold bg-main-dark p-0.5 rounded-sm'>
						<h5 className='flex-1'>Ticket Title</h5>
						<h5 className='flex-1'>Status</h5>
						<h5 className='flex-1'>Severity</h5>
						<h5 className='flex-1'>Submission Date</h5>
					</div>

					<div className='flex flex-1 flex-col gap-4'>
						{listTicket}
					</div>
				</div>
			</div>
		</>
	)
}

export default Home
