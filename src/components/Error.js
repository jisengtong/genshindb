import React from 'react'
import { Link } from 'react-router-dom'

const Default = ({ messages }) => {
    return (
        <p className='error__message mt-4'>
            {
                messages ?
                    messages
                    :
                    <>
                        <span className="block">There was an error when loading page.</span>
                        <span className="block">Please try again later.</span>
                    </>
            }
            <Link to="/Home" className="text-xl underline block mt-4">Return to Home Page</Link>
        </p>
    )
}
const Error = ({ message }) => {
    return (
        <div className='err__msg font-semibold text-center text-2xl lightcolor my-16'>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 block mx-auto" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
            </svg>
            {
                message ?
                    <Default messages={message} />
                    :
                    <Default />
            }
        </div >
    )
}

export default Error