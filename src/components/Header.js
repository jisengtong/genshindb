import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from '../images/genshinLogo.png'

const links = [{
    link: "Home",
    id: "home",
    header: "Home"
}, {
    link: "Characters",
    id: "characters",
    header: "Characters"
}, {
    link: "Weapons",
    id: "weapons",
    header: "Weapons"
}, {
    link: "Artifacts",
    id: "artifacts",
    header: "Artifacts"
}, {
    link: "Banners",
    id: "banners",
    header: "Banners"
}]

const Header = () => {
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
        <header className='sticky top-0 flex justify-between flex-col md:flex-row md:items-center gap-2 font-bold py-6 text-lg darkblue shadow-2xl shadow-black/40 rounded-xl px-4 mt-4 mb-10 ' style={{ zIndex: '150' }}>
            <img src={Logo} alt="web_logo" className='max-w-[200px] w-full' />
            <button id="navToggler" className='absolute right-6 top-2 md:hidden lightcolor outline-none p-4' onClick={() => setToggle(!toggled)}>
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
                                    <Link to={val.link} id={val.id} className='navlink transition-all duration-300 text-[#6a91e9] opacity-40 hover:opacity-100 hover:tracking-widest' onClick={handleToggle}>{val.header}</Link>
                                </li>
                            )
                        })
                    }
                </ul>
            </nav>

            <button className={`fixed bottom-10 right-8 p-4 rounded-xl darkblue lightcolor outline-none z-50 ${displayTop ? 'block' : 'hidden'}`}
                onClick={() => document.documentElement.scrollTop = 0}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                </svg>
            </button>
        </header>
    )
}

export default Header