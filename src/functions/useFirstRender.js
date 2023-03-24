import { useState, useEffect } from 'react'

const useFirstRender = () => {
    const [isFirst, setFirst] = useState(true)

    useEffect(() => {
        setFirst(false)
    }, [])

    return isFirst
}

export default useFirstRender