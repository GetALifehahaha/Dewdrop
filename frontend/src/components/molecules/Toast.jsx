import React, { useState, useEffect } from 'react';
import {AnimatePresence, motion} from 'framer-motion'

const Toast = React.memo(( {toastMessages = [{ message: "Message", status: "success", icon: null }]} ) => {

    const toastMessageVariants = {
        success: "text-green-500",
        error: "text-red-400",
        info: "text-text"
    }

    const listToastMessages = toastMessages.map(({message, status, icon: Icon}, index) => 
        <motion.h5 
        initial={{opacity: 0, translateY: -150}}
        animate={{opacity: 1, translateY: 0}}
        exit={{opacity: 0, translateY: 150}}
        key={index} 
        className={`font-semibold bg-main px-4 py-2 rounded-xl shadow-md text-sm flex gap-2 items-center ${toastMessageVariants[status]}`}>
            {Icon && <Icon size={18} />}{message}
        </motion.h5>
    )

    console.log("Update: ", toastMessages)

    return (
        <div className='absolute top-5 left-1/2 -translate-x-1/2'>
            <AnimatePresence>
                {listToastMessages}
            </AnimatePresence>
        </div>
    );
});

export default Toast;
