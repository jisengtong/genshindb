import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../images/genshinLogo.png'

const Header = () => {
    const links = ['Home', 'Characters', 'Weapons', 'Artifacts']
    const [displayTop, setDisplay] = useState(false)
    const [toggled, setToggle] = useState(false)

    useEffect(() => {
        window.addEventListener('scroll', () => {
            document.documentElement.scrollTop > 500 ? setDisplay(true) : setDisplay(false);
        })
    }, [])

    const handleToggle = () => {
        setToggle(prev => !prev)
    }

    return (
        <header className='sticky top-4 md:top-0 md:relative flex justify-between flex-col md:flex-row md:items-center gap-2 font-bold py-6 text-lg bg-[#282c36] shadow-2xl rounded-xl px-4 mt-4 mb-10 ' style={{ zIndex: '150' }}>
            <img src={Logo} alt="" className='max-w-[250px] w-full' />
            <button id="navToggler" className='absolute right-6 top-3 md:hidden lightcolor outline-none p-4' onClick={() => setToggle(!toggled)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            <nav className={`navigation overflow-hidden ${toggled ? 'max-h-[400px]' : 'max-h-[0px]'} md:max-h-full`}>
                <ul className='flex gap-6 flex-col md:flex-row items-center mt-6 md:mt-0 transition duration-300'>
                    {
                        links.map((val, key) => {
                            return (
                                <li key={key}>
                                    <Link to={val} id={val} className='navlink transition-all duration-300 text-[#6a91e9] opacity-40 hover:opacity-100 hover:tracking-widest' onClick={handleToggle}>{val}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>

            <button className={`fixed bottom-10 right-8 p-4 rounded-xl bg-[#282c36] lightcolor outline-none z-50 ${displayTop ? 'block' : 'hidden'}`}
                onClick={() => document.documentElement.scrollTop = 0}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
            </button>
        </header>
    )
}

export default Header