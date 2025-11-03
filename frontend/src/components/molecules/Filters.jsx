import React, {useEffect, useState} from 'react'
import { useSearchParams } from 'react-router-dom'
import { SeveritySelectionConfig } from '../../config/SeveritySelectionConfig';
import { X } from 'lucide-react';

const Filters = () => {
	const [searchParams, setSearchParams] = useSearchParams();
	const [filters, setFilters] = useState([]);

	useEffect(() => {
		const params = Array.from(searchParams.entries())
		.filter(([key]) => key !== 'page')
		.map(([key, value]) => ({key, value}));
		setFilters(params);
	}, [setSearchParams]);

	const handleRemoveParams = (key) => {
		const params = new URLSearchParams(searchParams);
		params.delete(key);
		setSearchParams(params);
	}

	const clearParams = () => setSearchParams({});

	const capitalize = (string) => string[0].toUpperCase() + string.slice(1)

	const listFilters = filters.map(({key, value}) => 
	<div key={key} className='flex items-center  gap-1 bg-main px-4 py-0.5 rounded-2xl'>
		<h5>{capitalize(key)}: </h5>
		<h5>{value}</h5>
		<X size={16} className='cursor-pointer' onClick={() => handleRemoveParams(key)}/>
	</div>)
	
	return (
		<div className='flex gap-4 items-center text-text/50 text-sm font-semibold'>
			{listFilters}

			{filters.length > 0 && <h5 className='cursor-pointer hover:text-text/75' onClick={clearParams}>Clear</h5>}
		</div>
	)
}

export default Filters