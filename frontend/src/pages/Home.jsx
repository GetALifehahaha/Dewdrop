import React, { use } from 'react'
import { useContext } from 'react'
import {AuthContext} from '../context/AuthContext'
import {Title, Button} from '../components'
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
		</>
	)
}

export default Home
