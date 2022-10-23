
/**
 * Get the date in format YYYY-MM-DD
 *
 * @param dateObject Date object to extract the date from. Defaults to `new Date()`
 *
 * @returns string of the date
 */
export function getDate(dateObject = new Date()): string {
    const year = dateObject.getFullYear()
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0")
    const day = dateObject.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
}


/**
 * Get the date in format DD/MM/YYYY.
 * It is used to return the date formatted according to the user's location
 *
 * @param dateObject Date object to extract the date from. Defaults to `new Date()`
 * @param separator string that will be between each date component. Defaults to `/`
 *
 * @returns string of the date
 */
export function getLocaleDate(dateObject = new Date(), separator = "/"): string {
    const year = dateObject.getFullYear()
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0")
    const day = dateObject.getDate().toString().padStart(2, "0")
    return `${day}${separator}${month}${separator}${year}`
}


/**
 * Get the time in format HH:MM:SS
 *
 * @param dateObject Date object to extract the time from. Defaults to `new Date()`
 *
 * @returns string of the time
 */
function getTime(dateObject = new Date()): string {
    const hour = dateObject.getHours().toString().padStart(2, "0")
    const minute = dateObject.getMinutes().toString().padStart(2, "0")
    const second = dateObject.getSeconds().toString().padStart(2, "0")
    return `${hour}:${minute}:${second}`
}


/**
 * Get the time in format HH:MM or HH:MM:SS
 * It is used to return the time formatted according to the user's location
 *
 * @param dateObject Date object to extract the time from. Defaults to `new Date()`
 * @param separator string that will be between each time component. Defaults to `:`
 * @param hasSeconds boolean indicating whether seconds are used. Defaults to `true`
 *
 * @returns string of the time
 */
export function getLocaleTime(dateObject = new Date(), separator = ":", hasSeconds = true): string {
    const hour = dateObject.getHours().toString().padStart(2, "0")
    const minute = dateObject.getMinutes().toString().padStart(2, "0")
    let time = `${hour}${separator}${minute}`
    if (!hasSeconds) {
        return time
    }

    const second = dateObject.getSeconds().toString().padStart(2, "0")
    time += `${separator}${second}`
    return time
}


/**
 * Get the date and time in format YYYY-MM-DD HH:MM:SS
 *
 * @param dateObject Date object to extract the date and time from. Defaults to `new Date()`
 *
 * @returns string of the date and time
 */
export function getDateTime(dateObject = new Date()): string {
    const date = getDate(dateObject)
    const time = getTime(dateObject)
    return `${date} ${time}`
}


/**
 * Get the date and time in format DD/MM/YYYY HH:MM or DD/MM/YYYY HH:MM:SS
 * It is used to return the date and time formatted according to the user's location
 *
 * @param dateObject Date object to extract the date and time from. Defaults to `new Date()`
 * @param dateSeparator string that will be between each date component. Defaults to `/`
 * @param timeSeparator string that will be between each time component. Defaults to `:`
 * @param hasSeconds boolean indicating whether seconds are used. Defaults to `true`
 *
 * @returns string of the date and time
 */
export function getLocaleDateTime(dateObject = new Date(), dateSeparator = "/", timeSeparator = ":", hasSeconds = true): string {
    const date = getLocaleDate(dateObject, dateSeparator)
    const time = getLocaleTime(dateObject, timeSeparator, hasSeconds)
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
    return getDateTime(new Date(timestamp))
}
