import React, {useContext} from 'react'
import {AuthContext} from '../context/AuthContext'
import { Header, Sidebar } from '../components/molecules'
import {Outlet} from 'react-router-dom'

const Layout = () => {
	const handleOnClick = () => {
		console.log("Jello")
	}

	const {user} = useContext(AuthContext);

	return (
		<div className='w-full h-screen flex flex-col'>
			<Header name={`${user.first_name} ${user.last_name}`} onClick={handleOnClick}/>
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

