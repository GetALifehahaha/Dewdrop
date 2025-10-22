import React from 'react'
import {Link} from 'react-router-dom'
import {useContext} from 'react'
import {AuthContext} from '../context/AuthContext'
import {NavConfig} from '../config/NavConfig'


const Sidebar = () => {
    const {user} = useContext(AuthContext);
    const role = user.groups?.[0] || 'Requesters';
    const navItems = NavConfig[role]

    const listNavItems = Object.entries(navItems).map(([section, items]) => 
    <div key={section} className='flex flex-col font-medium py-2'>
        {section && <h5 className='text-text/50'>{section}</h5>}
        <div className='flex flex-col'>
            {items.map(({label, link, icon: Icon}) => <Link key={label} to={link} className='flex gap-2 px-6 py-2 rounded-sm hover:bg-main-dark text-text/75'>{Icon && <Icon width={16} />} {label}</Link>)}
        </div>
    </div>)

    return (
        <div className='min-w-40 flex flex-col gap-1 text-text bg-main w-fit px-4 py-4'>
            {listNavItems}
        </div>
    )
}

export default Sidebar
