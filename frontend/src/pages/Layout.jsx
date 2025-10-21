import React, {useContext, useEffect, useState} from 'react'
import {AuthContext} from '../context/AuthContext'
import { Header, Sidebar } from '../components/'
import {Outlet, Route} from 'react-router-dom'
import {Home} from '../pages'
import { Tickets, TicketPlus, UserCircle, LogOut, HomeIcon, UsersIcon, UserRoundPlusIcon } from 'lucide-react'

const Layout = () => {
	const handleOnClick = () => {
		console.log("Jello")
	}

	const {user} = useContext(AuthContext);
	const [sidebarNavItems, setSidebarNavItems] = useState([]);

	useEffect(() => {
		if (user.groups?.includes("Requesters")) {
			setSidebarNavItems([
				{label: "Home", link: "/", icon: HomeIcon},
				{label: "Tickets"},
				{label: "View Tickets", link: "/tickets", icon: Tickets},
				{label: "Submit New", link: "/tickets/create", icon: TicketPlus},
				{label: "Account"},
				{label: "View Account", link: "/me", icon: UserCircle},
				{label: "Log out", link: "/logout", icon: LogOut},
			]);
		} else if (user.groups?.includes("Managers")) {
			setSidebarNavItems([
				{label: "Home", link: "/", icon: HomeIcon},
				{label: "Tickets"},
				{label: "View Tickets", link: "/tickets", icon: Tickets},
				{label: "Agents"},
				{label: "View Agents", link: "/agents", icon: UsersIcon},
				{label: "Create New", link: "/agents/create", icon: UserRoundPlusIcon},
				{label: "Account"},
				{label: "Log out", link: "/logout", icon: LogOut},
			]);
		}
	}, [user])

	return (
		<div className='bg-main-dark w-full h-screen flex flex-col'>
			<Header name={`${user.first_name} ${user.last_name}`} onClick={handleOnClick}/>
			<div className="flex flex-row w-full flex-1">
				<Sidebar navItems={sidebarNavItems}/>
				<div className='p-4 flex-1'>
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default Layout

