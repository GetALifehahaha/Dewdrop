import React from 'react';
import { NavLink, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Pagination = ({maxPage}) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get("page")) || 1;

    const changePage = (change) => {
        if (change == "prev" && currentPage > 1) {

            if (currentPage == 1) {
                setSearchParams(null);
                return;
            }

            setSearchParams({page: currentPage-1})

        } else if (change == "next" && currentPage < maxPage) {
            setSearchParams({page: currentPage+1})
        }
    }

    const leftPage = (currentPage == 1) ? currentPage : ((currentPage == maxPage) ? currentPage - 2 : currentPage - 1);
    const middlePage = (currentPage == 1) ? currentPage + 1: (currentPage == maxPage) ? currentPage - 1 : currentPage;
    const rightPage = (currentPage == 1) ? currentPage + 2: (currentPage == maxPage) ? currentPage : currentPage + 1;

    const activePageNumber = (pageNumber) => (pageNumber == currentPage) ? 'bg-text text-main' : 'text-text/75 border-1 border-text/25'

    const listButtons = [leftPage, middlePage, rightPage].map((pageNumber, index) => <NavLink to={`/tickets/?page=${pageNumber}`} className={`w-6 h-6 flex items-center justify-center rounded-sm font-semibold ${activePageNumber(pageNumber)}`} key={index}>{pageNumber}</NavLink>)

    return (
        <div className='mx-auto mt-2 px-4 py-2 flex gap-4 items-center w-fit '>
            <button onClick={() => changePage("prev")} className='flex items-center gap-2 cursor-pointer px-4'><ArrowLeft width={16}/>Prev</button>
            {listButtons}
            <button onClick={() => changePage("next")} className='flex items-center gap-2 cursor-pointer px-4'>Next<ArrowRight width={16}/></button>
        </div>
    )
}

export default Pagination;