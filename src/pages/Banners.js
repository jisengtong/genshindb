import { useState, useEffect, useRef } from 'react'
import { db } from '../firebase'
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

import { getYMD_HMS, getIntervalTimeLeft } from '../functions/dates'
import active from '../functions/active'

import Loading from '../components/General/Loading'
import Error from '../components/General/Error'
import PageTitle from '../components/PageTitle'
import BannerFragment from '../components/Banners/BannerFragment'

const Banners = () => {
  const [currentLiveBannerId, setcurrentLiveBannerId] = useState('')
  const [bannerData, setBanner] = useState({})
  const [bHistoryData, setBHistory] = useState({})
  const [bannerHistory, setBannerHistory] = useState([])
  const bannerToShow = Object.keys(bHistoryData).length > 0 ? bHistoryData : bannerData

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [msLeftAsia, setMsAsia] = useState(0)
  const [msLeftUS, setMsUS] = useState(0)
  const TimeLeftAsia = getIntervalTimeLeft(msLeftAsia)
  const TimeLeftUS = getIntervalTimeLeft(msLeftUS)

  const bannerIntervalAsia = useRef()
  const bannerIntervalUS = useRef()

  const startMs = new Date(bHistoryData?.starts || bannerData?.starts) || 0
  const endMs = new Date(bHistoryData?.ends || bannerData?.ends) || 0
  const startDate = getYMD_HMS(startMs)
  const endDate = getYMD_HMS(endMs)

  const corpa = "Travelers, stock up on weapons and characters in the event wish to make your party stronger in combat!"

  useEffect(() => {
    active('Banners', 'banners')
    getBanner()
  }, [])

  useEffect(() => {
    if (Object.keys(bannerData).length > 0) {
      const msLeftAsia = new Date(bannerData.ends).getTime() - new Date().getTime()
      const msLeftUS = new Date(bannerData.ends).getTime() + parseInt(process.env.REACT_APP_TIMEZONE_DIFFERNCE) - new Date().getTime()
      setMsAsia(msLeftAsia <= 0 ? 0 : msLeftAsia)
      setMsUS(msLeftUS <= 0 ? 0 : msLeftUS)

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
    const docRef = doc(db, 'metadata', 'banner')

    try {
      const banners = await getDocs(collectionRef)
      const currentLiveBannerId = (await getDoc(docRef)).data().bannerId
      let bannerHistories = []

      banners.forEach(banner => {
        let bannerData = {
          id: banner.id,
          ...banner.data()
        }

        if (banner.id === currentLiveBannerId) {
          setBanner(bannerData)
        }
        bannerHistories.push(bannerData)
      })
      bannerHistories = bannerHistories.sort((a, b) => (a.ends > b.ends) ? -1 : 1);
      setBannerHistory(bannerHistories)
      setcurrentLiveBannerId(currentLiveBannerId)
    } catch (error) {
      setError("Unable to retrieve bannner data at the moment. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  const handleBannerChange = async (event) => {
    const bannerId = event.target.value
    if (bannerId === currentLiveBannerId) {
      setBHistory({})
      return
    }
    setBHistory(bannerHistory.find(banners => banners.id === event.target.value) || {})
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

          {bannerHistory.length > 0 &&
            bannerHistory.map((history, key) => {
              return <option value={history?.id} key={key}>{history?.version} {history?.id === currentLiveBannerId && "(On-going)"}</option>
            })}
        </select>
      </div>

      <BannerFragment
        bannerData={bannerToShow}
        TimeLeftAsia={TimeLeftAsia}
        TimeLeftUS={TimeLeftUS}
        msLeftAsia={msLeftAsia}
        msLeftUS={msLeftUS}
        corpa={corpa}
        startDate={startDate}
        endDate={endDate}
        currentLiveBannerId={currentLiveBannerId}
      />
    </div>
  )
}

export default Banners