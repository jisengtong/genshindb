import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import { collection, query, limit, getDocs } from 'firebase/firestore'
import { useStates } from '../components/useStates'

import search from '../functions/search'

import Loading from '../components/Loading'
import Error from '../components/Error'
import LoadMore from '../components/LoadMore'
import Container from '../components/Container'

const RenderArtifacts = ({ arr, limit }) => {
    return (
        arr.slice(0, limit)
            .map((val, key) => {
                return (
                    <Link className={`group block rounded-xl bg-[#23252a] shadow-xl text-white relative grid__card`} to={`/ViewArtifacts/${val.name}`} key={key} data-name={val.name} title={val.name}>
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
    const [loading, setLoading, error, setError, data, setData,
        searchedData, setSearched, displayLimit, setDisplayLimit, isAsc, setToggleAsc,
        isFirstRender, searchKeyword] = useStates("Artifacts", "artifacts")

    useEffect(() => {
        getArtifacts()
    }, [])

    useEffect(() => {
        if (!isFirstRender) {
            sortArtifacts()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAsc])

    async function getArtifacts() {
        setLoading(true)
        const artifactCollections = collection(db, 'artifacts')
        const artifactQuery = query((artifactCollections), limit(40));

        await getDocs(artifactQuery).then(snapShot => {
            let aData = [];
            snapShot.forEach(artifact => {
                aData.push(artifact.data())
            })
            setData(aData.sort((a, b) => Number(b.rarity[0]) - Number(a.rarity[0])))
        }).catch(() => setError("Error loading Artifacts Data. Try again later."))

        setLoading(false);
    }

    function sortArtifacts() {
        let sorted = []
        let copiedData = searchedData.length > 0 ? searchedData : data

        if (isAsc) {
            sorted = copiedData.sort((a, b) => Number(a.rarity[0]) > Number(b.rarity[0]) ? -1 : 1)
        }
        if (!isAsc) {
            sorted = copiedData.sort((a, b) => Number(a.rarity[0]) < Number(b.rarity[0]) ? -1 : 1)
        }

        searchedData.length > 0 && setSearched(sorted.map(artifact => artifact))
        setData(sorted.map(artifact => artifact))
    }

    if (loading) return <Loading />
    if (error) return <Error message={error} />

    return (
        <div className='artifact__container'>
            <Container
                title={'Artifacts'}
                searchInput={searchKeyword}
                searchInputHandler={() => search(data, setSearched, searchKeyword.current.value, setToggleAsc)}
                searchPlaceholder={'Search for Artifact Name...'}
                setSort={() => setToggleAsc(!isAsc)}
                order={isAsc}
                gridData={<RenderArtifacts arr={data.length > 0 && searchedData.length === 0 ? data : searchedData} limit={displayLimit} />}
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

export default Artifacts