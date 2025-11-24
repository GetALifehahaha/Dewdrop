import React, { useContext, useState, useEffect } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Title, Button, DateBlock, DateTime } from '../components/atoms'
import { DashboardCard, StatusDisplay } from '../components/molecules'
import { LatestTicketCard } from '../components/organisms'
import { TicketPlus, TicketsIcon, Loader2 } from 'lucide-react'
import useDashboardData from '../hooks/useDashboardData'
import { useNavigate } from 'react-router-dom'
import useTicket from '../hooks/useTicket'
import BarChartLabel from '../components/organisms/BarChart'

const Home = () => {
	const { user } = useContext(AuthContext);
	const { dashboardCounts, latestTicket, mostSent, loading, error } = useDashboardData();
	const { ticketData, ticketError, ticketLoading } = useTicket();
	const navigate = useNavigate();

	if (loading || ticketLoading) return <div className='absolute top-0 left-0 w-full h-screen z-10 flex justify-center items-center bg-black/5'>
		<Loader2 className='text-main animate-spin' size={60} />
	</div>;

	if (error) return <p>Error loading dashboard data.</p>;
	if (ticketError) return <p>Error loading ticket data...</p>;

	const formatTitle = (title) => {
		let first = title.split('_')[0] || title;
		return first.charAt(0).toUpperCase() + first.slice(1);
	}

	const redirectToCreateTicket = () => navigate('/ticket-create')

	const listDashboardCard = Object.entries(dashboardCounts || {}).map(([title, count], index) =>
		<DashboardCard key={index} title={formatTitle(title)} count={count} description={user.groups[0] == "Requesters" ? "Tickets Sent" : "Tickets Received"} />
	)

	const listTicket = ticketData.results.map((ticket, index) => <div key={index} onClick={() => navigate(`/tickets/${ticket.id}`)} className='flex flex-1 text-text font-medium rounded-sm py-2 px-0.5 hover:bg-main-hover cursor-pointer'>
		<h5 className='flex-1'>{ticket.title}</h5>
		<div className='flex-1'>
			<StatusDisplay status={ticket.status} status_display={ticket.status_display} />
		</div>
		<h5 className='flex-1'>{ticket.severity_display}</h5>
		<h5 className='flex-1'><DateTime dateTime={ticket.created_at} hasDate={true} /></h5>
	</div>)

	return (
		<>
			{/* Welcome Block */}
			<div className="flex justify-between h-fit">
				<Title text={`Hello, ${user.first_name}`} />
				{user.groups[0] == 'Requesters' &&
					<Button icon={TicketPlus} text='Create Request' onClick={redirectToCreateTicket} />
				}
			</div>

			<div className='p-8 bg-main rounded-2xl shadow-sm flex flex-col gap-6'>
				<div className='flex justify-between'>
					<Title variant="blockTitle" text='Home' />
					<DateBlock hasWeekday={true} />
				</div>

				<div className='flex flex-col xl:flex-row gap-6'>
					<div className='flex flex-col gap-6 flex-1'>
						<div className='h-fit flex flex-col xl:flex-row gap-4'>
							<div className='flex-1 md:flex-1/2 h-full flex gap-4'>
								{listDashboardCard}
							</div>
							{
								mostSent && user.groups[0] == "Managers" &&

								<div className='flex-1 md:flex-1/2 p-6 rounded-lg border border-main-dark shadow-sm'>
									<h5 className='font-medium text-text'>Popular: <strong>{mostSent.ticket_type}</strong></h5>
									<h5 className='p-4 text-3xl font-bold'>{mostSent.count}</h5>
									<h5 className='text-text/50 font-semibold text-sm'>Most popular ticket types this month</h5>
								</div>
							}
						</div>

						<div className='flex h-full gap-4 items-center '>
							{
								latestTicket &&
								<LatestTicketCard
									latestTicket={latestTicket}
								/>
							}
						</div>
					</div>

					{user.groups[0] == "Managers" &&
						<div className='flex flex-1 flex-col gap-6'>
							<BarChartLabel />
						</div>
					}
				</div>
			</div>

			<div className='p-8 bg-main rounded-2xl shadow-sm flex flex-col gap-6'>
				<div className='flex justify-between'>
					<Title variant="blockTitle" text='Tickets' />
					<Button text='View Tickets' icon={TicketsIcon} onClick={() => navigate('/tickets')} />
				</div>

				<div className='p-2 flex flex-col gap-4 rounded-md shadow-sm border border-main-dark text-sm md:text-base'>
					<div className='flex flex-1 text-text/50 font-semibold p-0.5 pb-2 border-b-2 border-b-main-dark '>
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
