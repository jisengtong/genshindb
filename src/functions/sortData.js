export default function sortData(order, data, key, setData) {
    let sorted = []

    if (order) {
        sorted = data.sort((a, b) => Number(a[key]) > Number(b[key]) ? -1 : 1)
    }
    if (!order) {
        sorted = data.sort((a, b) => Number(a[key]) < Number(b[key]) ? -1 : 1)
    }
    setData(sorted.map(sortedData => sortedData))
}