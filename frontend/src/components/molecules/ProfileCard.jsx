import React from 'react'
import { Button, Label } from '../atoms'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

const ProfileCard = ({username="Username", firstName="First Name", lastName="Last Name", email="emailaddress@gmail.com", imageUrl=null}) => {

    const navigate = useNavigate();

    return (
        <motion.div 
        initial={{y: -10, opacity: 0}}
        animate={{y: 0, opacity: 1}}
        exit={{y: -10, opacity: 0}}
        className='z-10 absolute right-2 top-14 px-16 py-4 rounded-md shadow-sm bg-main flex flex-col gap-4 items-center'>
            <Label text='User Profile'/>
            {imageUrl ? <div className='w-4 h-4 rounded-sm'></div> : <div className='w-24 h-24 rounded-full bg-gray-500'></div>}

            <div className='flex flex-col gap-0.5 w-full'>
                <Label variant='small' text='Username' />
                <h5 className='text-text'>{username}</h5>
            </div>

            <div className='flex flex-col gap-0.5 w-full'>
                <Label variant='small' text='Full Name' />
                <div className='flex items-center gap-2'>
                    <h5 className='text-text'>{firstName}</h5>
                    <h5 className='text-text'>{lastName}</h5>
                </div>
            </div>

            <div className='flex flex-col gap-0.5 w-full'>
                <Label variant='small' text='Email' />
                <h5 className='text-text'>{email}</h5>
            </div>

            <div className='mx-auto'>
                <Button text='Log out' onClick={() => navigate('/logout')}/>
            </div>
        </motion.div>
    )
}

export default ProfileCard