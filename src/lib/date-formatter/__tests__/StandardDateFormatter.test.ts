import { StandardDateFormatter } from "@lib/date-formatter"


describe("StandardDateFormatter is instantiated with default options", () => {


  const dateFormatter = new StandardDateFormatter()


  it("formatDate should not throw", () => {
    expect(() => dateFormatter.formatDate()).not.toThrow()
  })

  it("formatTime should not throw", () => {
    expect(() => dateFormatter.formatTime()).not.toThrow()
  })

  it("formatDateTime should not throw", () => {
    expect(() => dateFormatter.formatDateTime()).not.toThrow()
  })
})
