import React, {useState} from 'react'

const Header = ({title="Dewdrop", name="User", onClick}) => {

	const [isDropdownOpen, setIsDropdownOpen] = useState(false);

	const handleSetDropdown = () => {
		onClick();
		setIsDropdownOpen(!isDropdownOpen);
	}

  	return (
		<div className='w-full px-6 py-2 flex justify-between items-center bg-main'>
			<h1 className='text-accent-blue font-semibold tracking-tight text-lg'>
				{title}
			</h1>

			<div className="flex items-center gap-8">
				<div className='content-[""] aspect-square rounded-full bg-accent-blue w-5 cursor-pointer' onClick={handleSetDropdown}></div>
				<h5 className='text-accent-deepblue'>
					{name}
				</h5>
			</div>
		</div>
	)
}

export default Header

