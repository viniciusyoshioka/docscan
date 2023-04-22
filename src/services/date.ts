// TODO add internationalization to return the date formatted to use location


/**
 * Get the date in format YYYY-MM-DD
 */
export function getDate(dateObject = new Date()): string {
    const year = dateObject.getFullYear()
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0")
    const day = dateObject.getDate().toString().padStart(2, "0")
    return `${year}-${month}-${day}`
}


/**
 * Get the date in format DD/MM/YYYY according to the user's location
 */
export function getLocaleDate(dateObject = new Date(), separator = "/"): string {
    const year = dateObject.getFullYear()
    const month = (dateObject.getMonth() + 1).toString().padStart(2, "0")
    const day = dateObject.getDate().toString().padStart(2, "0")
    return `${day}${separator}${month}${separator}${year}`
}


/**
 * Get the time in format HH-MM-SS
 */
export function getTime(dateObject = new Date()): string {
    const hour = dateObject.getHours().toString().padStart(2, "0")
    const minute = dateObject.getMinutes().toString().padStart(2, "0")
    const second = dateObject.getSeconds().toString().padStart(2, "0")
    return `${hour}-${minute}-${second}`
}


/**
 * Get the time in format HH:MM or HH:MM:SS according to the user's location
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
 * Get the date and time in format YYYY-MM-DD HH-MM-SS
 */
export function getDateTime(dateObject = new Date()): string {
    const date = getDate(dateObject)
    const time = getTime(dateObject)
    return `${date} ${time}`
}


/**
 * Get the date and time in format DD/MM/YYYY HH:MM or DD/MM/YYYY HH:MM:SS
 * according to the user's location
 */
export function getLocaleDateTime(dateObject = new Date(), dateSeparator = "/", timeSeparator = ":", hasSeconds = true): string {
    const date = getLocaleDate(dateObject, dateSeparator)
    const time = getLocaleTime(dateObject, timeSeparator, hasSeconds)
    return `${date} ${time}`
}


/**
 * Get the date and time, for timestamp, in ISO format
 */
export function getTimestamp(dateObject = new Date()): string {
    return dateObject.toISOString()
}
