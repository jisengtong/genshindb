import React, { useState, useEffect, useRef } from 'react'
import Loading from './Loading'
import Error from './Error'
import active from '../functions/active'

const RenderCountry = ({ arr, limitData }) => {
    return (
        arr
            .sort((a, b) => a.name > b.name ? 1 : -1)
            .slice(0, limitData)
            .map((val, key) => {
                return (
                    <div className="country grid__columns rounded-xl shadow-xl bg-[#0e0f11] transition duration-300 hover:scale-110 cursor-pointer" key={key}>
                        <figure className="country__flag py-6 px-4 bg-[#23252a] rounded-xl">
                            <img src={val.flag.large} alt={val.name} className='mx-auto' />
                        </figure>
                        <div className="country__details text-white p-4 rounded-xl bg-[#0e0f11]">
                            <p className="country__name text-xl sm:text-2xl text-center font-semibold">{val.name}</p>
                            <div className="mt-4 flex flex-col gap-2">
                                <p className="country__population">Population: <span className="opacity-80">{val.population}</span></p>
                                <p className="country__region">Region: <span className="opacity-80">{val.region}</span></p>
                                <p className="country__capital">Capital: <span className="opacity-80">{val.capital}</span></p>
                            </div>
                        </div>
                    </div>
                )
            })
    )
}

const Enemies = () => {
    const [loading, setLoading] = useState(true)
    const [weather, setWeather] = useState([])
    const [searchData, setSearchData] = useState([])
    const [limit, setLimit] = useState(8)
    const [err, setErr] = useState('')

    const filterValues = ['Asia', 'Africa', 'Americas', 'Antarctic', 'Europe', 'Oceania'];
    const filter = useRef('');
    const search = useRef('');

    const countryAPI = 'zWvlGTwOVuVImfHhq1HKeNBFk1CP4w0ZqGu04Rhz';
    const loadedWeather = Object.values(weather);

    useEffect(() => {
        setLoading(true);
        document.title = "Genshin Impact Database - Enemies";

        active('Enemies');

        async function getCountry() {
            setWeather([])
            setErr('')

            await fetch(`https://countryapi.io/api/all`, {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${countryAPI}`,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(weatherData => setWeather(weatherData))
                .catch(() => setErr('There was an error loading country data.'))
            setLoading(false)
        }
        getCountry();
    }, [])


    function handleFilter() {
        clearDefault()
        search.current.value = ""
        let filterQuery = filter.current.value

        if (filterQuery === "") return

        setSearchData(loadedWeather.filter(data => data.region === filterQuery))
    }

    function handleSearch() {
        clearDefault()
        let query = search.current.value.toLowerCase()
        if (query === "") return

        setSearchData(loadedWeather.filter(data => data.name.toLowerCase().indexOf(query) !== -1))
    }

    function clearDefault() {
        setSearchData([])
        setLimit(8)
    }

    if (loading === true) {
        return <Loading />
    }
    if (err !== '') {
        return <Error message={err} />
    }

    if (loadedWeather) {
        return (
            <div className='country__container'>
                <div className="flex justify-between flex-col sm:flex-row sm:items-center gap-4 mt-4">
                    <h1 className="page__title lightcolor text-4xl font-bold group">
                        Countries <span className="hidden group-hover:inline">#</span>
                    </h1>
                    <select name="region" defaultValue={""} id="region" ref={filter} onChange={handleFilter} className='cursor-pointer bg-[#23252a] py-3 px-4 w-full max-w-[350px] rounded-xl outline-none focus:outline-2 focus:outline-slate-600 text-white'>
                        <option value="" disabled>Filter by Region:</option>
                        {
                            filterValues.map((val, key) => {
                                return (
                                    <option value={val} key={key}>{val}</option>
                                )
                            })
                        }
                        <option value="">None</option>
                    </select>
                </div>
                <div className="relative search__box">
                    <input type="search"
                        name="searchCountry"
                        id="searchCountry"
                        className='bg-[#23252a] py-3 pl-12 w-full max-w-[350px] inline-block mt-4 rounded-xl outline-none focus:outline-2 focus:outline-slate-600 text-white'
                        placeholder='Search for Country...'
                        ref={search}
                        onChange={handleSearch}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/80 absolute top-7 left-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>

                <div className="country__grid grid py-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {
                        loadedWeather.length && searchData.length === 0 ?
                            <RenderCountry arr={loadedWeather} limitData={limit} />
                            :
                            <RenderCountry arr={searchData} limitData={limit} />
                    }
                </div>

                {
                    searchData.length === 0 ?
                        limit < loadedWeather.length &&
                        <button id="load"
                            className='rounded-xl lightblue py-3 px-4 mx-auto font-semibold transition duration-300 hover:bg-[#23252a] hover:text-white block w-max'
                            onClick={() => setLimit(limit + 8)}>
                            Load More
                        </button>
                        :
                        limit < searchData.length &&
                        <button id="load"
                            className='rounded-xl lightblue py-3 px-4 mx-auto font-semibold transition duration-300 hover:bg-[#23252a] hover:text-white block w-max'
                            onClick={() => setLimit(limit + 8)}>
                            Load More
                        </button>
                }
            </div>
        )
    }
}

export default Enemies