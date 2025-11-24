import React, { useState, useEffect } from 'react';
import { Title, Label, Input, Textarea, Dropdown, Button } from '../components/atoms'
import { Toast } from '../components/molecules'
import { X, Pen, Upload, Loader2, Check, } from 'lucide-react';
import useTicket from '../hooks/useTicket';
import useTicketType from '../hooks/useTicketType';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../services/constants';

const CreateTicket = () => {
    const { postTicket, ticketResponse, ticketError, ticketLoading } = useTicket();
    const { ticketTypeData, ticketTypeLoading, ticketTypeError } = useTicketType();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState();
    const [ticketType, setTicketType] = useState();
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [errorMessages, setErrorMessages] = useState([]);
    const [toastMessages, setToastMessages] = useState([]);

    useEffect(() => {
        if (ticketResponse) {
            setToastMessages([{
                message: ticketResponse.detail,
                status: ticketResponse.status,
                icon: Check
            }]);
        }

        if (ticketError) {
            setToastMessages([{
                message: ticketError.detail,
                status: ticketError.detail,
                icon: X
            }]);
        }
    }, [ticketResponse, ticketError]);

    useEffect(() => {
        if (toastMessages.length > 0) {
            const timer = setTimeout(() => setToastMessages([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessages]);

    if (ticketTypeLoading) return <h5>Loading ticket types...</h5>
    if (ticketTypeError) return <h5>Error loading types...</h5>

    const handleSetTitle = (value) => setTitle(value);
    const handleSetDescription = (value) => setDescription(value);
    const handleSetSeverity = (value) => setSeverity(value);
    const handleSetTicketType = (value) => setTicketType(value);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            if (!file.type.startsWith('image/')) {
                setErrorMessages(prev => [...prev, "Please upload a valid image file"]);
                return;
            }

            // Validate file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                setErrorMessages(prev => [...prev, "Image size should be less than 5MB"]);
                return;
            }

            setImage(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemoveImage = () => {
        setImage(null);
        setImagePreview(null);
    };

    const severitySelections = [
        { name: "Low", value: "low" },
        { name: "Medium", value: "medium" },
        { name: "Urgent", value: "urgent" },
    ]

    const ticketTypeSelections = ticketTypeData.map((type) => { return { name: type.name, value: type.id } })

    const listErrorMessages = errorMessages.map((message, index) => <h5 key={index} className='text-sm text-red-400 font-medium flex items-center gap-2'><X size={14} />{message}</h5>)

    const uploadToCloudinary = async (imageFile) => {
        const formData = new FormData();
        formData.append('file', imageFile);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
                {
                    method: 'POST',
                    body: formData
                }
            );

            if (!response.ok) {
                throw new Error('Failed to upload image');
            }

            const data = await response.json();
            return data.secure_url; // Returns the Cloudinary URL
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw error;
        }
    };

    const handleSubmitTicket = async () => {
        setErrorMessages([]);

        if (!title) setErrorMessages(er => [...er, "Please provide a title for your ticket"]);
        if (!description) setErrorMessages(er => [...er, "Please include a description of the issue."])
        if (!severity) setErrorMessages(er => [...er, "Please select a severity level."]);
        if (!ticketType) setErrorMessages(er => [...er, "Please select a ticket type."]);

        if (title && description && severity && ticketType) {

            let imageUrl = null;

            if (image) {
                setImageUploading(true);
                try {
                    imageUrl = await uploadToCloudinary(image);
                } catch (error) {
                    setErrorMessages(prev => [...prev, "Failed to upload image. Please try again."]);
                    setImageUploading(false);
                    return;
                }
                setImageUploading(false);
            }

            await postTicket({ title: title, description: description, severity: severity, ticket_type: ticketType, image: imageUrl });
        }
    }

    return (
        <>
            <Toast toastMessages={toastMessages} />
            <Title text='Submit a Ticket' />

            <div className='p-4 bg-main rounded-md shadow-sm'>
                <Title variant='blockTitle' text='Ticket Information' icon={Pen} />
                <div className='flex flex-col'>
                    <div className="flex gap-2 flex-wrap">
                        <div className='p-2 flex flex-col'>
                            <Label text='Title' required={true} />
                            <Input placeholder='What is this request all about?' onChange={handleSetTitle} />
                        </div>
                        <div className='p-2'>
                            <Label text='Severity' required={true} />
                            <Dropdown value={severity} selectName="Severity" selectItems={severitySelections} onSelect={handleSetSeverity} />
                        </div>
                        <div className='p-2'>
                            <Label text='Type' required={true} />
                            <Dropdown value={ticketType} selectName="Type" selectItems={ticketTypeSelections} onSelect={handleSetTicketType} />
                        </div>
                    </div>
                    <div className='p-2 flex flex-col'>
                        <Label text='Description' type='textbox' required={true} />
                        <Textarea placeholder='What would be the content of this ticket request?' onChange={handleSetDescription} />
                    </div>
                    <div className='p-2 flex flex-col'>
                        <Label text='Image' />
                        <div className='mt-2'>
                            {imagePreview ? (
                                <div className='relative inline-block'>
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className='max-w-xs max-h-48 rounded-md border-2 border-gray-200'
                                    />
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 cursor-pointer'
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <label className='flex items-center gap-2 px-4 py-2 bg-main-white border border-main-dark shadow-sm rounded-md cursor-pointer hover:bg-gray-200 w-fit'>
                                    <Upload size={16} />
                                    <span>Upload Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className='hidden'
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {errorMessages &&
                        <div className='flex flex-col gap-1 p-2'>
                            {listErrorMessages}
                        </div>}

                    <div className='mx-auto mt-18'>
                        {ticketResponse ?
                            <h5 className='text-accent-deepblue font-semibold'>Ticket Submitted Successfully!</h5> :
                            (ticketLoading || imageUploading) ?
                                <h5 className='flex gap-2 items-center'>
                                    <Loader2 className='text-accent-blue animate-spin' size={16} />
                                    {imageUploading ? 'Uploading image...' : 'Submitting your ticket'}
                                </h5> :
                                <Button text='Submit Your Ticket' onClick={handleSubmitTicket} />
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default CreateTicket;