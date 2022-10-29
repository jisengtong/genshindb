import React from 'react'

const LoadMore = ({ onclick }) => {
    return (
        <button onClick={onclick} className='py-3 px-6 rounded-lg bg-[#282C36] text-white mx-auto block'>
            Load More
        </button>
    )
}

export default LoadMore