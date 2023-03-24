import React, { useEffect, useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { Link, useNavigate, useParams } from 'react-router-dom'

import DataVersion from '../components/DataVersion'
import active from '../functions/active'

import Plume from '../images/artifacts/Plume.png'
import Circlet from '../images/artifacts/Circlet.png'
import Flower from '../images/artifacts/Flower.png'
import Sands from '../images/artifacts/Sands.png'
import Goblet from '../images/artifacts/Goblet.png'

const Circle = () => {
    return (
        <div className="circle w-[20px] h-[20px] hidden sm:flex items-center justify-center rounded-full shrink-0" style={{ border: '0px solid #6a91e9' }}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 lightcolor" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" />
            </svg>
        </div>
    )
}

const Title = ({ title }) => {
    return <h2 className="lightcolor text-2xl font-bold">{title}</h2>
}

const ViewArtifacts = () => {
    const [artifactName, setName] = useState('');
    const [artiData, setData] = useState();
    const { name } = useParams();
    const nav = useNavigate();

    const artifactStats = [{
        name: 'flower',
        img: Flower,
        title: 'Flower of Life',
        desc: 'Flower of Life: Flat HP'
    }, {
        name: 'plume',
        img: Plume,
        title: 'Plume of Death',
        desc: 'Plume of Death: Flat ATK'
    }, {
        name: 'sands',
        img: Sands,
        title: 'Sands of Eon',
        desc: 'Sands of Eon: HP% /ER% /ATK% /DEF% /Elemental Mastery'
    }, {
        name: 'goblet',
        img: Goblet,
        title: 'Goblet of Eonothem',
        desc: 'Goblet of Eonothem:  HP% /ATK% /DEF% /Elemental DMG Bonus% /Elemental Mastery'
    }, {
        name: 'circlet',
        img: Circlet,
        title: 'Circlet of Logos',
        desc: 'Circlet of Logos: HP% /ATK% /DEF% /Crit Rate% /Crit DMG% /Elemental Mastery'
    }]

    useEffect(() => {
        name !== undefined ? getArtifactData(name) : nav('/Error', { replace: true });
        setName(name);
        
        active(`Artifacts - ${name}`, 'artifacts')
    }, [])

    async function getArtifactData(artiName) {
        const artifactRef = doc(db, 'artifacts', artiName)
        const artiData = await getDoc(artifactRef)

        if (artiData.exists()) {
            setData(artiData.data())
        } else {
            nav('/Artifacts', { replace: true });
        }
    }

    return (
        <div className='artifact__container'>
            <Link to="/Artifacts" id="return" className='flex items-center gap-1 lightcolor transition duration-300 opacity-70 hover:opacity-100 font-semibold w-max'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                <span className="text-xl">Return to Artifacts</span>
            </Link>
            <h1 className="page__title lightcolor text-4xl font-bold text-center sm:text-left mt-4">
                Artifacts - {artifactName}
            </h1>

            {
                artiData &&
                <div className="artifact__details mt-10 max-w-screen-xl mx-auto darkblue p-6 rounded-xl">
                    <div className="artifact__data rounded-xl flex items-start flex-col md:flex-row gap-5">
                        <div className={`icon relative ${artiData.rarity.includes('5') ? 'bg-[#e1872280]' : 'bg-gray-600'} rounded-xl self-center md:self-start`}>
                            <div className="w-1/2 absolute inset-0 h-full bg-[#ae92d6] z-0 rounded-l-xl">
                            </div>
                            <img src={artiData.images.flower ? artiData.images.flower : artiData.images.circlet} alt="" className='mx-auto rounded-t-xl relative z-30 w-[306px]' />
                        </div>
                        <div className="artifact__info text-white pt-2">
                            <p className="artifact__name text-3xl font-bold">{artiData.name}</p>
                            <p className="rarity flex items-center gap-3 mt-2">
                                {artiData.rarity.map((val, key) => {
                                    return (
                                        <span className="rarity__lvl flex items-center " key={key}>
                                            {val}
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        </span>
                                    )
                                })}
                            </p>
                            <div className="labels flex items-center gap-3 flex-wrap mt-4">
                                <span className="artifact__type block py-2 px-3 rounded-lg bg-blue-800/30 text-opacity-90 text-white">
                                    Artifact
                                </span>
                                <span className="artifact__type block py-2 px-3 rounded-lg bg-blue-800/30 text-opacity-90 text-white">
                                    {artiData.flower.relictype ? artiData.flower.relictype : artiData.circlet.relictype}
                                </span>
                            </div>
                            <p className="artifact__description mt-4">
                                {artiData.flower.description ? artiData.flower.description : artiData.circlet.description}
                            </p>
                        </div>
                    </div>

                    <div className="set__bonus mt-8 text-white">
                        <div className="flex items-center gap-2">
                            <Circle />
                            <Title title={`Artifact Set Bonuses: ${artiData.name}`}></Title>
                        </div>
                        {
                            artiData.setBonus.two !== "" ?
                                <div className="max-w-screen-md columns mt-4 rounded-lg border-2 border-white/50">
                                    <div className="sm:grid sm:grid-cols-3 bg-gray-700 rounded-t-lg border-b-2 border-white/50">
                                        <p className='font-semibold sm:border-r-2 p-3 border-white/50'>2-Set Bonus:</p>
                                        <p className="col-span-2 p-3">{artiData.setBonus.two}</p>
                                    </div>
                                    <div className="sm:grid sm:grid-cols-3 bg-slate-800 rounded-b-lg">
                                        <p className='font-semibold p-3 sm:border-r-2 border-white/50'>4-Set Bonus:</p>
                                        <p className="col-span-2 p-3">{artiData.setBonus.four}</p>
                                    </div>
                                </div>
                                :
                                <div className="max-w-screen-md columns mt-4 rounded-lg border-2 border-white/50">
                                    <div className="sm:grid sm:grid-cols-3 bg-gray-700 rounded-lg">
                                        <p className='font-semibold border-r-2 border-white/50 p-3'>1-Set Bonus:</p>
                                        <p className="col-span-2 p-3">{artiData.setBonus.one}</p>
                                    </div>
                                </div>
                        }
                    </div>

                    <div className="set__bonus mt-8 text-white">
                        <div className="flex items-center gap-2">
                            <Circle />
                            <Title title={`${artiData.name} Set Pieces`}></Title>
                        </div>
                        <div className="set__pieces grid p-8 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-4 bg-slate-800 text-sm rounded-lg">
                            {
                                artiData.images.flower ?
                                    <>
                                        {artifactStats.map((val, index) => {
                                            return (
                                                <div className="col rounded-lg bg-slate-900 relative" title={val.title} key={index}>
                                                    <div className="rounded-full p-1 absolute left-3 top-3 bg-black/50">
                                                        <img src={val.img} alt="" className="" />
                                                    </div>
                                                    <div className="bg-gray-700 rounded-t-lg">
                                                        <img src={artiData.images[val.name]} className="w-[150px] mx-auto rounded-lg" alt="" />
                                                    </div>
                                                    <p className="rounded-b-lg px-2 py-3 text-center">
                                                        {artiData[val.name].name}
                                                    </p>
                                                </div>
                                            )
                                        })}
                                    </>
                                    :
                                    <div className="col rounded-lg bg-slate-900 relative" title='Circlet of Logos'>
                                        <div className="rounded-full p-1 absolute left-3 top-3 bg-black/50">
                                            <img src={Circlet} alt="" className="" />
                                        </div>
                                        <div className="bg-gray-700 rounded-t-lg">
                                            <img src={artiData.images.circlet} className="w-[150px] mx-auto rounded-lg" alt="" />
                                        </div>
                                        <p className="rounded-b-lg px-2 py-3 text-center">
                                            {artiData.circlet.name}
                                        </p>
                                    </div>
                            }
                        </div>
                    </div>

                    <div className="set__stats mt-8 text-white">
                        <div className="flex items-center gap-2">
                            <Circle />
                            <Title title={'Artifact Pieces Main Stats'}></Title>
                        </div>

                        <div className="stats__container flex flex-col gap-4 mt-6 sm:text-lg">
                            {
                                artifactStats.map((val, key) => {
                                    return (
                                        <div className="row flex items-center gap-2" key={key}>
                                            <img src={val.img} alt={val.name} className="w-[30px]" />
                                            <p>{val.desc}</p>
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>

                    <DataVersion version={artiData.version} />
                </div>
            }
        </div>
    )
}

export default ViewArtifacts