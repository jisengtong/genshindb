import React, { useEffect, } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import { collection, query, orderBy, getDocs } from 'firebase/firestore'
import { useStates } from '../components/useStates'

import search from '../functions/search'
import sortData from '../functions/sortData'

import Error from '../components/Error'
import Loading from '../components/Loading'
import LoadMore from '../components/LoadMore'
import Container from '../components/Container'

const characterFilters = {
    element: ['Cryo', 'Hydro', 'Pyro', 'Geo', 'Dendro', 'Anemo', 'Electro'],
    rarity: [5, 4],
    weaponType: ['Sword', 'Polearm', 'Catalyst', 'Claymore', 'Bow']
}

const RenderChar = ({ arr, limit }) => {
    return (
        arr.slice(0, limit)
            .map((val, key) => {
                return (
                    <Link className={`group block rounded-xl bg-[#23252a] shadow-xl text-white relative grid__card`} to={`/ViewCharacter/${val.name}`}
                        key={key}
                        data-name={val.name}
                        title={val.name}>
                        {
                            val.element !== "N/A" &&
                            <div className="char__element absolute top-3 left-3 rounded-full p-1.5 bg-black bg-opacity-50 w-7 h-7 sm:w-8 sm:h-8 z-40">
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

const Character = () => {
    const [loading, setLoading, error, setError, data, setData,
        searchedData, setSearched, displayLimit, setDisplayLimit, isAsc, setToggleAsc,
        isFirstRender, searchKeyword] = useStates("Characters", "characters")

    useEffect(() => {
        getCharData()
    }, [])

    useEffect(() => {
        if (!isFirstRender) {
            searchedData.length > 0 && sortData(isAsc, searchedData, 'rarity', setSearched)
            sortData(isAsc, data, 'rarity', setData)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAsc])

    async function getCharData() {
        setLoading(true)
        const ref = collection(db, 'characters')
        const queryC = query(ref, orderBy('rarity', 'desc'), orderBy('name'))

        await getDocs(queryC).then(snapShot => {
            snapShot.forEach(char => {
                setData(prev => [...prev, char.data()]);
            })
        }).catch(() => setError('Error loading Character Data. Refresh webpage and try again.'))

        setLoading(false);
    }

    if (loading) return <Loading />
    if (error) return <Error message={error} />

    return (
        <div className='characters__container'>
            <Container
                title={'Game Characters'}
                searchInput={searchKeyword}
                searchInputHandler={() => search(data, setSearched, searchKeyword.current.value, setToggleAsc)}
                searchPlaceholder={'Search for Character Name...'}
                setSort={() => setToggleAsc(!isAsc)}
                order={isAsc}
                gridData={<RenderChar arr={data.length > 0 && searchedData.length === 0 ? data : searchedData} limit={displayLimit} />}
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
export default Character