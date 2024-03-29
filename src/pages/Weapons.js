import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { useStates } from '../components/useStates'

import search from '../functions/search'
import sortData from '../functions/sortData'

import Error from '../components/General/Error'
import Loading from '../components/General/Loading'
import LoadMore from '../components/General/LoadMore'
import Container from '../components/Container'

const RenderWeapon = ({ arr, limit }) => {
    return (
        arr.slice(0, limit)
            .map((val, key) => {
                return (
                    <Link className={`group rounded-xl bg-[#23252a] shadow-xl text-white relative flex flex-col grid__card`} to={`/Weapons/${val.name}`} key={key} data-name={val.name} title={val.name}>
                        <div className="weap_rarity absolute top-3 left-3 rounded-full p-1.5 bg-black/50 w-7 h-7 sm:w-8 sm:h-8 z-40 flex items-center justify-center">
                            {val.rarity}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                        </div>

                        <div className={`flex-grow icon relative ${val.rarity >= "4" ? val.rarity === "5" ? 'bg-[#e1872280]' : 'bg-[#ae92d680]' : 'bg-gray-600'} rounded-t-xl ${!val.images.icon && 'flex-grow'}`}>
                            <img src={val.images.icon} alt={val.name} className='mx-auto rounded-t-xl' />
                        </div>
                        <div className="characters__name text-center py-3 px-1">
                            <p className='group-hover:text-[#6291e9] transition duration-300 line-clamp-1'>{val.name}</p>
                        </div>
                    </Link>
                )
            })
    )
}

const Weapons = () => {
    const [loading, setLoading, error, setError, data, setData,
        searchedData, setSearched, displayLimit, setDisplayLimit, isAsc, setToggleAsc,
        isFirstRender, searchKeyword] = useStates("Weapons", "weapons")

    useEffect(() => {
        getWeaponData()
    }, [])

    useEffect(() => {
        if (!isFirstRender) {
            searchedData.length > 0 && sortData(isAsc, searchedData, 'rarity', setSearched)
            sortData(isAsc, data, 'rarity', setData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAsc])

    async function getWeaponData() {
        setLoading(true)
        const weaponRef = collection(db, 'weapons')
        const queryW = query(weaponRef, orderBy('rarity', 'desc'), orderBy('name'))

        await getDocs(queryW).then(snapShot => {
            let weapons = []
            snapShot.forEach(weapon => {
                weapons.push(weapon.data())
            })
            setData(weapons)
        }).catch(() => setError('Error loading Weapons Data. Try again later.'))

        setLoading(false)
    }

    if (loading) return <Loading />
    if (error) return <Error message={error} />

    return (
        <div className='weapons__container'>
            <Container
                title={'Weapons'}
                searchInput={searchKeyword}
                searchInputHandler={() => search(data, setSearched, searchKeyword.current.value, setToggleAsc)}
                searchPlaceholder={'Search for Weapon Name...'}
                setSort={() => setToggleAsc(!isAsc)}
                order={isAsc}
                gridData={<RenderWeapon arr={data.length > 0 && searchedData.length === 0 ? data : searchedData} limit={displayLimit} />}
            />
            {
                !searchedData.length > 0 ?
                    data.length > 0 && displayLimit < data.length &&
                    <LoadMore onclick={setDisplayLimit} />
                    :
                    searchedData.length > 0 && displayLimit < searchedData.length &&
                    <LoadMore onclick={setDisplayLimit} />
            }
        </div>
    )
}

export default Weapons