import React, {useContext, useState} from 'react'
import {AuthContext} from '../context/AuthContext'
import { Header, Sidebar, ProfileCard } from '../components/molecules'
import {Outlet} from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'

const Layout = () => {
	const [showProfileCard, setShowProfileCard] = useState(false);

	const {user} = useContext(AuthContext);
	const handleSetShowProfileCard = () => setShowProfileCard(!showProfileCard);

	return (
		<div className='w-full h-screen flex flex-col'>
			<Header name={`${user.first_name} ${user.last_name}`} onClick={handleSetShowProfileCard}/>
			<AnimatePresence>
				{showProfileCard &&
					<ProfileCard username={user.username} firstName={user.first_name} lastName={user.last_name} email={user.email}/>
				}
			</AnimatePresence>
			<div className="flex flex-row w-full h-full overflow-hidden">
				<Sidebar />
				<div className='bg-main-dark p-8 flex-1 h-full overflow-auto flex flex-col gap-6'>
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default Layout

