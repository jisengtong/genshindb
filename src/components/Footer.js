import React from 'react'

const Footer = () => {
    return (
        <footer className='my-10 darkblue p-6 shadow-2xl rounded-xl text-white'>
            <div className="flex justify-between flex-col md:flex-row gap-2">
                <p className="text-xl flex items-center gap-2">
                    Creator: <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-github" viewBox="0 0 16 16">
                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg> <a href="https://github.com/jisengtong" target="_blank" rel="noreferrer nofollower" style={{ textDecoration: 'underline' }}>Tong Ji Seng </a>
                </p>
                <p>Website datas updated to latest in game version: 3.5</p>
            </div>
            <div className="disclaimer mt-4">
                <p>*Disclaimer: This is a fanmade website related to the Video Game: Genshin Impact.<br />Website is not affiliated with the game company: miHoYo/HoYoverse. </p>
            </div>
            <div className="development__tools mt-4">
                <p>
                    Created Using:
                </p>
                <div className="flex gap-3 items-center flex-wrap pt-3">
                    <a href="https://react.dev/" target="_blank" rel="noreferrer nofollower">
                        <svg width="100%" height="100%" viewBox="-10.5 -9.45 21 18.9" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ color: 'rgb(20 158 202)' }} className="text-sm mr-0 w-10 h-10 flex origin-center transition-all ease-in-out"><circle cx="0" cy="0" r="2" fill="currentColor"></circle><g stroke="currentColor" strokeWidth="1" fill="none"><ellipse rx="10" ry="4.5"></ellipse><ellipse rx="10" ry="4.5" transform="rotate(60)"></ellipse><ellipse rx="10" ry="4.5" transform="rotate(120)"></ellipse></g></svg>
                    </a>
                    <a href="https://firebase.google.com/" target="_blank" rel="noreferrer nofollower">
                        <img src="https://www.gstatic.com/mobilesdk/160503_mobilesdk/logo/2x/firebase_28dp.png" alt="firebase_icon" className="w-9 h-9" />
                    </a>
                    <a href="https://tailwindcss.com/" target="_blank" rel="noreferrer nofollower">
                        <svg viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-9 w-9">
                            <path d="M489.5 226.499c-161.5 5.133-209.5 120.5-220.5 183 14.333-23.167 59.5-73.999 126-73.999 77.5 0 136.5 86.5 172.5 113.5 43.737 32.803 131.623 76.115 247 41 92-28 134.667-125.668 144-172.001-44.5 60.5-112 96.839-195.5 54-57.5-29.5-100.5-150.999-273.5-145.5zM261 500.999c-161.5 5.133-209.5 120.5-220.5 183C54.833 660.832 100 610 166.5 610 244 610 303 696.5 339 723.5c43.737 32.803 131.623 76.115 247 41 92-28 134.667-125.668 144-172.001-44.5 60.5-112 96.839-195.5 54C477 616.999 434 495.5 261 500.999z" fill="#07B6D5"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </footer>
    )
}

export default Footer