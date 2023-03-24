export default function search(data, setSearched, elem, setToggleAsc) {
    // Reset sorting order
    setToggleAsc(true)

    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'instant'
    })
    setSearched([])
    let query = elem.toLowerCase()
    if (query === "") return

    setSearched(data.filter(datas => datas.name.toLowerCase().indexOf(query) !== -1))
}
