import React, {useDebugValue, useState} from 'react'
import { Button, Dropdown, Title } from '../atoms'
import { X, Minus, Plus } from 'lucide-react'
import useDepartment from '../../hooks/useDepartment'
import useTicketType from '../../hooks/useTicketType'

const EditAgent = ({agentDetails, onClose, editAgent}) => {

	const [firstName, setFirstName] = useState(agentDetails.first_name);
	const [lastName, setLastName] = useState(agentDetails.last_name);
	const [email, setEmail] = useState(agentDetails.email);
	const [department, setDepartment] = useState({
		id: agentDetails.department.id,
		changed: false
	});
	const [specializations, setSpecializations] = useState(
		agentDetails.specializations.map(spec => ({
			id: spec.id,
			name: spec.name,
			changed: false
		}))
	);
	const [errorMessages, setErrorMessages] = useState([]);

	const {departmentData, departmentLoading, departmentError} = useDepartment();
	const {ticketTypeData, ticketTypeLoading, ticketTypeError} = useTicketType();

	const handleSetFirstName = (e) => setFirstName(e.target.value); 
    const handleSetLastName = (e) => setLastName(e.target.value); 
    const handleSetEmail = (e) => setEmail(e.target.value); 
    const handleSetDepartment = (value) => {
		setDepartment({
			id: value,
			changed: true
		});
	};

	const handleAddSpecialization = () => {
        setSpecializations(prev => [...prev, { id: null, name: null, changed: true }]);
    };

    const handleRemoveSpecialization = index => {
        setSpecializations(prev => prev.filter((_, i) => i !== index));
    };

    const handleSetSpecialization = (index, value) => {
        setSpecializations(prev => prev.map((spec, i) => 
			i === index 
				? { id: value, name: ticketTypeData.find(t => t.id === value)?.name, changed: true } 
				: spec
		));
    };

	const handleSubmit = () => {
		// Reset error messages
		setErrorMessages([]);

		// Validate fields
		if (!firstName) {
			setErrorMessages(er => [...er, "Please provide the first name of the agent"]);
		}
		if (!lastName) {
			setErrorMessages(er => [...er, "Please provide the last name of the agent."]);
		}
		if (!email) {
			setErrorMessages(er => [...er, "Please provide the email of the agent. This email will be used to receive notifications from the system"]);
		}
		if (!department.id) {
			setErrorMessages(er => [...er, "Please select the department of the agent."]);
		}
		if (specializations.length === 0) {
			setErrorMessages(er => [...er, "Please add at least one specialization."]);
		}
		if (specializations.some(spec => !spec.id)) {
			setErrorMessages(er => [...er, "All specializations must have a ticket type selected."]);
		}

		// If there are errors, don't proceed
		if (!firstName || !lastName || !email || !department.id || specializations.length === 0 || specializations.some(spec => !spec.id)) {
			return;
		}

		// Check if fields have changed
		let payload = {}
		if (firstName !== agentDetails.first_name) {
			payload.first_name = firstName;
		}
		if (lastName !== agentDetails.last_name) {
			payload.last_name = lastName;
		}
		if (email !== agentDetails.email) {
			payload.email = email;
		}
		if (department.changed) {
			payload.department_id = department.id;
		}

		// Check if specializations have changed
		const originalIds = agentDetails.specializations.map(s => s.id).sort();
		const currentIds = specializations.map(s => s.id).sort();
		const hasSpecializationsChanged = 
			originalIds.length !== currentIds.length || 
			originalIds.some((id, index) => id !== currentIds[index]) ||
			specializations.some(spec => spec.changed);

		if (hasSpecializationsChanged) {
			// Only include IDs of specializations, filter out any null values
			payload.specializations = specializations
				.filter(spec => spec.id !== null)
				.map(spec => spec.id);
		}

		console.log('Payload to send:', payload);
		// editAgent(payload); // Uncomment when ready to use
	};

	if (departmentLoading || ticketTypeLoading) {
		return (
			<p className='text-text'>Loading...</p>
		);
	}

	if (departmentError || ticketTypeError) {
		return (
			<p className='text-red-500'>Error loading data. Please try again.</p>
		);
	}

	const departmentSelections = departmentData?.map((type) => {return {name: type.name, value: type.id}}) || [];
    const ticketTypeSelections = ticketTypeData?.map((type) => {return {name: type.name, value: type.id}}) || [];

	const listErrorMessages = errorMessages.map((message, index) => <h5 key={index} className='text-sm text-red-400 font-medium flex items-center gap-2'><X size={14} />{message}</h5>)
	

	return (
		<div className='absolute w-full h-screen top-0 left-0 bg-black/20 backdrop-blur-xs flex justify-center items-center gap-2'>
			<div className='bg-main p-4 rounded-sm'>
				<div className='flex items-center justify-between'>
					<h5 className='text-text font-semibold'>Edit Agent Details</h5>
					<X size={18} className='text-text cursor-pointer' onClick={onClose}/>
				</div>

				<div className='mt-2 flex gap-2'>
					<input 
						type='text' 
						onChange={handleSetFirstName} 
						value={firstName} 
						className='p-2 rounded-md bg-main shadow-sm border border-main-dark'
						placeholder='First Name'
					/>
					<input 
						type='text' 
						onChange={handleSetLastName} 
						value={lastName} 
						className='p-2 rounded-md bg-main shadow-sm border border-main-dark'
						placeholder='Last Name'
					/>
				</div>
				<div className='mt-2 flex gap-2'>
					<input 
						type='email' 
						onChange={handleSetEmail} 
						value={email} 
						className='p-2 rounded-md bg-main shadow-sm border border-main-dark w-full'
						placeholder='Email'
					/>
				</div>
				<div className='my-3'>
					<Dropdown
						value={department.changed ? department.id : departmentSelections.find(dept => dept.id === department.id)?.name}
						selectName='Department'
						selectItems={departmentSelections}
						onSelect={handleSetDepartment}
					/>
				</div>

				{errorMessages.length > 0 && 
					<div className='flex flex-col gap-1 p-2'>
                        {listErrorMessages}
                    </div>
				}

				{specializations.map((spec, index) => (
					<div key={index} className='flex items-center gap-2 mb-2'>
						<Dropdown
							value={spec.changed ? spec.id : spec.name}
							selectName={`Ticket Type ${index + 1}`}
							selectItems={ticketTypeSelections}
							onSelect={value => handleSetSpecialization(index, value)}
						/>
						{specializations.length !== 1 &&
							<button 
								type='button' 
								onClick={() => handleRemoveSpecialization(index)}
								className='text-text hover:text-red-500'
							>
								<Minus size={16} />
							</button>
						}
						{index === specializations.length - 1 && 
							<button 
								type='button' 
								onClick={handleAddSpecialization}
								className='text-text hover:text-green-500'
							>
								<Plus size={16} />
							</button>
						}
					</div>
				))}

				<div className='mt-12 flex gap-2 justify-end'>
					<Button variant='outline' text='Cancel' onClick={onClose}/>
					<Button variant='block' text='Save Changes' onClick={handleSubmit}/>
				</div>
			</div>
		</div>
  	)
}

export default EditAgent