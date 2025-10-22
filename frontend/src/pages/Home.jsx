import React, { use } from 'react'
import { useContext } from 'react'
import {AuthContext} from '../context/AuthContext'
import {Title, Button, DateBlock, Card} from '../components'
import { TicketPlus } from 'lucide-react'

const Home = () => {
	const {user} = useContext(AuthContext);

	return (
		<>
			{/* Welcome Block */}
			<div className="flex justify-between h-fit">
				<Title text={`Hello, ${user.first_name}`}/>
				<Button icon={TicketPlus} text='Create Request' onClick={() => console.log("Hi")}/>
			</div>

			{/* Recently Sent Tickets */}
			<div className='p-4 bg-main rounded-md shadow-sm'>
				<div className='flex justify-between'>
					<Title variant="blockTitle" text='Recent Tickets'/>
					<DateBlock hasNamedMonth={true}/>
				</div>
				
				{/* 2 tickets: Urgent Priority */}
				<div>
					<Card />
				</div>
			</div>
		</>
	)
}

export default Home
