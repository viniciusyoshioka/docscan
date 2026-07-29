
export type DateTimeSeparators = {
  date: string
  time: string
}


export type StandardDateFormatterOptions = {
  locales?: string | string[]
  separators?: DateTimeSeparators
  hasSeconds?: boolean
}
