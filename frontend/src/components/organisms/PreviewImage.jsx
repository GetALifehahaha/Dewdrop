import { X } from 'lucide-react';
import React from 'react';

const PreviewImage = ({src, onClose}) => {
    return (
        <div className='absolute top-0 left-0 w-full h-full bg-black/80 backdrop-blur-xs flex justify-center items-center'>
            <img src={src} className='h-full p-20 rounded-xl' />

            <X className='absolute top-2 right-2 text-white cursor-pointer' size={18} onClick={onClose} />
        </div>
    )
}

export default PreviewImage;