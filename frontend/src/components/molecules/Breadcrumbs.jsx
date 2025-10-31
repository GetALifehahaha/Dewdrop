import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = ({breadcrumb = [{Link: '/link'},]}) => {

    const listBreadcrumb = breadcrumb.map(({label, link}, index, array) => 
        <>
            <Link key={index} to={link}>{label}</Link>

            {(index + 1 < array.length) ? <ChevronRight size={16} /> : null}
        </>
    )

    return (
        <div className='flex flex-row gap-1 text-sm text-text/50 font-semibold items-center'>
            {listBreadcrumb}
        </div>
    )
}

export default Breadcrumbs;