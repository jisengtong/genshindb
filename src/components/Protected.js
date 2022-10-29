import React, { useState } from 'react'
import { Navigate } from 'react-router-dom'

const Protected = ({ children }) => {
    const [user, setUser] = useState(false)

    if (!user) return <Navigate to={'/Home'} replace={true} />
    return (children)
}

export default Protected