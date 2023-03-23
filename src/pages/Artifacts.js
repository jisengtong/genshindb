import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import { collection, query, limit, onSnapshot } from 'firebase/firestore'
import search from '../functions/search'

import Loading from '../components/Loading'
import Error from '../components/Error'
import active from '../functions/active'
import LoadMore from '../components/LoadMore'
import Container from '../components/Container'

const RenderArtifacts = ({ arr, limit }) => {
    return (
        arr
            .slice(0, limit)
            .map((val, key) => {
                return (
                    <Link className={`group block rounded-xl bg-[#23252a] shadow-xl text-white relative`} to={`/ViewArtifacts/${val.name}`} key={key} data-name={val.name} title={val.name}>
                        <div className={`icon relative ${val.rarity.includes('5') ? 'bg-[#e1872280]' : 'bg-gray-600'} rounded-t-xl`}>
                            <div className="w-1/2 absolute inset-0 h-full bg-[#ae92d6] z-0 rounded-tl-xl">
                            </div>
                            <img src={val.images.flower ? val.images.flower : val.images.circlet} alt="" className='mx-auto rounded-t-xl relative z-30' />
                        </div>

                        <div className="artifact__name text-center py-3 px-1">
                            <p className='group-hover:text-[#6291e9] transition duration-300 text-ellipsis overflow-hidden'>{val.name}</p>
                        </div>
                    </Link>
                )
            })
    )
}

const Artifacts = () => {
    const [loading, setLoading] = useState(false)
    const [artifactData, setArtifact] = useState([])
    const [searchedArti, setSearched] = useState([])
    const [error, setError] = useState('')
    const [displayLimit, setDisplayLimit] = useState(30);
    const searchArti = useRef('')

    useEffect(() => {
        setLoading(true)
        getArtifacts()

        active('Artifacts', 'Artifacts')
    }, [])

    async function getArtifacts() {
        const artifactCollections = collection(db, 'artifacts')
        const artifactQuery = query((artifactCollections), limit(40));
        await onSnapshot(artifactQuery, (snapShot) => {
            let aData = [];
            if (snapShot) {
                snapShot.forEach(artifact => {
                    aData.push(artifact.data())
                })
            }
            setArtifact(aData.sort((a, b) => Number(b.rarity[0]) - Number(a.rarity[0])))
        }, () => {
            setError("Error loading Artifacts Data. Try again later.")
        })
        setLoading(false);
    }

    if (loading) {
        return <Loading />
    }

    if (error) {
        return <Error message={error} />
    }

    return (
        <div className='artifact__container'>
            <Container
                title={'Artifacts'}
                searchInput={searchArti}
                searchInputHandler={() => search(artifactData, setSearched, searchArti.current.value)}
                searchPlaceholder={'Search for Artifact Name...'}
                gridData={
                    artifactData && searchedArti.length === 0 ?
                        <RenderArtifacts arr={artifactData} limit={displayLimit} />
                        :
                        <RenderArtifacts arr={searchedArti} limit={displayLimit} />
                }
            />
            {
                !searchedArti.length > 0 ?
                    artifactData.length > 0 && displayLimit < artifactData.length &&
                    <LoadMore onclick={() => setDisplayLimit(prev => prev + 30)} />
                    :
                    searchedArti.length > 0 && displayLimit < searchedArti.length &&
                    <LoadMore onclick={() => setDisplayLimit(prev => prev + 30)} />
            }
        </div>
    )
}

export default Artifacts