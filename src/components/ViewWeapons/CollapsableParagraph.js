import { useEffect, useState, useRef } from 'react'

const CollapsableParagraph = ({ texts }) => {
    const [toggle, setToggle] = useState(false)
    const [paraHeight, setHeight] = useState(0)
    const para = useRef()

    useEffect(() => {
        setHeight(para.current?.offsetHeight)
    }, [para])

    return (
        <div>
            <p ref={para} className={`${toggle ? '' : " max-h-[100px] overflow-hidden"} transition duration-300 mt-2`}>
                {texts}
            </p>
            {
                paraHeight >= 100 &&
                <button className='lightcolor underline font-bold' onClick={() => setToggle(!toggle)}>Show {toggle ? 'less' : 'more'}...</button>
            }
        </div>
    )
}

export default CollapsableParagraph