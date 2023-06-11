import PageTitle from './PageTitle'

const Container = ({ titleIcon, title, searchInput, searchInputHandler, searchPlaceholder, setSort, order, gridData }) => {
    return (
        <div className='container__grid'>
            <div className="flex justify-between flex-col md:flex-row md:items-center gap-4 mt-4 sticky top-8 sm:relative sm:top-0 z-50">
                <PageTitle title={title} />
                <div className="search__box w-full md:max-w-[350px] relative">
                    <input type="search"
                        name="searchCharacter"
                        id="searchCharacter"
                        className='bg-[#23252a] py-3 pl-12 inline-block w-full mt-4 rounded-xl outline-none focus:outline-4 focus:outline-slate-500 text-white'
                        placeholder={searchPlaceholder}
                        ref={searchInput}
                        onChange={searchInputHandler}
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white/80 absolute top-7 left-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
            </div>
            <div className="filter mt-4 md:mt-0">
                <button className='text-white py-3 px-6 rounded-lg flex items-center justify-between gap-2 bg-[#23252a] w-full md:w-fit' onClick={setSort}>
                    Sort by Rarity
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-6 h-6 ${order ? '' : 'rotate-180 '}`}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18" />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 lg:grid-cols-7 gap-4 py-8">
                {gridData}
            </div>
        </div>
    )
}

export default Container