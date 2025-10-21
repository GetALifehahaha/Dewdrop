import React from 'react'
import {Link} from 'react-router-dom'

const Sidebar = ({navItems=[]}) => {

    const listNav = navItems.map(({label, link, icon: Icon}, index) => 
        (link) ? 
            <Link key={index} to={link} className='font-medium text-text/75 py-2 px-8 rounded-sm hover:bg-main-dark flex gap-4'>{Icon && <Icon width={16}/>} {label}</Link>
        :
            <h5 key={index} className='font-medium text-text/50 px-2'>{label}</h5>
    )

    return (
        <div className='min-w-40 flex flex-col gap-1 text-text bg-main w-fit px-2 py-4'>
            {listNav}
        </div>
    )
}

export default Sidebar
