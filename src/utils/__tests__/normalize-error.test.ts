import { normalizeError } from "../normalize-error"


describe("normalizeError", () => {
  it("should return an Error instance with the same string that it received in message property", () => {
    const errorString = "Error message as string"
    const result = normalizeError(errorString)

    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe(errorString)
  })

  it("should return an Error instance with the same message of given Error", () => {
    const error = new Error("Error message as instance of Error class")
    const result = normalizeError(error)

    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe(error.message)
  })

  it("should return an Error instance with stringified object error in message property", () => {
    const error = { message: "Error message as object" }
    const result = normalizeError(error)

    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe(JSON.stringify(error))
  })

  it("should return an Error instance with given error stringified in message property", () => {
    const error = /^Error RegEx$/
    const result = normalizeError(error)

    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe(String(error))
  })
})
