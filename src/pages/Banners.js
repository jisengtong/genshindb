import { useState, useEffect, useRef } from 'react'
import { db } from '../firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'
import active from '../functions/active'
import Loading from '../components/Loading'
import Error from '../components/Error'
import PageTitle from '../components/PageTitle'

const getTimeLeft = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / 60000) % 60)
  const hours = Math.floor((ms / 3600000) % 24)
  const days = Math.floor((ms / 86400000) % 365)
  const TimeLeft = `${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`

  return TimeLeft
}

const Lists = ({ title, data }) => {
  return (
    <div className="mt-8">
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

const BannerFragment = ({ id, version, TimeLeftAsia, TimeLeftUS, msLeftAsia, msLeftUS, corpa, startYMD, startHMS, endYMD, endHMS, featuredBig, featuredSmall }) => {
  return (
    <div className="mt-8 banner__detail max-w-screen-lg mx-auto p-8 bg-[#282C36] rounded-xl shadow-xl">
      <span className="text-2xl underline">Phase: {version} {id !== process.env.REACT_APP_CURRENT_BANNER && <span className="font-bold">(Ended)</span>}</span>
      {id === process.env.REACT_APP_CURRENT_BANNER &&
        <span className='text-xl sm:text-2xl block mt-4'>Banners Ending in:
          <ul className="list-disc px-6">
            <li> {TimeLeftAsia} {"(Asia/TW/HK Server)"} {msLeftAsia < 1000 && '-Ended'}</li>
            <li> {TimeLeftUS} {"(NA/EU Server)"} {msLeftUS < 1000 && '-Ended'}</li>
          </ul>
        </span>
      }
      <div className="flex flex-col gap-8 mt-6">
        {
          featuredBig.map((banners, key) => {
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
        <Lists title={"Featured 5* Characters and Weapons:"} data={featuredSmall} />
        <Lists title={"Featured 4* Characters:"} data={featuredBig} />
      </div>

      <div className="mt-8">
        <p className="lightcolor text-xl sm:text-2xl">※ Additional Details</p>
        <p className="mt-2">For more information Event Banner Wishes, go to the in-game Wish screen by pressing F3 or via Pause Menu and select Details in the bottom-left corner.<br /> Happy Wishing!</p>
      </div>
    </div>
  )
}
const Banners = () => {
  const [bannerData, setBanner] = useState({})

  const [bHistoryData, setBHistory] = useState({})
  const [bannerHistory, setBannerHistory] = useState([])

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [msLeftAsia, setMsAsia] = useState(0)
  const [msLeftUS, setMsUS] = useState(0)
  const bannerIntervalAsia = useRef()
  const bannerIntervalUS = useRef()

  const startMs = new Date(bHistoryData?.starts ? bHistoryData.starts : bannerData?.starts) || ""
  const endMs = new Date(bHistoryData?.ends ? bHistoryData.ends : bannerData?.ends) || ""
  const corpa = "Travelers, stock up on weapons and characters in the event wish to make your party stronger in combat!"

  const startYMD = `${startMs.getFullYear()}/${(startMs.getMonth() + 1).toString().padStart(2, '0')}/${startMs.getDate().toString().padStart(2, '0')}`
  const startHMS = `${startMs.getHours().toString().padStart(2, '0')}:${startMs.getMinutes().toString().padStart(2, '0')}:${startMs.getSeconds().toString().padStart(2, '0')}`

  const endYMD = `${endMs.getFullYear()}/${(endMs.getMonth() + 1).toString().padStart(2, '0')}/${endMs.getDate().toString().padStart(2, '0')}`
  const endHMS = `${endMs.getHours().toString().padStart(2, '0')}:${endMs.getMinutes().toString().padStart(2, '0')}:${endMs.getSeconds().toString().padStart(2, '0')}`

  const TimeLeftAsia = getTimeLeft(msLeftAsia)
  const TimeLeftUS = getTimeLeft(msLeftUS)

  useEffect(() => {
    active('Banners', 'banners')
    getBanner()
  }, [])

  useEffect(() => {
    if (Object.keys(bannerData).length > 0) {
      setMsAsia(new Date(bannerData.ends).getTime() - new Date().getTime())
      setMsUS((new Date(bannerData.ends).getTime()) + 43200000 - new Date().getTime())

      bannerIntervalAsia.current = setInterval(() => {
        setMsAsia(prev => prev - 1000)
      }, 1000)
      bannerIntervalUS.current = setInterval(() => {
        setMsUS(prev => prev - 1000)
      }, 1000)

      return (() => {
        clearInterval(bannerIntervalAsia.current)
        clearInterval(bannerIntervalUS.current)
      })
    }
  }, [bannerData])

  const getBanner = async () => {
    setLoading(true)
    const collectionRef = collection(db, 'wishes')
    try {
      const banners = await getDocs(collectionRef)
      banners.forEach(banner => {
        if (banner.id === process.env.REACT_APP_CURRENT_BANNER) {
          setBanner({ id: banner.id, ...banner.data() })
        }
        setBannerHistory(prev => [...prev, { id: banner.id, version: banner.data().version }])
      })
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleBannerChange = async (event) => {
    const docRef = doc(db, 'wishes', event.target.value)
    try {
      const banner = await getDoc(docRef)
      if (banner.id === process.env.REACT_APP_CURRENT_BANNER) {
        setBHistory({})
        return
      }
      if (banner.exists()) {
        setBHistory(banner.data())
      }
    } catch (error) {
      setError(error.message)
    }
  }

  if (msLeftAsia < 1000) clearInterval(bannerIntervalAsia.current)
  if (msLeftUS < 1000) clearInterval(bannerIntervalUS.current)
  if (loading) return <Loading />
  if (error) return <Error message={error} />

  return (
    <div className='text-white'>
      <PageTitle title={"View in-game Banners"} />
      <div className='mt-4'>
        <p className='text-lg sm:text-xl'>View Banner History: </p>
        <select name="history" className="py-3 px-4 cursor-pointer rounded-lg w-full max-w-[320px] bg-[#282C36] outline-none mt-1 focus:ring-4 text-sm" defaultValue={""} onChange={handleBannerChange}>
          <option value="" disabled>Please Select</option>
          {
            bannerHistory.map((history, key) => {
              return <option value={history.id} key={key}>{history.version} {history.id === process.env.REACT_APP_CURRENT_BANNER && "(On-going)"}</option>
            })
          }
        </select>
      </div>

      {Object.keys(bHistoryData).length > 0 ?
        <BannerFragment
          id={bHistoryData.id}
          version={bHistoryData.version}
          TimeLeftAsia={TimeLeftAsia}
          TimeLeftUS={TimeLeftUS}
          msLeftAsia={msLeftAsia}
          msLeftUS={msLeftUS}
          corpa={corpa}
          startYMD={startYMD}
          startHMS={startHMS}
          endYMD={endYMD}
          endHMS={endHMS}
          featuredBig={bHistoryData.featured.big}
          featuredSmall={bHistoryData.featured.small}
        />
        :
        Object.keys(bannerData).length > 0 &&
        <BannerFragment
          id={bannerData.id}
          version={bannerData.version}
          TimeLeftAsia={TimeLeftAsia}
          TimeLeftUS={TimeLeftUS}
          msLeftAsia={msLeftAsia}
          msLeftUS={msLeftUS}
          corpa={corpa}
          startYMD={startYMD}
          startHMS={startHMS}
          endYMD={endYMD}
          endHMS={endHMS}
          featuredBig={bannerData.featured.big}
          featuredSmall={bannerData.featured.small}
        />
      }
    </div>
  )
}

export default Banners