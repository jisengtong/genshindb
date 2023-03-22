import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import Error from './Error'
import Loading from './Loading'
import active from '../functions/active'
import LoadMore from './LoadMore'

const RenderWeapon = ({ arr, limit }) => {
    return (
        arr
            .slice(0, limit)
            .map((val, key) => {
                return (
                    <Link className={`group block rounded-xl bg-[#23252a] shadow-xl text-white relative`} to={`/ViewWeapons/${val.name}`} key={key} data-name={val.name} title={val.name}>
                        <div className="weap_rarity absolute top-3 left-3 rounded-full p-1.5 bg-black/50 w-7 h-7 sm:w-8 sm:h-8 z-50 flex items-center justify-center">
                            {val.rarity}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>

                        <div className={`icon relative ${val.rarity >= "4" ? val.rarity === "5" ? 'bg-[#e1872280]' : 'bg-[#ae92d680]' : 'bg-gray-600'} rounded-t-xl`}>
                            <img src={val.images.icon} alt="" className='mx-auto rounded-t-xl' />
                        </div>
                        <div className="characters__name text-center py-3 px-1">
                            <p className='group-hover:text-[#6291e9] transition duration-300 text-ellipsis overflow-hidden'>{val.name}</p>
                        </div>
                    </Link>
                )
            })
    )
}

const Weapons = () => {
    const [loading, setLoading] = useState(false);
    const [weaponData, setWeaponData] = useState([]);
    const [searchedWeap, setSearched] = useState([]);
    const [error, setError] = useState('');
    const [displayLimit, setDisplayLimit] = useState(30);
    const searchWeap = useRef('');

    useEffect(() => {
        setLoading(true);
        document.title = "Genshin Impact Database - Weapons";
        getWeaponData();

        active('Weapons')
    }, [])

    async function getWeaponData() {
        const weaponRef = collection(db, 'weapons');
        const queryW = query(weaponRef, orderBy('rarity', 'desc'), orderBy('name'))
        await onSnapshot(queryW, (snapShot) => {
            snapShot.forEach(weapon => {
                setWeaponData(prev => [...prev, weapon.data()])
            })
        }, () => setError('Error loading Weapons Data. Try again later.'))

        setLoading(false)
    }

    function searchWeapon() {
        setSearched([])
        let query = searchWeap.current.value.toLowerCase()
        if (query === "") return

        setSearched(weaponData.filter(data => data.name.toLowerCase().indexOf(query) !== -1))
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error message={error} />
    }

    return (
        <div className='weapons__container'>
            <div className="flex justify-between flex-col md:flex-row md:items-center gap-4 mt-4 relative">
                <h1 className="page__title lightcolor text-4xl font-bold text-center sm:text-left group">
                    Weapons <span className="hidden group-hover:inline">#</span>
                </h1>
                <div className="search__box relative w-full max-w-[350px]">
                    <input type="search"
                        name="searchWeapon"
                        id="searchWeapon"
                        className='bg-[#23252a] py-3 pl-12 inline-block w-full mt-4 rounded-xl outline-none focus:outline-2 focus:outline-slate-600 text-white'
                        placeholder='Search for Weapon Name...'
                        ref={searchWeap}
                        onChange={searchWeapon}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/80 absolute top-7 left-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-4 py-8">
                {
                    weaponData && searchedWeap.length === 0 ?
                        <RenderWeapon arr={weaponData} limit={displayLimit} />
                        :
                        <RenderWeapon arr={searchedWeap} limit={displayLimit} />
                }
            </div>
            {
                weaponData.length > 0 && displayLimit < weaponData.length &&
                <LoadMore onclick={() => setDisplayLimit(prev => prev + 30)} />
            }
        </div>
    )
}

export default Weapons