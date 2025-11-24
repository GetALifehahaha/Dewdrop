import { X } from 'lucide-react';
import React from 'react';
import { AnimatePresence, easeInOut, motion } from 'framer-motion'

const PreviewImage = ({ src, onClose }) => {
    return (
        <div className='absolute top-0 left-0 w-full h-full bg-black/80 backdrop-blur-xs flex justify-center items-center p-4'>
            <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                    duration: 0.2,
                    ease: easeInOut
                }}
                className='relative h-full rounded-xl'>
                <img src={src} className='h-full' />

                <X className='absolute top-8 right-8 text-white cursor-pointer' size={18} onClick={onClose} />
                <div className='absolute bottom-0 right-0 w-full h-1/7 bg-gradient-to-t from-black/50 to-black/0'>

                </div>
            </motion.div>
        </div>
    )
}

export default PreviewImage;