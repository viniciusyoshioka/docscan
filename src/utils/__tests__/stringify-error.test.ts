import { stringifyError } from "../stringify-error"


describe("stringifyError", () => {
  it("should return the same string when it receives one", () => {
    const errorString = "Error message in string"
    const result = stringifyError(errorString)

    expect(typeof result).toBe("string")
    expect(result).toBe(errorString)
  })

  it("should return an string when receives an Error object", () => {
    const error = new Error("Error message as instance of Error class")
    const result = stringifyError(error)

    expect(typeof result).toBe("string")
    expect(result).toBe(error.message)
  })

  it("should return a stringified object when receives an object", () => {
    const error = { message: "Error message as object" }
    const result = stringifyError(error)

    expect(typeof result).toBe("string")
    expect(result).toBe(JSON.stringify(error))
  })

  it("should return the error when receives another type of error", () => {
    const error = /^Error RegEx$/
    const result = stringifyError(error)

    expect(typeof result).not.toBe("string")
    expect(result).toBe(error)
  })
})
