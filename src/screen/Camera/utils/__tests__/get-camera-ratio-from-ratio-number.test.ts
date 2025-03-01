import { getCameraRatioFromRatioNumber } from "../get-camera-ratio-from-ratio-number"


describe("Test getCameraRatioFromRatioNumber", () => {
  it("should return '4:3' camera ratio for its respective ratio number", () => {
    const ratioNumber = 4 / 3
    const cameraRatio = getCameraRatioFromRatioNumber(ratioNumber)
    expect(cameraRatio).toBe("4:3")
  })

  it("should return '16:9' camera ratio for its respective ratio number", () => {
    const ratioNumber = 16 / 9
    const cameraRatio = getCameraRatioFromRatioNumber(ratioNumber)
    expect(cameraRatio).toBe("16:9")
  })

  it("should throw when an invalid ratio number is passed", () => {
    const ratioNumber = 21 / 9
    expect(() => getCameraRatioFromRatioNumber(ratioNumber))
      .toThrow(`Ratio number "${ratioNumber}" is not supported.`)
  })
})
