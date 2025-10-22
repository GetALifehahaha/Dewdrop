import React, {useContext} from 'react'
import { AuthContext } from '../context/AuthContext'

const Tickets = () => {
    const {user} = useContext(AuthContext);

    return (
        <div>
            HI
        </div>
    )
}

export default Tickets
