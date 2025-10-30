import React, {useContext} from 'react'
import { AuthContext } from '../context/AuthContext'
import {Title} from '../components/atoms'
import {Searchbar} from '../components/molecules'
import {TicketList} from '../components/organisms';

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
