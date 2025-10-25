import React, {useContext} from 'react'
import { AuthContext } from '../context/AuthContext'
import {Title, Searchbar} from '../components'
import TicketList from '../components/TicketList';

const Tickets = () => {
    const {user} = useContext(AuthContext);

    return (
        <div className='flex flex-col gap-8'>
            <Title text='Tickets'/>
            <Searchbar />
            <TicketList />
        </div>
    )
}

export default Tickets
