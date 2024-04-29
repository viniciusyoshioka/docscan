import { IDateFormatter } from "../interfaces"
import { DateTimeSeparators, StandardDateFormatterOptions } from "./types"


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


export class StandardDateFormatter implements IDateFormatter {


  private locales: undefined | string | string[]
  private patterns: DateTimePatterns = defaultPatterns
  private separators: DateTimeSeparators
  private hasSeconds: boolean


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


  public formatDate(date?: Date | number): string {
    date = this.parseDate(date)

    return this.patterns.date
      .substring(0)
      .replace("YYYY", this.formatNumber(date.getFullYear()))
      .replace("mm", this.formatNumber(date.getMonth() + 1))
      .replace("dd", this.formatNumber(date.getDate()))
      .replace("-", this.separators.date)
  }

  public formatTime(date?: Date | number): string {
    date = this.parseDate(date)

    return (this.hasSeconds ? this.patterns.timWithSeconds : this.patterns.time)
      .substring(0)
      .replace("HH", this.formatNumber(date.getHours()))
      .replace("MM", this.formatNumber(date.getMinutes()))
      .replace("SS", this.formatNumber(date.getSeconds()))
      .replace(":", this.separators.time)
  }

  public formatDateTime(date?: Date | number): string {
    date = this.parseDate(date)

    const datePart = this.formatDate(date)
    const timePart = this.formatTime(date)

    return `${datePart} ${timePart}`
  }


  public getLocaleDate(date?: Date | number): string {
    date = this.parseDate(date)

    const options: Intl.DateTimeFormatOptions = {}
    const dateTimeFormat = new Intl.DateTimeFormat(this.locales, options)
    return dateTimeFormat.format(date)
  }

  public getLocaleTime(date?: Date | number): string {
    date = this.parseDate(date)

    const options: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
      second: this.hasSeconds ? "2-digit" : undefined,
    }

    const dateTimeFormat = new Intl.DateTimeFormat(this.locales, options)
    return dateTimeFormat.format(date)
  }

  public getLocaleDateTime(date?: Date | number): string {
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


  private parseDate(date?: Date | number): Date {
    if (date instanceof Date) {
      return date
    }
    if (typeof date === "number") {
      return new Date(date)
    }
    return new Date()
  }

  private formatNumber(value: number): string {
    return value.toString().padStart(2, "0")
  }
}
