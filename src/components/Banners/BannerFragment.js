import { useState, useEffect } from 'react'
import useFirstRender from '../../functions/useFirstRender'
import React from 'react'
import Lists from './Lists'
import Arrows from './Arrows'
import Error from '../General/Error'

const BannerFragment = ({ bannerData, TimeLeftAsia, TimeLeftUS, msLeftAsia, msLeftUS, corpa, startYMD, startHMS, endYMD, endHMS }) => {
    const isFirstRender = useFirstRender()
    const [index, setIndex] = useState(0)

    const totalIndex = bannerData?.featured?.big?.length - 1 || 0
    let bannerRefs = bannerData?.featured?.big?.map(() => React.createRef())

    useEffect(() => {
        if(!isFirstRender){
            setIndex(0)
            bannerRefs[0].current.parentNode.scrollLeft = 0
        }
    }, [bannerData])

    const handleSlideBanner = (action) => {
        let currentIndex = index
        if (action === "PREVIOUS") {
            if (index <= 0) currentIndex = totalIndex
            else currentIndex -= 1
        }
        if (action === "NEXT") {
            if (index >= totalIndex) currentIndex = 0
            else currentIndex += 1
        }
        scrollBanner(currentIndex)
        return
    }

    const scrollBanner = (targetIndex) => {
        const bannerToScrollLeft = bannerRefs[targetIndex].current.offsetLeft + bannerRefs[targetIndex].current.offsetWidth;
        const parentContainerLeft = bannerRefs[targetIndex].current.parentNode.offsetLeft + bannerRefs[targetIndex].current.parentNode.offsetWidth;

        if (bannerToScrollLeft >= parentContainerLeft + bannerRefs[targetIndex].current.parentNode.scrollLeft) {
            bannerRefs[targetIndex].current.parentNode.scrollLeft = bannerToScrollLeft - parentContainerLeft;
        } else if (bannerToScrollLeft <= bannerRefs[targetIndex].current.parentNode.offsetLeft + bannerRefs[targetIndex].current.parentNode.scrollLeft) {
            bannerRefs[targetIndex].current.parentNode.scrollLeft = bannerRefs[targetIndex].current.offsetLeft - bannerRefs[targetIndex].current.parentNode.offsetLeft;
        }
        setIndex(targetIndex)
    }

    return (
        <div className="mt-8 banner__detail max-w-screen-lg mx-auto p-8 bg-[#282C36] rounded-xl shadow-xl">
            {Object.keys(bannerData).length > 0 ?
                <>
                    <span className="text-2xl underline">Phase: {bannerData.version} {bannerData.id !== process.env.REACT_APP_CURRENT_BANNER && <span className="font-bold">(Ended)</span>}</span>
                    {bannerData.id === process.env.REACT_APP_CURRENT_BANNER &&
                        <span className='text-lg sm:text-2xl block mt-4'>Banners Ending in:
                            <ul className="list-disc px-6">
                                <li> {TimeLeftAsia} {"(Asia/TW/HK Server)"} {msLeftAsia < 1000 && '-Ended'}</li>
                                <li> {TimeLeftUS} {"(NA/EU Server)"} {msLeftUS < 1000 && '-Ended'}</li>
                            </ul>
                        </span>}

                    <div className="mt-6">
                        <p className='mb-4 lightcolor text-xl font-bold'>Banner #{index + 1}: {bannerData.featured.big[index].title}</p>
                        <div className="relative group">
                            <div className="absolute px-4 w-full hidden sm:flex justify-between items-center top-[50%] translate-y-[-50%] z-10 transition duration-500 opacity-30 group-hover:opacity-90">
                                <Arrows
                                    className={"rotate-180 text-white p-1 sm:p-2 bg-black rounded-lg transition duration-300 hover:bg-black/70"}
                                    onClick={() => handleSlideBanner("PREVIOUS")}
                                />
                                <Arrows
                                    className={"text-white p-1 sm:p-2 bg-black rounded-lg transition duration-300 hover:bg-black/70"}
                                    onClick={() => handleSlideBanner("NEXT")}
                                />
                            </div>
                            <div className="overflow-x-hidden flex gap-10">
                                {bannerData.featured.big.map((banners, key) => {
                                    return (
                                        <div className="w-full flex-shrink-0" key={key} ref={bannerRefs[key]}>
                                            <img src={banners.bannerImg} alt={banners.name + " banner image"} className="rounded-lg" />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-between sm:justify-center items-center mt-4 sm:mt-6">
                        <Arrows
                            className={"mobile__only rotate-180 text-white p-1 sm:p-2 bg-blue-800/30 rounded-lg sm:hidden"}
                            onClick={() => handleSlideBanner("PREVIOUS")}
                        />
                        <div className="btn__group flex gap-4">
                            {[...Array(bannerData.featured.big.length || 0).keys()].map((buttons, key) => {
                                return (
                                    <button
                                        className={`p-1.5 sm:p-2 rounded-full transition duration-300 ${index === buttons ? 'bg-gray-600' : 'bg-gray-300 hover:bg-gray-500'}`}
                                        aria-label="navigate banner"
                                        onClick={() => scrollBanner(buttons)}
                                        data-index={key}
                                        key={key}>
                                    </button>)
                            })}
                        </div>
                        <Arrows
                            className={"mobile__only text-white p-1 sm:p-2 bg-blue-800/30 rounded-lg sm:hidden"}
                            onClick={() => handleSlideBanner("NEXT")}
                        />
                    </div>

                    <div>
                        <p className="mt-8 sm:text-lg">{corpa}</p>
                        <div className="mt-6">
                            <p className="lightcolor text-xl sm:text-2xl">※ Banner Details</p>
                            <div className="mt-2">
                                <p className='text-lg'><span className="font-bold">Duration:</span> <br />
                                    <span className="block">{startYMD} - {startHMS}</span> -- <span className="block">{endYMD} - {endHMS}</span>
                                </p>
                            </div>
                            <Lists title={"Featured 5* Characters and Weapons:"} data={bannerData.featured.big} />
                            <Lists title={"Featured 4* Characters:"} data={bannerData.featured.small} />
                        </div>
                    </div>

                    <div className="mt-8">
                        <p className="lightcolor text-xl sm:text-2xl">※ Additional Details</p>
                        {bannerData?.additionalDetails &&
                            <div className="mb-6">
                                {bannerData.additionalDetails.map((details, key) => {
                                    return (
                                        <li className="mt-2" key={key}>{details}</li>
                                    )
                                })}
                            </div>
                        }
                        <p className="mt-2">For more information on Event Banner Wishes, go to the in-game Wish screen by pressing F3 or via Pause Menu and select Details in the bottom-left corner.<br /> Happy Wishing!</p>
                    </div>
                </>
                :
                <Error message={"Failed to retrieve banner data."} />
            }
        </div>
    )
}

export default BannerFragment