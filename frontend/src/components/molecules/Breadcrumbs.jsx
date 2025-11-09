import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({breadcrumb = [{Link: '/link'},]}) => {

    const listBreadcrumb = breadcrumb.map(({label, link}, index, array) => 
        <div key={index} className='flex flex-row items-center gap-2'>
            <Link  to={link} className='hover:text-text'>{label}</Link>

            {(index + 1 < array.length) ? <ChevronRight size={16} /> : null}
        </div>
    )

    return (
        <div className='flex flex-row gap-1 text-sm text-text/50 font-semibold items-center'>
            {listBreadcrumb}
        </div>
    )
}

export default Breadcrumbs;