import { StandardDateFormatter } from "@lib/date-formatter"


describe.each([false, true])(
  "Test StandardDateFormatter with hasSeconds option %d",
  hasSeconds => {


    const dateFormatter = new StandardDateFormatter({ locales: "pt-br", hasSeconds })
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/
    const timeRegex = /^\d{2}:\d{2}(:\d{2})?$/
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/
    const localeDateRegex = /^\d{2}\/\d{2}\/\d{4}$/
    const localeTimeRegex = /^\d{2}:\d{2}(:\d{2})?$/
    const localeDateTimeRegex = /^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}(:\d{2})?$/

    const customDateTime = new Date("2000-01-30 11:30:25")
    const expectedDate = "2000-01-30"
    const expectedTime = hasSeconds ? "11:30:25" : "11:30"
    const expectedDateTime = `${expectedDate} ${expectedTime}`
    const expectedLocaleDate = "30/01/2000"
    const expectedLocaleTime = hasSeconds ? "11:30:25" : "11:30"
    const expectedLocaleDateTime = `${expectedLocaleDate} ${expectedLocaleTime}`


    describe("formatDate", () => {
      it(`should format the date correctly with hasSeconds=${hasSeconds} using current date`, () => {
        const formattedDate = dateFormatter.formatDate()
        expect(formattedDate).toMatch(dateRegex)
      })

      it(`should format the date correctly with hasSeconds=${hasSeconds} passing timestamp`, () => {
        const timestamp = customDateTime.getTime()
        const formattedDate = dateFormatter.formatDate(timestamp)
        expect(formattedDate).toBe(expectedDate)
      })

      it(`should format the date correctly with hasSeconds=${hasSeconds} passing Date object`, () => {
        const formattedDate = dateFormatter.formatDate(customDateTime)
        expect(formattedDate).toBe(expectedDate)
      })
    })

    describe("formatTime", () => {
      it(`should format the time correctly with hasSeconds=${hasSeconds} using current date`, () => {
        const formattedTime = dateFormatter.formatTime()
        expect(formattedTime).toMatch(timeRegex)
      })

      it(`should format the time correctly with hasSeconds=${hasSeconds} passing timestamp`, () => {
        const timestamp = customDateTime.getTime()
        const formattedTime = dateFormatter.formatTime(timestamp)
        expect(formattedTime).toBe(expectedTime)
      })

      it(`should format the time correctly with hasSeconds=${hasSeconds} passing Date object`, () => {
        const formattedTime = dateFormatter.formatTime(customDateTime)
        expect(formattedTime).toBe(expectedTime)
      })
    })

    describe("formatDateTime", () => {
      it(`should format the datetime correctly with hasSeconds=${hasSeconds} using current date`, () => {
        const formattedDateTime = dateFormatter.formatDateTime()
        expect(formattedDateTime).toMatch(dateTimeRegex)
      })

      it(`should format the datetime correctly with hasSeconds=${hasSeconds} passing timestamp`, () => {
        const timestamp = customDateTime.getTime()
        const formattedDateTime = dateFormatter.formatDateTime(timestamp)
        expect(formattedDateTime).toBe(expectedDateTime)
      })

      it(`should format the datetime correctly with hasSeconds=${hasSeconds} passing Date object`, () => {
        const formattedDateTime = dateFormatter.formatDateTime(customDateTime)
        expect(formattedDateTime).toBe(expectedDateTime)
      })
    })


    describe("getLocaleDate", () => {
      it(`should format the locale date correctly with hasSeconds=${hasSeconds} using current date`, () => {
        const formattedDate = dateFormatter.getLocaleDate()
        expect(formattedDate).toMatch(localeDateRegex)
      })

      it(`should format the locale date correctly with hasSeconds=${hasSeconds} passing timestamp`, () => {
        const timestamp = customDateTime.getTime()
        const formattedDate = dateFormatter.getLocaleDate(timestamp)
        expect(formattedDate).toBe(expectedLocaleDate)
      })

      it(`should format the locale date correctly with hasSeconds=${hasSeconds} passing Date object`, () => {
        const formattedDate = dateFormatter.getLocaleDate(customDateTime)
        expect(formattedDate).toBe(expectedLocaleDate)
      })
    })

    describe("getLocaleTime", () => {
      it(`should format the locale time correctly with hasSeconds=${hasSeconds} using current date`, () => {
        const formattedTime = dateFormatter.getLocaleTime()
        expect(formattedTime).toMatch(localeTimeRegex)
      })

      it(`should format the locale time correctly with hasSeconds=${hasSeconds} passing timestamp`, () => {
        const timestamp = customDateTime.getTime()
        const formattedTime = dateFormatter.getLocaleTime(timestamp)
        expect(formattedTime).toBe(expectedLocaleTime)
      })

      it(`should format the locale time correctly with hasSeconds=${hasSeconds} passing Date object`, () => {
        const formattedTime = dateFormatter.getLocaleTime(customDateTime)
        expect(formattedTime).toBe(expectedLocaleTime)
      })
    })

    describe("getLocaleDateTime", () => {
      it(`should format the locale datetime correctly with hasSeconds=${hasSeconds} using current date`, () => {
        const formattedDateTime = dateFormatter.getLocaleDateTime()
        expect(formattedDateTime).toMatch(localeDateTimeRegex)
      })

      it(`should format the locale datetime correctly with hasSeconds=${hasSeconds} passing timestamp`, () => {
        const timestamp = customDateTime.getTime()
        const formattedDateTime = dateFormatter.getLocaleDateTime(timestamp)
        expect(formattedDateTime).toBe(expectedLocaleDateTime)
      })

      it(`should format the locale datetime correctly with hasSeconds=${hasSeconds} passing Date object`, () => {
        const formattedDateTime = dateFormatter.getLocaleDateTime(customDateTime)
        expect(formattedDateTime).toBe(expectedLocaleDateTime)
      })
    })
  }
)
