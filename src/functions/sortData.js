export default function sortData(order, data, key, setData) {
    let sorted = []

    if (order) {
        sorted = data.sort((a, b) => Number(b[key]) - Number(a[key]))
    }
    if (!order) {
        sorted = data.sort((a, b) => Number(a[key]) - Number(b[key]))
    }
    setData([...sorted])
}