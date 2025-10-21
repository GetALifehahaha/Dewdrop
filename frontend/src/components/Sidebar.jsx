import React from 'react'
import {Link} from 'react-router-dom'

const Sidebar = ({navLinks=[{name: "View Tickets", link: '/'}, {name: "Submit New Ticket", link: "/newTicket"}]}) => {

    const listNav = navLinks.map((navItem, index) => 
        <Link key={index} to={navItem.link} className='font-medium text-text/75 py-2 px-8 rounded-sm hover:bg-main-dark'>{navItem.name}</Link>
    )

    return (
        <div className='h-screen flex flex-col gap-1 text-text bg-main w-fit px-2 py-4'>
            {listNav}
        </div>
    )
}

export default Sidebar
