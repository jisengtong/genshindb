import React from 'react'

const Loading = () => {
    return (
        <div className='text-center text-3xl text-[#6a91e9] font-bold my-16'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
            </svg>
            Loading...
        </div>
    )
}

export default Loading