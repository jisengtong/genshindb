import React from 'react'
import Lists from './Lists'
import Error from '../General/Error'
import ImageSlider from '../ImageSlider/ImageSlider'

const BannerFragment = ({ bannerData, TimeLeftAsia, TimeLeftUS, msLeftAsia, msLeftUS, corpa, startDate, endDate }) => {
    const endStatus = new Date(startDate.replace('-', '')) > new Date()
        ? "(Comming Soon)"
        : (new Date(endDate.replace('-', '')).getTime() + msLeftUS) < new Date()
            ? "(Ended)"
            : ""

    return (
        <div className="mt-8 banner__detail max-w-screen-lg mx-auto p-8 darkblue rounded-xl shadow-xl">
            {Object.keys(bannerData).length > 0 ?
                <>
                    <span className="text-2xl underline">Phase: {bannerData.version} <span className="font-bold">{endStatus}</span></span>
                    {bannerData.id === process.env.REACT_APP_CURRENT_BANNER &&
                        <span className='text-lg sm:text-2xl block mt-4'>Banners Ending in:
                            <ul className="list-disc px-6">
                                <li> {TimeLeftAsia} {"(Asia/TW/HK Server)"} {msLeftAsia < 1000 && '-Ended'}</li>
                                <li> {TimeLeftUS} {"(NA/EU Server)"} {msLeftUS < 1000 && '-Ended'}</li>
                            </ul>
                        </span>
                    }
                    <ImageSlider
                        title={"Featured Banners: "}
                        imageData={bannerData.featured.big}
                    />

                    <div className='mt-8'>
                        <p className="sm:text-lg">{corpa}</p>
                        <div className="mt-6">
                            <p className="lightcolor text-xl sm:text-2xl">※ Banner Details</p>
                            <div className="mt-2">
                                <p className='text-lg'><span className="font-bold">Duration:</span> <br />
                                    <span className="block">{startDate}</span> -- <span className="block">{endDate}</span>
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
                            </div>}
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