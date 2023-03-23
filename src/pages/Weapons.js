import React, { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import Error from '../components/Error'
import Loading from '../components/Loading'
import active from '../functions/active'
import LoadMore from '../components/LoadMore'
import Container from '../components/Container'

const RenderWeapon = ({ arr, limit }) => {
    return (
        arr
            .slice(0, limit)
            .map((val, key) => {
                return (
                    <Link className={`group rounded-xl bg-[#23252a] shadow-xl text-white relative flex flex-col`} to={`/ViewWeapons/${val.name}`} key={key} data-name={val.name} title={val.name}>
                        <div className="weap_rarity absolute top-3 left-3 rounded-full p-1.5 bg-black/50 w-7 h-7 sm:w-8 sm:h-8 z-40 flex items-center justify-center">
                            {val.rarity}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>

                        <div className={`icon relative ${val.rarity >= "4" ? val.rarity === "5" ? 'bg-[#e1872280]' : 'bg-[#ae92d680]' : 'bg-gray-600'} rounded-t-xl ${!val.images.icon && 'flex-grow'}`}>
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
        getWeaponData();

        active("Weapons", 'Weapons')
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
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        })
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
            <Container
                title={'Weapons'}
                searchInput={searchWeap}
                searchInputHandler={searchWeapon}
                searchPlaceholder={'Search for Weapon Name...'}
                gridData={
                    weaponData && searchedWeap.length === 0 ?
                        <RenderWeapon arr={weaponData} limit={displayLimit} />
                        :
                        <RenderWeapon arr={searchedWeap} limit={displayLimit} />
                }
            />
            {
                weaponData.length > 0 && displayLimit < weaponData.length &&
                <LoadMore onclick={() => setDisplayLimit(prev => prev + 30)} />
            }
        </div>
    )
}

export default Weapons