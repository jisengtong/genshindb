import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { db } from '../firebase'
import { collection, query, limit, onSnapshot } from 'firebase/firestore'
import Loading from './Loading'
import Error from './Error'
import active from '../functions/active'

const RenderArtifacts = ({ arr }) => {
    return (
        arr.map((val, key) => {
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
    const searchArti = useRef('')
    const [err, setErr] = useState('')

    useEffect(() => {
        setLoading(true)
        document.title = "Genshin Impact Database - Artifacts"

        getArtifacts()
        active('Artifacts')
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
            setErr("Error loading Artifacts Data. Try again later.")
        })

        setLoading(false);
    }

    function searchArtifacts() {
        setSearched([])
        let query = searchArti.current.value.toLowerCase();
        if (query === "") return;

        setSearched(artifactData.filter(data => data.name.toLowerCase().indexOf(query) !== -1));
    }

    if (loading) {
        return <Loading />
    }

    if (err) {
        return <Error message={err} />
    }

    return (
        <div className='artifact__container'>
            <div className="flex justify-between flex-col md:flex-row md:items-center gap-4 mt-4 relative">
                <h1 className="page__title lightcolor text-4xl font-bold text-center sm:text-left group">
                    Artifacts <span className="hidden group-hover:inline">#</span>
                </h1>
                <div className="search__box relative w-full max-w-[350px]">
                    <input type="search"
                        name="searchArtifacts"
                        id="searchArtifacts"
                        className='bg-[#23252a] py-3 pl-12 inline-block w-full mt-4 rounded-xl outline-none focus:outline-2 focus:outline-slate-600 text-white'
                        placeholder='Search for Artifact Name...'
                        ref={searchArti}
                        onChange={searchArtifacts}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/80 absolute top-7 left-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-4 py-8">
                {
                    artifactData && searchedArti.length === 0 ?
                        <RenderArtifacts arr={artifactData} />
                        :
                        <RenderArtifacts arr={searchedArti} />

                }
            </div>
        </div>
    )
}

export default Artifacts