import React from 'react'

const LoadMore = ({ onclick }) => {
    return (
        <button onClick={onclick} className='py-3 px-6 rounded-lg darkblue text-white mx-auto block transition duration-300 hover:bg-slate-900'>
            Load More
        </button>
    )
}

export default LoadMore