import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'

const Sidebar = ({role}) => {
  const [sidebarRoutes, setSidebarRoutes] = useState({});

  useEffect(() => {
    if (role == "Requesters") {
      setSidebarRoutes({
        Home: "/",
        Tickets: "/tickets",
      })
    } else if (role == "Managers") {
      setSidebarRoutes({
        Home: "/",
        Tickets: "/tickets",
        Agents: "/agents",
      })
    }
  }, []);

  const listSidebar = Object.entries(sidebarRoutes).map((key, value, index) => <Link key={index} to={value}>{key}</Link>)


  return (
    <div className='p-8 bg-main flex flex-col h-full'>
      <h5>Dewdrop</h5>

      <div className='flex flex-col gap-4'>
        {listSidebar}
      </div>

      <Link to={'/logout'}>Log out</Link>
    </div>
  )
}

export default Sidebar
