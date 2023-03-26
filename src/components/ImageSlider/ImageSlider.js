import { useState, useEffect } from 'react'
import React from 'react'
import useFirstRender from '../../functions/useFirstRender'
import Arrows from './Arrows'

const ImageSlider = ({ title, imageData }) => {
    const isFirstRender = useFirstRender()
    const [index, setIndex] = useState(0)

    const totalIndex = imageData.length - 1 || 0
    let imageRefs = imageData.map(() => React.createRef())

    useEffect(() => {
        if (!isFirstRender) {
            setIndex(0)
            imageRefs[0].current.parentNode.scrollLeft = 0
        }
    }, [imageData])

    const handleSlideImage = (action) => {
        let currentIndex = index
        if (action === "PREVIOUS") {
            if (index <= 0) currentIndex = totalIndex
            else currentIndex -= 1
        }
        if (action === "NEXT") {
            if (index >= totalIndex) currentIndex = 0
            else currentIndex += 1
        }
        scrollImage(currentIndex)
        return
    }

    const scrollImage = (targetIndex) => {
        const imageOfScrollLeft = imageRefs[targetIndex].current.offsetLeft + imageRefs[targetIndex].current.offsetWidth;
        const parentContainerLeft = imageRefs[targetIndex].current.parentNode.offsetLeft + imageRefs[targetIndex].current.parentNode.offsetWidth;

        if (imageOfScrollLeft >= parentContainerLeft + imageRefs[targetIndex].current.parentNode.scrollLeft) {
            imageRefs[targetIndex].current.parentNode.scrollLeft = imageOfScrollLeft - parentContainerLeft;
        } else if (imageOfScrollLeft <= imageRefs[targetIndex].current.parentNode.offsetLeft + imageRefs[targetIndex].current.parentNode.scrollLeft) {
            imageRefs[targetIndex].current.parentNode.scrollLeft = imageRefs[targetIndex].current.offsetLeft - imageRefs[targetIndex].current.parentNode.offsetLeft;
        }
        setIndex(targetIndex)
    }

    return (<>
        <div className="mt-6">
            {title && <p className='mb-4 lightcolor text-xl font-bold'>{title} {imageData[index].title && imageData[index].title}</p>}
            <div className="relative group">
                <div className="absolute px-4 w-full hidden sm:flex justify-between items-center top-[50%] translate-y-[-50%] z-10 transition duration-500 opacity-30 group-hover:opacity-90">
                    <Arrows
                        className={"rotate-180 text-white p-1 sm:p-2 bg-black rounded-lg transition duration-300 hover:bg-black/70"}
                        onClick={() => handleSlideImage("PREVIOUS")}
                    />
                    <Arrows
                        className={"text-white p-1 sm:p-2 bg-black rounded-lg transition duration-300 hover:bg-black/70"}
                        onClick={() => handleSlideImage("NEXT")}
                    />
                </div>
                <div className="overflow-x-hidden flex gap-10">
                    {imageData.map((banners, key) => {
                        return (
                            <div className="w-full flex-shrink-0" key={key} ref={imageRefs[key]}>
                                <img src={banners.src || banners.url || banners} alt={banners.name || "image"} className="rounded-lg" />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
        <div className="flex justify-between sm:justify-center items-center mt-4 sm:mt-6">
            <Arrows
                className={"mobile__only rotate-180 text-white p-1 sm:p-2 bg-blue-800/30 rounded-lg sm:hidden"}
                onClick={() => handleSlideImage("PREVIOUS")}
            />
            <div className="btn__group flex gap-4">
                {[...Array(imageData.length || 0).keys()].map((buttons, key) => {
                    return (
                        <button
                            className={`p-1.5 sm:p-2 rounded-full transition duration-300 ${index === buttons ? 'bg-gray-600' : 'bg-gray-300 hover:bg-gray-500'}`}
                            aria-label="navigate images"
                            onClick={() => scrollImage(buttons)}
                            data-index={key}
                            key={key}>
                        </button>)
                })}
            </div>
            <Arrows
                className={"mobile__only text-white p-1 sm:p-2 bg-blue-800/30 rounded-lg sm:hidden"}
                onClick={() => handleSlideImage("NEXT")}
            />
        </div>
    </>
    )
}

export default ImageSlider