const Lists = ({ title, data }) => {
    return (
        <div className="mt-8">
            <p className='text-lg'><span className="font-bold">{title} </span> </p>
            <ul className='list-disc flex flex-col gap-2 px-4 mt-2'>
                {
                    data?.map((banners, key) => {
                        return <li key={key}>{banners.name}</li>
                    })
                }
            </ul>
        </div>
    )
}

export default Lists