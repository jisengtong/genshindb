import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import Error from './Error'
import Loading from './Loading'
import LoadMore from './LoadMore'
import active from '../functions/active'

const RenderChar = ({ arr, limit }) => {
    return (
        arr
            .slice(0, limit)
            .map((val, key) => {
                return (
                    <Link className={`group block rounded-xl bg-[#23252a] shadow-xl text-white relative`} to={`/ViewCharacter/${val.name}`}
                        key={key}
                        data-name={val.name}
                        title={val.name}>
                        {
                            val.element !== "N/A" &&
                            <div className="char__element absolute top-3 left-3 rounded-full p-1.5 bg-black bg-opacity-50 w-7 h-7 sm:w-8 sm:h-8 z-50">
                                <img src={`https://firebasestorage.googleapis.com/v0/b/project1-82261.appspot.com/o/elements%2F${val.element}.png?alt=media&token=4c613456-ba83-4f79-9844-68bba9917c6d`} alt="" className="rounded-full" />
                            </div>
                        }
                        <div className={`icon relative ${val.rarity === "5" ? 'bg-[#e1872280]' : 'bg-[#ae92d680]'} rounded-t-xl`}>
                            <img src={val.images.icon} alt={val.name + ' avatar'} className='mx-auto rounded-t-xl' />
                        </div>
                        <div className="characters__name text-center py-3 px-1">
                            <p className='group-hover:text-[#6291e9] transition duration-300 text-ellipsis overflow-hidden'>{val.name}</p>
                        </div>
                    </Link>
                )
            })
    )
}

const Home = () => {
    const [charData, setCharData] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchedChar, setSearched] = useState([])
    const [limit, setLimit] = useState(30);
    const searchChar = useRef('')
    const [err, setErr] = useState('')

    useEffect(() => {
        setLoading(true)

        document.title = "Genshin Impact Database - Characters"
        getCharData()

        active('Characters')
    }, [])

    async function getCharData() {
        const ref = collection(db, 'characters')
        const queryC = query(ref, orderBy('rarity', 'desc'), orderBy('name'))

        await onSnapshot(queryC, (snapShot) => {
            snapShot.forEach(char => {
                setCharData(prev => [...prev, char.data()]);
            })
        },
            () => {
                setErr('Error loading Character Data. Try Again Later.')
            }
        )
        setLoading(false)
    }

    function searchCharacter() {
        setSearched([])
        let query = searchChar.current.value.toLowerCase()

        setSearched(charData.filter(data => data.name.toLowerCase().includes(query)))
    }

    if (loading) {
        return <Loading />
    }

    if (err) {
        return <Error message={err} />
    }

    return (
        <div className='characters__container'>
            <div className="flex justify-between flex-col md:flex-row md:items-center gap-4 mt-4 relative">
                <h1 className="page__title lightcolor text-4xl font-bold text-center sm:text-left group">
                    Game Characters <span className="hidden group-hover:inline">#</span>
                </h1>
                <div className="search__box relative w-full max-w-[350px]">
                    <input type="search"
                        name="searchCharacter"
                        id="searchCharacter"
                        className='bg-[#23252a] py-3 pl-12 inline-block w-full mt-4 rounded-xl outline-none focus:outline-2 focus:outline-slate-600 text-white'
                        placeholder='Search for Character Name...'
                        ref={searchChar}
                        onChange={searchCharacter}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/80 absolute top-7 left-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-4 py-8">
                {
                    charData.length > 0 && searchedChar.length === 0 ?
                        <RenderChar arr={charData} limit={limit} />
                        :
                        <RenderChar arr={searchedChar} limit={limit} />
                }
            </div>
            {
                charData.length > 0 && limit < charData.length &&
                <LoadMore onclick={() => setLimit(prev => prev + 30)} />
            }
        </div>
    )
}

export default Home