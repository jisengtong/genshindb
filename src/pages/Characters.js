import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import search from '../functions/search'

import Error from '../components/Error'
import Loading from '../components/Loading'
import LoadMore from '../components/LoadMore'
import active from '../functions/active'
import Container from '../components/Container'

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
    const [charData, setCharData] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchedChar, setSearched] = useState([])
    const [error, setError] = useState('')
    const [displayLimit, setDisplayLimit] = useState(30);
    const searchChar = useRef('')

    useEffect(() => {
        setLoading(true)
        getCharData()

        active("Characters", 'Characters')
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
                setError('Error loading Character Data. Try Again Later.')
            }
        )
        setLoading(false);
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error message={error} />
    }

    return (
        <div className='characters__container'>
            <Container
                title={'Game Characters'}
                searchInput={searchChar}
                searchInputHandler={() => search(charData, setSearched, searchChar.current.value)}
                searchPlaceholder={'Search for Character Name...'}
                gridData={
                    charData.length > 0 && searchedChar.length === 0 ?
                        <RenderChar arr={charData} limit={displayLimit} />
                        :
                        <RenderChar arr={searchedChar} limit={displayLimit} />
                }
            />
            {
                !searchedChar.length > 0 ?
                    charData.length > 0 && displayLimit < charData.length &&
                    <LoadMore onclick={() => setDisplayLimit(prev => prev + 30)} />
                    :
                    searchedChar.length > 0 && displayLimit < searchedChar.length &&
                    <LoadMore onclick={() => setDisplayLimit(prev => prev + 30)} />
            }
        </div>
    )
}

export default Character