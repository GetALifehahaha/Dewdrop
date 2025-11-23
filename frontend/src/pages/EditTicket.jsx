import React, {useState, useEffect} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Label, Title, Dropdown, Button } from '../components/atoms';
import { Breadcrumbs, Toast } from '../components/molecules';
import { Pen, X, Check, ArrowLeft, Upload, Loader2  } from 'lucide-react';
import useTicket from '../hooks/useTicket';
import useTicketType from '../hooks/useTicketType';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '../services/constants';

const EditTicket = ({}) => {
    const {ticket_id} = useParams();
    const {ticketData, ticketError, ticketLoading, ticketResponse, patchTicket} = useTicket();
    const {ticketTypeData, ticketTypeError, ticketTypeLoading} = useTicketType(); 
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState(null);
    const [displayType, setDisplayType] = useState(null);
    const [ticketType, setTicketType] = useState(null);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);
    const [imageRemoved, setImageRemoved] = useState();
    const [errorMessages, setErrorMessages] = useState([]);
    const [toastMessages, setToastMessages] = useState([]);

    useEffect(() => {
        if (ticketData){
            setTitle(ticketData.title);
            setDescription(ticketData.description);
            setSeverity(ticketData.severity)
            setDisplayType(ticketData.ticket_type_details?.name)
            setImage(ticketData.image)
            setImagePreview(ticketData.image)

        }
    }, [ticketData]);

    useEffect(() => {
        if (ticketResponse) {
            setToastMessages([{
                message: ticketResponse.detail,
                status: ticketResponse.status,
                icon: Check
            }])
        }
        if (ticketError) {
            setToastMessages([{
                message: ticketError.detail,
                status: ticketError.status,
                icon: X
            }])
        }
    }, [ticketResponse, ticketError]);

    useEffect(() => {
        if (toastMessages.length > 0) {
            const timer = setTimeout(() => setToastMessages([]), 3000);
            return () => clearTimeout(timer);
        }
    }, [toastMessages])

    if (ticketLoading) return <p>Loading</p>
    if (ticketError) return <p>Error</p>  
    if (ticketTypeLoading) return <p>Loading</p>
    if (ticketTypeError) return <p>Error</p>  
    
    const handleSetTitle = (value) => setTitle(value);
    const handleSetDescription = (value) => setDescription(value);
    const handleSetSeverity = (value) => setSeverity(value);
    const handleSetTicketType = (value) => setTicketType(value);
    
    const listErrorMessages = errorMessages.map((message, index) => <h5 key={index} className='text-sm text-red-400 font-medium flex items-center gap-2'><X size={14} />{message}</h5>)

    const breadcrumb = [
        {label: "Tickets", link: '/tickets'},
        {label: ticket_id, link: `/tickets/${ticket_id}`},
        {label: "Edit", link: `/tickets/${ticket_id}/edit`}
    ]

    const severitySelections = [
        {name: "Low", value: "low"},
        {name: "Medium", value: "medium"},
        {name: "Urgent", value: "urgent"},
    ]
    
    const ticketTypeSelections = ticketTypeData.map((type) => {return {name: type.name, value: type.id}})

    const handleImageChange = (e) => {
        setImageRemoved(false);
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
        setImageRemoved(true);
        setImage(null);
        setImagePreview(null);
    };

    const handleSubmitTicket = async () => {
        setErrorMessages([]);

        if (!title) setErrorMessages(er => [...er, "You cannot remove the title of your ticket"]);
        if (!description) setErrorMessages(er => [...er, "You cannot remove the description of your ticket."])
        if (!severity) setErrorMessages(er => [...er, "You cannot remove the severity of your ticket."]);

        if (title && description && severity) {
            let params = {};

            if (title != ticketData.title) params = {title: title};
            if (description != ticketData.description) params = {...params, description: description};
            if (severity != ticketData.severity) params = {...params, severity: severity};
            if (ticketType) params = {...params, ticket_type: ticketType};

            let imageUrl = null;

            if (imageRemoved && ticketData.image) {
                params = {...params, image: null};
            }
            else if (image && typeof image !== 'string') {
                setImageUploading(true);
                try {
                    imageUrl = await uploadToCloudinary(image);
                    params = {...params, image: imageUrl}
                } catch (error) {
                    setErrorMessages(prev => [...prev, "Failed to upload image. Please try again."]);
                    setImageUploading(false);
                    return;
                }
                setImageUploading(false);

            }

            if (params) await patchTicket(ticketData.id, params);
        }
    }

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

    return (
        <>
            <Toast toastMessages={toastMessages} />
            <div className="flex flex-col gap-1">
                <div className='flex gap-2 items-center'>
                    <ArrowLeft className='text-text/75 cursor-pointer' size={18} />
                    <Title text='Details' />
                </div>
                <Breadcrumbs breadcrumb={breadcrumb}/>
            </div>

            <div className='p-4 bg-main rounded-md shadow-sm'>
                <Title variant='blockTitle' text='Ticket Information' icon={Pen}/>
                <div className='flex flex-col'>
                    <div className="flex gap-2">
                        <div className='p-2 flex flex-col'>
                            <Label text='Title' required={true}/>
                            <input 
                            value={title} 
                            type='text' 
                            onChange={(e) => handleSetTitle(e.target.value)} 
                            size={40} 
                            className='px-6 py-2 rounded-md bg-main w-fit shadow-sm focus:shadow-md outline-none focus:outline-none'/> 
                        </div>
                        <div className='p-2'>
                            <Label text='Severity' required={true}/>
                            <Dropdown value={severity} selectName="Severity" selectItems={severitySelections} onSelect={handleSetSeverity}/>
                        </div>
                        <div className='p-2'>
                            <Label text='Type' required={true}/>
                            <Dropdown value={ticketType || displayType} selectName="Type" selectItems={ticketTypeSelections} onSelect={handleSetTicketType}/>
                        </div>
                    </div>
                    <div className='p-2 flex flex-col'>
                        <Label text='Description' type='textbox' required={true}/>
                        <textarea 
                            value={description} 
                            onChange={(e) => handleSetDescription(e.target.value)} 
                            rows={8}
                            className='px-6 py-2 rounded-md bg-main w-full shadow-sm focus:shadow-md outline-none focus:outline-none'>
                        </textarea> 
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
                        <h5 className='text-accent-deepblue font-semibold'>Ticket Edited Successfully!</h5> :
                            (ticketLoading || imageUploading) ? 
                            <h5 className='flex gap-2 items-center'>
                                <Loader2 className='text-accent-blue animate-spin' size={16}/>
                                {imageUploading ? 'Uploading image...' : 'Submitting your ticket'}
                            </h5> :
                            <Button text='Save Changes' onClick={handleSubmitTicket}/>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default EditTicket