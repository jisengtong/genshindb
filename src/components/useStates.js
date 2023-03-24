import { useState,useRef,useEffect } from "react"
import active from '../functions/active'
import useFirstRender from "../functions/useFirstRender"

export const useStates = (docTitle,activeHeader) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [data, setData] = useState([])
    const [searchedData, setSearched] = useState([])
    const [displayLimit, setDisplayLimit] = useState(30);
    const [isAsc, setToggleAsc] = useState(true)

    const isFirstRender = useFirstRender()
    const searchKeyword = useRef('')

    useEffect(() => {
        active(docTitle, activeHeader)
    }, [])
    

    return [loading, setLoading, error, setError, data, setData,
        searchedData, setSearched, displayLimit, () => setDisplayLimit(prev => prev + 30),
        isAsc, () => setToggleAsc(!isAsc), isFirstRender, searchKeyword]
        
}