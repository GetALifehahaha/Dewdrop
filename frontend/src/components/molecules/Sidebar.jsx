import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import { NavConfig } from '../../config/NavConfig'
import { ChevronLeftIcon, LogOut } from 'lucide-react'


const Sidebar = () => {
    const { user } = useContext(AuthContext);
    const role = user.groups?.[0] || 'Requesters';
    const navItems = NavConfig[role]
    const [expanded, setExpanded] = useState(false);

    const handleSetExpanded = () => setExpanded(!expanded);

    const listNavItems = Object.entries(navItems).map(([section, items]) =>
        <div key={section} className='flex flex-col font-medium py-2'>
            {section && expanded && <h5 className={`text-text/50`}>{section}</h5>}
            <div className='flex flex-col'>
                {items.map(({ label, link, icon: Icon }) => <NavLink key={label} to={link} className={({ isActive }) => ((isActive) ? `flex items-center gap-4 px-4 py-2 rounded-sm hover:bg-main-dark text-accent-blue` : 'flex items-center gap-4 px-4 py-2 rounded-sm hover:bg-main-dark text-text/75')}>{Icon && <Icon size={20} />} {expanded && label}</NavLink>)}
            </div>
        </div>)

    return (
        <div className='flex flex-col gap-1 text-text bg-main w-fit px-4 py-4 relative'>
            <button className='hid  den sm:block absolute right-0 bg-main hover:bg-main-hover translate-x-1/2 text-accent-blue border-main-hover border py-2 rounded-md cursor-pointer' onClick={handleSetExpanded}><ChevronLeftIcon className={`${(expanded) ? 'rotate-0' : 'rotate-180'}`} size={20} /></button>
            {listNavItems}
            <Link className='mt-auto flex items-center gap-4 px-4 py-2 rounded-sm hover:bg-main-dark' to={'/logout'}><LogOut size={20} />{expanded && 'Log out'}</Link>
        </div>
    )
}

export default Sidebar
