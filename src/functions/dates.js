export const getYMD_HMS = (ms) => {
    return `${ms.getFullYear()}/${(ms.getMonth() + 1).toString().padStart(2, '0')}/${ms.getDate().toString().padStart(2, '0')} - ${ms.getHours().toString().padStart(2, '0')}:${ms.getMinutes().toString().padStart(2, '0')}:${ms.getSeconds().toString().padStart(2, '0')}`
}

export const getIntervalTimeLeft = (ms) => {
    const seconds = Math.floor((ms / 1000) % 60)
    const minutes = Math.floor((ms / 60000) % 60)
    const hours = Math.floor((ms / 3600000) % 24)
    const days = Math.floor((ms / 86400000) % 365)
    const TimeLeft = `${days.toString().padStart(2, '0')}d ${hours.toString().padStart(2, '0')}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`
    return TimeLeft
}
