import { CameraRatio } from "@libs/settings"
import { getCameraRatioNumber } from "../get-camera-ratio-number"


describe("Test getCameraRatioNumber", () => {
  it("should return the correct ratio number for '4:3' ratio", () => {
    const ratioNumber = getCameraRatioNumber(CameraRatio.RATIO_4_3)
    expect(ratioNumber).toBeCloseTo(4 / 3)
  })

  it("should return the correct ratio number for '16:9' ratio", () => {
    const ratioNumber = getCameraRatioNumber(CameraRatio.RATIO_16_9)
    expect(ratioNumber).toBeCloseTo(16 / 9)
  })

  it("should throw when an invalid ratio is passed", () => {
    expect(() => getCameraRatioNumber("invalid" as CameraRatio))
      .toThrow('Invalid camera ratio provided: "invalid"')
  })
})
