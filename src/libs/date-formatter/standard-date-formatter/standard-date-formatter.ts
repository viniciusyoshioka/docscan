import { TimeUtils } from "@utils"
import { DateFormatter } from "../date-formatter.interface"
import { DateTimeSeparators, StandardDateFormatterOptions } from "./standard-date-formatter.types"


type ParseableDate = Date | number | string

type DateTimePatterns = {
  date: string
  time: string
  timWithSeconds: string
}


const defaultPatterns: DateTimePatterns = {
  date: "YYYY-mm-dd",
  time: "HH:MM",
  timWithSeconds: "HH:MM:SS",
}

const defaultSeparators: DateTimeSeparators = {
  date: "-",
  time: ":",
}


export class StandardDateFormatter implements DateFormatter {


  private readonly locales: undefined | string | string[]
  private readonly patterns: DateTimePatterns = defaultPatterns
  private readonly separators: DateTimeSeparators
  private readonly hasSeconds: boolean


  constructor(options?: StandardDateFormatterOptions) {
    const {
      locales = undefined,
      separators = defaultSeparators,
      hasSeconds = false,
    } = options ?? {}

    this.locales = locales
    this.separators = separators
    this.hasSeconds = hasSeconds
  }


  formatDate(date?: ParseableDate): string {
    date = this.parseDate(date)

    return this.patterns.date
      .substring(0)
      .replace("YYYY", this.formatNumber(date.getFullYear()))
      .replace("mm", this.formatNumber(date.getMonth() + 1))
      .replace("dd", this.formatNumber(date.getDate()))
      .replaceAll("-", this.separators.date)
  }

  formatTime(date?: ParseableDate): string {
    date = this.parseDate(date)

    return (this.hasSeconds ? this.patterns.timWithSeconds : this.patterns.time)
      .substring(0)
      .replace("HH", this.formatNumber(date.getHours()))
      .replace("MM", this.formatNumber(date.getMinutes()))
      .replace("SS", this.formatNumber(date.getSeconds()))
      .replaceAll(":", this.separators.time)
  }

  formatDateTime(date?: ParseableDate): string {
    date = this.parseDate(date)

    const datePart = this.formatDate(date)
    const timePart = this.formatTime(date)

    return `${datePart} ${timePart}`
  }


  getLocaleDate(date?: ParseableDate): string {
    date = this.parseDate(date)

    const options: Intl.DateTimeFormatOptions = {}
    const dateTimeFormat = new Intl.DateTimeFormat(this.locales, options)
    return dateTimeFormat.format(date)
  }

  getLocaleTime(date?: ParseableDate): string {
    date = this.parseDate(date)

    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: this.hasSeconds ? "2-digit" : undefined,
    }

    const dateTimeFormat = new Intl.DateTimeFormat(this.locales, options)
    return dateTimeFormat.format(date)
  }

  getLocaleDateTime(date?: ParseableDate): string {
    date = this.parseDate(date)

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: this.hasSeconds ? "2-digit" : undefined,
    }

    const dateTimeFormat = new Intl.DateTimeFormat(this.locales, options)
    return dateTimeFormat.format(date).replace(",", "")
  }


  private parseDate(date?: ParseableDate): Date {
    if (date instanceof Date) {
      return date
    }
    if (typeof date === "number") {
      return new Date(date)
    }
    if (typeof date === "string") {
      const parsedDate = new Date(date)

      const timezoneOffset = parsedDate.getTimezoneOffset()
      const timezoneOffsetInMs = TimeUtils.minutesToMilliseconds(timezoneOffset)
      const timeAfterTimezoneCorrection = parsedDate.getTime() - timezoneOffsetInMs
      parsedDate.setTime(timeAfterTimezoneCorrection)

      return parsedDate
    }
    return new Date()
  }

  private formatNumber(value: number): string {
    return value.toString().padStart(2, "0")
  }
}
