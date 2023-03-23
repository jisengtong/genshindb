import React from 'react'

const PageTitle = ({ title }) => {
    return (
        <h1 className="page__title lightcolor text-3xl sm:text-4xl font-bold text-center sm:text-left group">
            {title} <span className="hidden sm:group-hover:inline">#</span>
        </h1>
    )
}

export default PageTitle