import React, {useContext} from 'react'
import { AuthContext } from '../context/AuthContext'
import {Title} from '../components/atoms'
import {Searchbar} from '../components/molecules'
import {TicketList} from '../components/organisms';

const Tickets = () => {
    return (
        <>
            <Title text='Tickets'/>
            <Searchbar />
            <TicketList />
        </>
    )
}

export default Tickets
