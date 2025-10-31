import React, {useState, useEffect} from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const Pagination = ({maxPage}) => {
    const [searchParams, setSearchParams] = useSearchParams();

    const currentPage = parseInt(searchParams.get("page")) || 1;
    const [pageNumbers, setPageNumbers] = useState([1]);

    const changePage = (change) => {
        setSearchParams((prev) => {
            const params = new URLSearchParams(prev);

            if (change === "prev" && currentPage > 1) {
                params.set("page", currentPage - 1);
            } else if (change === "next" && currentPage < maxPage) {
                params.set("page", currentPage + 1);
            } else if (Number.isInteger(change)) {
                params.set("page", change);
            }

            return params;
        })
    }

    useEffect(() => {
        const getPageNumbers = () => {
            if (maxPage <= 3) {
                setPageNumbers(() => {
                    const numbers = [];

                    for (let i = 1; i <= maxPage; i++) {
                        numbers.push(i);
                    }

                    return numbers;
                });

                return;
            }

            if (currentPage === 1) {
                setPageNumbers([1, 2, 3]);
            } else if (currentPage === maxPage) {
                setPageNumbers([maxPage-2, maxPage-1, maxPage]);
            } else {
                setPageNumbers([currentPage-1, currentPage, currentPage+1]);
            }
        }

        getPageNumbers();
    }, [maxPage, currentPage])
    
    const activePage = Number(searchParams.get('page')) || 1;

    const listPageNumbers = pageNumbers.map((pageNumber, index) => 
        <h5 
        key={index} 
        onClick={() => changePage(pageNumber)}
        className={
            `w-6 h-6 rounded-sm flex items-center justify-center ${(pageNumber === activePage) ? 'bg-text text-main' : 'bg-main text-text'}`
          }
        >
            {pageNumber}
        </h5>
    )

    return (
        <div className='mr-auto mt-2 px-4 py-2 flex gap-4 items-center w-fit text-text font-medium'>

            {(maxPage > 1) && <>
                <button onClick={() => changePage("prev")} className='flex items-center gap-2 cursor-pointer px-4 bg-main rounded-sm'><ArrowLeft width={16}/>Prev</button>
                <div className='flex gap-2'>
                    {listPageNumbers}
                </div>
                <button onClick={() => changePage("next")} className='flex items-center gap-2 cursor-pointer px-4 bg-main rounded-sm'>Next<ArrowRight width={16}/></button>
            </>}
        </div>
    )
}

export default Pagination;