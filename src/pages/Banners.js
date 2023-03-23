import { useState, useEffect, useRef } from 'react'
import { db } from '../firebase'
import { doc, getDoc } from 'firebase/firestore'
import active from '../functions/active'
import Loading from '../components/Loading'
import Error from '../components/Error'
import PageTitle from '../components/PageTitle'

const Lists = ({ title, data }) => {
  return (
    <div className="mt-4">
      <p className='text-lg'><span className="font-bold">{title} </span> </p>
      <ul className='list-disc flex flex-col gap-2 px-4 mt-2'>
        {
          data.map((banners, key) => {
            return <li key={key}>{banners.name}</li>
          })
        }
      </ul>
    </div>
  )
}

const Banners = () => {
  const [bannerData, setBanners] = useState({})
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [msLeftAsia, setMsAsia] = useState(0)
  const bannerIntervalAsia = useRef()

  const startMs = new Date(bannerData.starts) || ""
  const endMs = new Date(bannerData.ends) || ""
  const corpa = "Travelers, stock up on weapons and characters in the event wish to make your party stronger in combat!"

  const startYMD = `${startMs.getFullYear()}/${(startMs.getMonth() + 1).toString().padStart(2, '0')}/${startMs.getDate().toString().padStart(2, '0')}`
  const startHMS = `${startMs.getHours().toString().padStart(2, '0')}:${startMs.getMinutes().toString().padStart(2, '0')}:${startMs.getSeconds().toString().padStart(2, '0')}`

  const endYMD = `${endMs.getFullYear()}/${(endMs.getMonth() + 1).toString().padStart(2, '0')}/${endMs.getDate().toString().padStart(2, '0')}`
  const endHMS = `${endMs.getHours().toString().padStart(2, '0')}:${endMs.getMinutes().toString().padStart(2, '0')}:${endMs.getSeconds().toString().padStart(2, '0')}`

  const seconds = Math.floor((msLeftAsia / 1000) % 60)
  const minutes = Math.floor((msLeftAsia / 60000) % 60)
  const hours = Math.floor((msLeftAsia / 3600000) % 24)
  const days = Math.floor((msLeftAsia / 86400000) % 365)
  const TimeLeft = `${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`

  useEffect(() => {
    active('Current Event Banners', 'Banners')
    getBanner()
  }, [])

  useEffect(() => {
    if (Object.keys(bannerData).length > 0) {
      setMsAsia(new Date(bannerData.ends).getTime() - new Date().getTime())

      bannerIntervalAsia.current = setInterval(() => {
        setMsAsia(prev => prev - 1000)
      }, 1000)

      return (() => {
        clearInterval(bannerIntervalAsia.current)
      })
    }
  }, [bannerData])

  const getBanner = async () => {
    setLoading(true)
    const docRef = doc(db, 'wishes', process.env.REACT_APP_CURRENT_BANNER)

    try {
      const banner = await getDoc(docRef)
      if (!banner.exists()) {
        setError("Unable to retrieve banner details.")
        return
      }
      setBanners(banner.data())
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (msLeftAsia < 1000) clearInterval(bannerIntervalAsia.current)
  if (loading) return <Loading />
  if (error) return <Error message={error} />

  return (
    <div className='text-white'>
      <PageTitle title={"Current Banners"} />

      {
        Object.keys(bannerData).length > 0 &&
        <div className="mt-8 banner__detail max-w-screen-lg mx-auto p-8 bg-[#282C36] rounded-xl shadow-xl">
          <h1 className='text-xl sm:text-2xl'>Banners Ending in: <span className='block sm:inline-block'> {TimeLeft} </span> {"(Asia Server)"}</h1>
          <div className="flex flex-col gap-8 mt-4">
            {
              bannerData.featured.big.map((banners, key) => {
                return (
                  <div key={key}>
                    <p className='mb-4 lightcolor text-xl font-bold'>Banner #{key + 1}: {banners.title}</p>
                    <img src={banners.bannerImg} alt={banners.name + " banner image"} className="rounded-lg" />
                  </div>
                )
              })
            }
          </div>
          <p className="mt-8 text-lg">{corpa}</p>
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

          <div className="mt-8">
            <p className="lightcolor text-xl sm:text-2xl">※ Additional Details</p>
            <p className="text-lg mt-2">For more information Event Banner Wishes, go to the in-game Wish screen by pressing F3 or via Pause Menu and select Details in the bottom-left corner.</p>
          </div>
        </div>
      }

    </div>
  )
}

export default Banners