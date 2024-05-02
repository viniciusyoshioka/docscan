import { StandardDateFormatter } from "@lib/date-formatter"


describe("Test StandardDateFormatter separators option", () => {


  const dateFormatter = new StandardDateFormatter({
    locales: "pt-br",
    separators: {
      date: "_",
      time: ".",
    },
  })

  const dateRegex = /^\d{4}_\d{2}_\d{2}$/
  const timeRegex = /^\d{2}.\d{2}$/
  const dateTimeRegex = /^\d{4}_\d{2}_\d{2} \d{2}.\d{2}$/

  const customDateTime = new Date("2000-01-30 11:30:25")
  const expectedDate = "2000_01_30"
  const expectedTime = "11.30"
  const expectedDateTime = `${expectedDate} ${expectedTime}`


  describe("formatDate", () => {
    it("should format the date correctly using current date", () => {
      const formattedDate = dateFormatter.formatDate()
      expect(formattedDate).toMatch(dateRegex)
    })

    it("should format the date correctly passing timestamp", () => {
      const timestamp = customDateTime.getTime()
      const formattedDate = dateFormatter.formatDate(timestamp)
      expect(formattedDate).toBe(expectedDate)
    })

    it("should format the date correctly passing Date object", () => {
      const formattedDate = dateFormatter.formatDate(customDateTime)
      expect(formattedDate).toBe(expectedDate)
    })
  })

  describe("formatTime", () => {
    it("should format the time correctly using current date", () => {
      const formattedTime = dateFormatter.formatTime()
      expect(formattedTime).toMatch(timeRegex)
    })

    it("should format the time correctly passing timestamp", () => {
      const timestamp = customDateTime.getTime()
      const formattedTime = dateFormatter.formatTime(timestamp)
      expect(formattedTime).toBe(expectedTime)
    })

    it("should format the time correctly passing Date object", () => {
      const formattedTime = dateFormatter.formatTime(customDateTime)
      expect(formattedTime).toBe(expectedTime)
    })
  })

  describe("formatDateTime", () => {
    it("should format the datetime correctly using current date", () => {
      const formattedDateTime = dateFormatter.formatDateTime()
      expect(formattedDateTime).toMatch(dateTimeRegex)
    })

    it("should format the datetime correctly passing timestamp", () => {
      const timestamp = customDateTime.getTime()
      const formattedDateTime = dateFormatter.formatDateTime(timestamp)
      expect(formattedDateTime).toBe(expectedDateTime)
    })

    it("should format the datetime correctly passing Date object", () => {
      const formattedDateTime = dateFormatter.formatDateTime(customDateTime)
      expect(formattedDateTime).toBe(expectedDateTime)
    })
  })
})
