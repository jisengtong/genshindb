import { useState, useEffect, useRef } from 'react'
import { db } from '../firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

import active from '../functions/active'
import Loading from '../components/General/Loading'
import Error from '../components/General/Error'
import PageTitle from '../components/PageTitle'
import BannerFragment from '../components/Banners/BannerFragment'

const getYMD_HMS = (ms) => {
  return `${ms.getFullYear()}/${(ms.getMonth() + 1).toString().padStart(2, '0')}/${ms.getDate().toString().padStart(2, '0')} - ${ms.getHours().toString().padStart(2, '0')}:${ms.getMinutes().toString().padStart(2, '0')}:${ms.getSeconds().toString().padStart(2, '0')}`
}

const getTimeLeft = (ms) => {
  const seconds = Math.floor((ms / 1000) % 60)
  const minutes = Math.floor((ms / 60000) % 60)
  const hours = Math.floor((ms / 3600000) % 24)
  const days = Math.floor((ms / 86400000) % 365)
  const TimeLeft = `${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
  return TimeLeft
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

  const startMs = new Date(bHistoryData?.starts || bannerData?.starts) || ""
  const endMs = new Date(bHistoryData?.ends || bannerData?.ends) || ""
  const corpa = "Travelers, stock up on weapons and characters in the event wish to make your party stronger in combat!"

  const startDate = getYMD_HMS(startMs)
  const endDate = getYMD_HMS(endMs)

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
      let bannerHistories = []

      banners.forEach(banner => {
        if (banner.id === process.env.REACT_APP_CURRENT_BANNER) {
          setBanner({ id: banner.id, ...banner.data() })
        }
        bannerHistories.push({ id: banner.id, version: banner.data().version })
      })
      setBannerHistory(bannerHistories)
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
      if (banner.id === process.env.REACT_APP_CURRENT_BANNER || !banner.exists()) {
        setBHistory({})
        return
      }
      setBHistory(banner.data())
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
        <select name="history"
          className="py-3 px-4 cursor-pointer rounded-lg w-full sm:max-w-[320px] darkblue outline-none mt-1 focus:ring-4 text-sm"
          defaultValue={""}
          onChange={handleBannerChange}>

          <option value="" disabled>Please Select</option>
          {bannerHistory.map((history, key) => {
            return <option value={history?.id} key={key}>{history?.version} {history?.id === process.env.REACT_APP_CURRENT_BANNER && "(On-going)"}</option>
          })}
        </select>
      </div>

      <BannerFragment
        bannerData={Object.keys(bHistoryData).length > 0 ? bHistoryData : bannerData}
        TimeLeftAsia={TimeLeftAsia}
        TimeLeftUS={TimeLeftUS}
        msLeftAsia={msLeftAsia}
        msLeftUS={msLeftUS}
        corpa={corpa}
        startDate={startDate}
        endDate={endDate}
      />
    </div>
  )
}

export default Banners