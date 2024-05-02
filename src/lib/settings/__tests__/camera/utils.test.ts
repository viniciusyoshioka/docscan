import { CameraRatio, getCameraRatioNumber } from "@lib/settings"


describe("Test camera utils from settings module", () => {
  it("should return the correct ratio number for 4:3 ratio arg", () => {
    const ratioNumber = getCameraRatioNumber("4:3")
    expect(ratioNumber).toBeCloseTo(4 / 3)
  })

  it("should return the correct ratio number for 16:9 ratio arg", () => {
    const ratioNumber = getCameraRatioNumber("16:9")
    expect(ratioNumber).toBeCloseTo(16 / 9)
  })

  it("should throw when invalid ratio arg is passed", () => {
    expect(() => getCameraRatioNumber("invalid" as CameraRatio))
      .toThrow("Invalid ratio provided")
  })
})
