import { StandardDateFormatter } from "@lib/date-formatter"


describe("Test StandardDateFormatter with locale option", () => {


  const dateObject = new Date("2000-01-30 08:25:51")
  const dateRegex = /^\d{1,2}(\/|\.)\d{1,2}(\/|\.)\d{4}$/
  const timeRegex = /^\d{1,2}:\d{2}( AM| PM)?$/
  const dateTimeRegex = /^\d{2}(\/|\.)\d{2}(\/|\.)\d{4} \d{1,2}:\d{2}( AM| PM)?$/


  describe("getLocaleDate", () => {
    const localesData = [
      { locale: undefined, value: dateRegex },
      { locale: "en-US", value: "1/30/2000" },
      { locale: "pt-BR", value: "30/01/2000" },
      { locale: "?", error: true },
      { locale: "invalid-value", value: dateRegex },
      { locale: ["en-US", "pt-BR"], value: "1/30/2000" },
      { locale: ["?", "pt-BR", "en-US"], error: true },
      { locale: ["invalid-value", "pt-BR", "en-US"], value: "30/01/2000" },
    ]


    localesData.forEach(({ locale, value, error }) => {
      const dateFormatter = new StandardDateFormatter({ locales: locale })

      it(`should handle ${locale} using current date`, () => {
        if (error === true) {
          expect(() => dateFormatter.getLocaleDate()).toThrow(RangeError)
          return
        }

        if (value !== undefined) {
          const formattedDate = dateFormatter.getLocaleDate()
          expect(formattedDate).toMatch(dateRegex)
          return
        }

        throw new Error("Unexpected test case")
      })

      it(`should handle ${locale} using timestamp`, () => {
        const timestamp = dateObject.getTime()

        if (error === true) {
          expect(() => dateFormatter.getLocaleDate(timestamp)).toThrow(RangeError)
          return
        }

        if (value !== undefined) {
          const formattedDate = dateFormatter.getLocaleDate(timestamp)
          if (value instanceof RegExp) {
            expect(formattedDate).toMatch(value)
          } else {
            expect(formattedDate).toBe(value)
          }
          return
        }

        throw new Error("Unexpected test case")
      })

      it(`should handle ${locale} using date object`, () => {
        if (error === true) {
          expect(() => dateFormatter.getLocaleDate(dateObject)).toThrow(RangeError)
          return
        }

        if (value !== undefined) {
          const formattedDate = dateFormatter.getLocaleDate(dateObject)
          if (value instanceof RegExp) {
            expect(formattedDate).toMatch(value)
          } else {
            expect(formattedDate).toBe(value)
          }
          return
        }

        throw new Error("Unexpected test case")
      })
    })
  })

  describe("getLocaleTime", () => {
    const localesData = [
      { locale: undefined, value: timeRegex },
      { locale: "en-US", value: "08:25 AM" },
      { locale: "pt-BR", value: "08:25" },
      { locale: "?", error: true },
      { locale: "invalid-value", value: timeRegex },
      { locale: ["en-US", "pt-BR"], value: "08:25 AM" },
      { locale: ["?", "pt-BR", "en-US"], error: true },
      { locale: ["invalid-value", "pt-BR", "en-US"], value: "08:25" },
    ]


    localesData.forEach(({ locale, value, error }) => {
      const dateFormatter = new StandardDateFormatter({ locales: locale })

      it(`should handle ${locale} using current date`, () => {
        if (error === true) {
          expect(() => dateFormatter.getLocaleTime()).toThrow(RangeError)
          return
        }

        if (value !== undefined) {
          const formattedTime = dateFormatter.getLocaleTime()
          expect(formattedTime).toMatch(timeRegex)
          return
        }

        throw new Error("Unexpected test case")
      })

      it(`should handle ${locale} using timestamp`, () => {
        const timestamp = dateObject.getTime()
        if (error === true) {
          expect(() => dateFormatter.getLocaleTime(timestamp)).toThrow(RangeError)
          return
        }

        if (value !== undefined) {
          const formattedTime = dateFormatter.getLocaleTime(timestamp)
          if (value instanceof RegExp) {
            expect(formattedTime).toMatch(value)
          } else {
            expect(formattedTime).toBe(value)
          }
          return
        }

        throw new Error("Unexpected test case")
      })

      it(`should handle ${locale} using date object`, () => {
        if (error === true) {
          expect(() => dateFormatter.getLocaleTime(dateObject)).toThrow(RangeError)
          return
        }

        if (value !== undefined) {
          const formattedTime = dateFormatter.getLocaleTime(dateObject)
          if (value instanceof RegExp) {
            expect(formattedTime).toMatch(value)
          } else {
            expect(formattedTime).toBe(value)
          }
          return
        }

        throw new Error("Unexpected test case")
      })
    })
  })

  describe("getLocaleDateTime", () => {
    const localesData = [
      { locale: undefined, value: dateTimeRegex },
      { locale: "en-US", value: "01/30/2000 08:25 AM" },
      { locale: "pt-BR", value: "30/01/2000 08:25" },
      { locale: "?", error: true },
      { locale: "invalid-value", value: dateTimeRegex },
      { locale: ["en-US", "pt-BR"], value: "01/30/2000 08:25 AM" },
      { locale: ["?", "pt-BR", "en-US"], error: true },
      { locale: ["invalid-value", "pt-BR", "en-US"], value: "30/01/2000 08:25" },
    ]


    localesData.forEach(({ locale, value, error }) => {
      const dateFormatter = new StandardDateFormatter({ locales: locale })

      it(`should handle ${locale} using current date`, () => {
        if (error === true) {
          expect(() => dateFormatter.getLocaleDateTime()).toThrow(RangeError)
          return
        }

        if (value !== undefined) {
          const formattedDateTime = dateFormatter.getLocaleDateTime()
          expect(formattedDateTime).toMatch(dateTimeRegex)
          return
        }

        throw new Error("Unexpected test case")
      })

      it(`should handle ${locale} using timestamp`, () => {
        const timestamp = dateObject.getTime()
        if (error === true) {
          expect(() => dateFormatter.getLocaleDateTime(timestamp)).toThrow(RangeError)
          return
        }

        if (value !== undefined) {
          const formattedDateTime = dateFormatter.getLocaleDateTime(timestamp)
          if (value instanceof RegExp) {
            expect(formattedDateTime).toMatch(value)
          } else {
            expect(formattedDateTime).toBe(value)
          }
          return
        }

        throw new Error("Unexpected test case")
      })

      it(`should handle ${locale} using date object`, () => {
        if (error === true) {
          expect(() => dateFormatter.getLocaleDateTime(dateObject)).toThrow(RangeError)
          return
        }

        if (value !== undefined) {
          const formattedDateTime = dateFormatter.getLocaleDateTime(dateObject)
          if (value instanceof RegExp) {
            expect(formattedDateTime).toMatch(value)
          } else {
            expect(formattedDateTime).toBe(value)
          }
          return
        }

        throw new Error("Unexpected test case")
      })
    })
  })
})
