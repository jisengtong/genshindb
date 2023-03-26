import React, { useEffect, useState } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { getDoc, doc } from "firebase/firestore"
import { getDownloadURL, ref } from 'firebase/storage'
import { db, storage } from '../firebase'
import Loading from '../components/General/Loading'
import active from '../functions/active'

const ViewCharacter = () => {
    const { name } = useParams()
    const [charName, setName] = useState('')
    const [charData, setData] = useState()
    const [cons, setCons] = useState([])
    const [charElement, setElement] = useState('')
    const [loading, setLoading] = useState(false)
    const nav = useNavigate()

    useEffect(() => {
        name !== undefined ?
            getChar(name)
            :
            nav('/Error', { replace: true });
        setName(name);

        active(`${name}`, 'characters');
    }, [])

    async function getChar(character) {
        setData()
        setLoading(true)

        const charRef = doc(db, 'characters', character)
        await getDoc(charRef).then(async x => {
            if (x.exists()) {
                setData(x.data())
                await getDownloadURL(ref(storage, `elements/${x.data().element}.png`))
                    .then(url => {
                        setElement(url);
                    })

                let cons = []
                if (x.data().constellations) {
                    for (const key in x.data().constellations) {
                        cons.push({ ...x.data().constellations[key], img: x.data().constImg[key] })
                    }
                }
                setCons(cons)
            } else {
                nav('/Characters', { replace: true })
            }
        }).catch(() => console.log('404'))
        setLoading(false)
    }

    return (
        <div className='char__container'>
            <Link to="/Characters" id="return" className='flex items-center gap-1 lightcolor transition duration-300 opacity-70 hover:opacity-100 font-semibold w-max'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                <span className="text-xl">Return to Characters</span>
            </Link>
            <h1 className="page__title lightcolor text-4xl font-bold mt-4 text-center sm:text-left">
                {charName}
            </h1>
            {
                loading &&
                <Loading />
            }
            {
                charData &&
                <div className="wrapper mt-8 px-4 sm:px-8 py-8 rounded-xl shadow-2xl mb-10 darkblue">
                    <div className="char__details lg:flex lg:gap-4">
                        <div className="char__card shrink-0 text-white">
                            <img src={charData.images.cover2} className="w-[350px] mx-auto lg:mx-0" alt={charData.name} />
                        </div>
                        <div className="char__stats text-white mt-6 lg:mt-0">
                            <div className=" shadow overflow-hidden sm:rounded-lg">
                                <div className="px-4 pb-6 sm:px-6">
                                    <h3 className="text-2xl leading-6 font-bold lightcolor flex items-center flex-col sm:flex-row gap-2 text-center sm:text-left">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        Character Information
                                    </h3>
                                </div>
                                <div className="pt-4 border-t-4 border-blue-900 text-white">
                                    <dl>
                                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="font-bold text-gray-200">Name</dt>
                                            <dd className="mt-1 sm:mt-0 sm:col-span-2">{charData.name}</dd>
                                        </div>
                                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="font-bold text-gray-200">Element</dt>
                                            {
                                                charData.element !== "N/A" ?
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">
                                                        <img src={charElement} alt="Element" className='w-8 h-8' title={charData.element} />
                                                    </dd>
                                                    :
                                                    <dd className="mt-1 sm:mt-0 sm:col-span-2">
                                                        <p>N/A</p>
                                                    </dd>
                                            }
                                        </div>
                                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="font-bold text-gray-200">Weapon Type</dt>
                                            <dd className="mt-1 sm:mt-0 sm:col-span-2">
                                                {charData.weapontype}
                                            </dd>
                                        </div>
                                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="text-sm font-bold text-gray-200">Rarity</dt>
                                            <dd className="mt-1 sm:mt-0 sm:col-span-2 flex items-center gap-1">
                                                {charData.rarity}
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            </dd>
                                        </div>
                                        <div className="px-4 py-5 grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="font-bold text-gray-200">Ascension Stats</dt>
                                            <dd className="mt-1 sm:mt-0 sm:col-span-2">{charData.substat !== "Elemental Mastery" ? charData.substat + ' %' : charData.substat}</dd>
                                        </div>
                                        <div className="px-4 py-5 grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="font-bold text-gray-200">Affiliation</dt>
                                            <dd className="mt-1 sm:mt-0 sm:col-span-2">{charData.affiliation}</dd>
                                        </div>
                                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="font-bold text-gray-200">Birthday</dt>
                                            <dd className="mt-1 sm:mt-0 sm:col-span-2">{charData.birthday}</dd>
                                        </div>
                                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="font-bold text-gray-200">Description</dt>
                                            <dd className="mt-1 sm:mt-0 sm:col-span-2">
                                                {charData.description}
                                            </dd>
                                        </div>
                                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="font-bold text-gray-200">Constellation</dt>
                                            <dd className="mt-1 sm:mt-0 sm:col-span-2">{charData.constellation}</dd>
                                        </div>
                                        <div className="px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                            <dt className="font-bold text-gray-200">CV</dt>
                                            <dd className="mt-1 sm:mt-0 sm:col-span-2">
                                                <p className="cv__cn">CN: {charData.cv.chinese}</p>
                                                <p className="cv__en">EN: {charData.cv.english}</p>
                                                <p className="cv__jp">JP: {charData.cv.japanese}</p>
                                                <p className="cv__kr">KR: {charData.cv.korean}</p>
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </div>
                    </div>
                    {
                        charData.constellations &&
                        <div className="mt-12 constellations max-w-screen-lg">
                            <h2 className="constellations__title text-2xl lightcolor font-bold">Constellation - {charData.constellation}</h2>

                            <div className="constellation__details mt-6 flex flex-col gap-8">
                                {
                                    cons &&
                                    cons.map((val, key) => {
                                        return (
                                            <div className="cons__rows flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left" key={key}>
                                                <div className="cons__icon rounded-full p-2 bg-black/50 w-[80px] shrink-0">
                                                    <img src={val.img} alt="" />
                                                </div>
                                                <div className="cons__details">
                                                    <p className='cons__name text-white font-bold text-xl'>{val.name}</p>
                                                    <p className='cons__desc text-white mt-2 sm:mt-0'>{val.effect}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default ViewCharacter