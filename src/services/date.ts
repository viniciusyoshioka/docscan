
/**
 * Get the date in format DD/MM/YYYY
 *
 * @param separator string to be used as separator
 * between day, month and year
 * @param currentDate Date object to extract the date from.
 * If not passed, a new one will be created to get latest date.
 *
 * @returns string of the date
 */
export function getDate(separator = "/", currentDate = new Date()): string {
    const day = currentDate.getDate().toString().padStart(2, "0")
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0")
    const year = currentDate.getFullYear().toString().padStart(2, "0")

    return `${day}${separator}${month}${separator}${year}`
}


/**
 * Get the time in format HH:MM or HH:MM:SS
 *
 * @param separator string to be used as separator
 * between hour, minute and seconds (if available)
 * @param hasSecond boolean indicating if seconds will
 * be added to time string
 * @param currentDate Date object to extract the time from.
 * If not passed, a new one will be created to get latest time.
 *
 * @returns string of the time
 */
export function getTime(separator = ":", hasSecond = false, currentDate = new Date()): string {
    const hour = currentDate.getHours().toString().padStart(2, "0")
    const minute = currentDate.getMinutes().toString().padStart(2, "0")

    let localeTime = `${hour}${separator}${minute}`
    if (hasSecond) {
        const second = currentDate.getSeconds().toString().padStart(2, "0")
        localeTime += `${separator}${second}`
    }

    return localeTime
}


/**
 * Get the date time in format DD/MM/YYYY HH:MM or DD/MM/YYYY HH:MM:SS
 *
 * @param dateSeparator string to be used as separator
 * between day, month and year
 * @param timeSeparator string to be used as separator
 * between hour, minute and seconds (if available)
 * @param hasSecond boolean indicating if seconds will
 * be added to date time string
 * @param currentDate Date object to extract the date time from.
 * If not passed, a new one will be created to get latest date time.
 *
 * @returns string of the date time
 */
export function getDateTime(dateSeparator = "/", timeSeparator = ":", hasSecond = false, currentDate = new Date()): string {
    const date = getDate(dateSeparator, currentDate)
    const time = getTime(timeSeparator, hasSecond, currentDate)

    return `${date} ${time}`
}


/**
 * Get the date time, for timestamp, in format YYYY/MM/DD HH:MM:SS
 *
 * @returns string of the timestamp
 */
export function getTimestamp(): string {
    const currentDate = new Date()

    const day = currentDate.getDate().toString().padStart(2, "0")
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0")
    const year = currentDate.getFullYear().toString().padStart(2, "0")

    const hour = currentDate.getHours().toString().padStart(2, "0")
    const minute = currentDate.getMinutes().toString().padStart(2, "0")
    const second = currentDate.getSeconds().toString().padStart(2, "0")

    return `${year}/${month}/${day} ${hour}:${minute}:${second}`
}


/**
 * Get the date time string of the given timestamp
 *
 * @param timestamp string
 *
 * @returns string of the date time in format DD/MM/YYYY HH:MM
 */
export function toDateTime(timestamp: string): string {
    return getDateTime("/", ":", false, new Date(timestamp))
}
