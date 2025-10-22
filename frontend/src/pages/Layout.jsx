import React, {useContext, useEffect, useState} from 'react'
import {AuthContext} from '../context/AuthContext'
import { Header, Sidebar } from '../components/'
import {Outlet, Route} from 'react-router-dom'
import {Home} from '../pages'

const Layout = () => {
	const handleOnClick = () => {
		console.log("Jello")
	}

	const {user} = useContext(AuthContext);

	return (
		<div className='bg-main-dark w-full h-screen flex flex-col'>
			<Header name={`${user.first_name} ${user.last_name}`} onClick={handleOnClick}/>
			<div className="flex flex-row w-full flex-1">
				<Sidebar />
				<div className='p-8 flex-1 flex flex-col gap-6'>
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default Layout

