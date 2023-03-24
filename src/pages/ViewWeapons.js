import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import CollapsableParagraph from '../components/CollapsableParagraph.js'
import DataVersion from '../components/DataVersion'
import active from '../functions/active'

const ViewWeapons = () => {
    const { name } = useParams();
    const [weaponName, setWeaponName] = useState('');
    const [weaponData, setWeaponData] = useState();
    const [effect, setEffect] = useState('');
    const nav = useNavigate();

    const totalRefinements = [1, 2, 3, 4, 5]

    useEffect(() => {
        name !== undefined ? getWeaponData(name) : nav('/Error', { replace: true });
        setWeaponName(name);
        active(`Weapon - ${name}`, 'weapons')
    }, [])

    async function getWeaponData(name) {
        const weaponRef = doc(db, 'weapons', name)
        await getDoc(weaponRef).then((x) => {
            if (x.exists()) {
                let initialStr = x.data().effect;
                if (initialStr !== "") {
                    let { r1 } = x.data()

                    for (let i = 0; i < r1.length; i++) {
                        initialStr = initialStr.split('{' + i + '}').join(r1[i])
                    }
                    setEffect(initialStr);
                }
                setWeaponData(x.data());
            } else {
                nav('/Weapons', { replace: true });
            }
        })
    }

    function handleRefinementChange(element) {
        const selectedRefinement = element.target.value
        const refinementData = weaponData[selectedRefinement]
        let refinementEffect = weaponData.effect

        for (let i = 0; i < refinementData.length; i++) {
            refinementEffect = refinementEffect.split('{' + i + '}').join(refinementData[i])
        }
        setEffect(refinementEffect)
    }

    return (
        <div className='weapon__container'>
            <Link to="/Weapons" id="return" className='flex items-center gap-1 lightcolor transition duration-300 opacity-70 hover:opacity-100 font-semibold w-max'>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 15l-3-3m0 0l3-3m-3 3h8M3 12a9 9 0 1118 0 9 9 0 01-18 0z" />
                </svg>
                <span className="text-xl">Return to Weapons</span>
            </Link>
            <h1 className="page__title lightcolor text-4xl font-bold mt-4 text-center sm:text-left">
                Weapon - {weaponName}
            </h1>
            {
                weaponData &&
                <div className="mt-10 max-w-screen-xl mx-auto darkblue p-6 rounded-xl">
                    <div className="weapon__data rounded-xl flex items-start flex-col md:flex-row gap-5">
                        <div className={`self-center md:self-start p-4 rounded-xl weapon__icon shrink-0 ${weaponData.rarity >= "4" ? weaponData.rarity === "5" ? 'bg-[#e1872280]' : 'bg-[#ae92d680]' : 'bg-gray-600'}`}>
                            <img src={weaponData.images.icon} className="mx-auto md:mx-0 w-[256px]" alt="" />
                        </div>
                        <div className="weapon__details text-white">
                            <p className="weapon__name text-3xl sm:text-4xl font-bold">{weaponData.name}</p>
                            <p className="weapon__rarity flex items-center text-xl mt-2">
                                {weaponData.rarity}
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </p>
                            <div className="weapon__stats flex flex-col sm:flex-row gap-6 my-4 text-xl">
                                <p className="base__atk">
                                    <span className="block font-bold">
                                        Base Atk (Lv.1)
                                    </span>
                                    <span className="block">
                                        {weaponData.baseatk}
                                    </span>
                                </p>
                                {
                                    weaponData.substat !== "" &&
                                    <p className="sub__stat">
                                        <span className="block font-bold">
                                            {weaponData.substat} (Lv.1)
                                        </span>
                                        <span className="block">
                                            {weaponData.subvalue} %
                                        </span>
                                    </p>

                                }
                            </div>
                            <span className="weapon__type mt-4 py-2 px-3 rounded-lg bg-blue-800/30 text-opacity-70 text-white">
                                {weaponData.weapontype}
                            </span>
                            <p className="text-normal sm:text-xl opacity-40 mt-5">
                                {weaponData.description}
                            </p>
                        </div>
                    </div>
                    {
                        weaponData.effectname !== "" &&
                        <div className="weapon__effect mt-6 text-white">
                            <h2 className="effect__name font-bold text-xl sm:text-2xl lightcolor">
                                {weaponData.effectname} <span className="text-lg font-normal">
                                    <select name="refinementLevels" className='cursor-pointer bg-blue-800/30 py-2 px-4 outline-none' onChange={(event) => handleRefinementChange(event)}>
                                        {
                                            totalRefinements.map((level, key) => {
                                                return <option value={`r${level}`} key={key}>R{level}</option>
                                            })
                                        }
                                    </select>
                                </span>
                            </h2>
                            <p className="weapon__skill mt-2">
                                {effect}
                            </p>
                        </div>
                    }
                    <div className="weapon__story mt-8 text-white">
                        <h2 className="effect__name font-bold text-xl sm:text-2xl lightcolor">
                            Weapon Story
                        </h2>
                        <CollapsableParagraph texts={weaponData.story ? weaponData.story : "N/A"} />
                    </div>
                    <DataVersion version={weaponData.version} />
                </div>
            }
        </div>
    )
}

export default ViewWeapons