import React from 'react'

const Footer = () => {
    return (
        <footer className='my-10 darkblue p-6 shadow-2xl rounded-xl text-white'>
            <div className="flex justify-between flex-col md:flex-row gap-2">
                <p className="text-xl">
                    Creator: <a href="https://github.com/jisengtong" target="_blank" rel="noreferrer nofollower" style={{ textDecoration: 'underline' }}>Tong Ji Seng </a>
                </p>
                <p>Website updated to latest in game version: V 3.5</p>
            </div>
            <div className="disclaimer mt-4">
                <p>*Disclaimer: This is a fanmade website related to the Video Game: Genshin Impact.<br />Website is not affiliated with the game company: miHoYo/HoYoverse. </p>
            </div>
        </footer>
    )
}

export default Footer