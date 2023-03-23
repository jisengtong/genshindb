import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'
import { banners } from '../json/banner'
import active from '../functions/active'

// import { updateCharacters, updateWeapons, updateArtifacts } from '../functions/updateDb'

const Home = () => {
    useEffect(() => {
        // updateArtifacts('3.6')
        // updateCharacters('3.6')
        // updateWeapons('3.6')
        active("Home", 'Home')
    })

    return (
        <div className='home__container'>
            <div className="flex items-center gap-2 flex-wrap text-center justify-center sm:justify-start">
                <FontAwesomeIcon className='text-2xl lightcolor' icon={faHome} />
                <h1 className="page__title lightcolor text-4xl font-bold text-center sm:text-left group">
                    Home Page <span className="hidden group-hover:inline">#</span>
                </h1>
            </div>

            <div className='banners flex flex-col gap-8 mt-8 text-white text-2xl font-bold'>
                {
                    banners.map((val, key) => {
                        return (
                            !val.link ?
                                <Link to={`/${val.name}`} className={`rows relative block py-10 sm:py-14 px-6 rounded-xl group shadow-2xl animation ${val.animationClass && val.animationClass}`} key={key}
                                    style={{ background: `url(${val.bg})center center/cover no-repeat` }}>
                                    <div className="overlay absolute inset-0 h-full w-full bg-black bg-opacity-40 rounded-xl transition duration-300 group-hover:bg-opacity-20 z-40"
                                    ></div>

                                    <p className="relative z-50 flex items-center gap-2">
                                        <img src={val.icon} alt="" className="icon w-[60px]" />
                                        {val.name}
                                    </p>
                                </Link>
                                :
                                <a href={val.link} target="_blank" rel="noreferrer nofollower" className={`rows relative block py-10 sm:py-14 px-6 rounded-xl group shadow-2xl animation ${val.animationClass && val.animationClass}`} key={key}
                                    style={{ background: `url(${val.bg})center center/cover no-repeat` }}>
                                    <div className="overlay absolute inset-0 h-full w-full bg-black bg-opacity-40 rounded-xl transition duration-300 group-hover:bg-opacity-20 z-40"
                                    ></div>

                                    <p className="relative z-50 flex items-center gap-2">
                                        <img src={val.icon} alt="" className="icon w-[50px]" />
                                        {val.name}
                                    </p>
                                </a>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default Home