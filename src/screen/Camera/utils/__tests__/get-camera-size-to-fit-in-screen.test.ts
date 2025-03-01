import { CameraRatio } from "@libs/settings"
import { getCameraSizeToFitInScreen, Size } from "../get-camera-size-to-fit-in-screen"


describe("Test getCameraSizeToFitInScreen", () => {


  const screenSize: Size = {
    width: 360,
    height: 770.66,
  }


  it("should return the correct camera size to fit in screen for '4:3' ratio", () => {
    const cameraRatio: CameraRatio = "4:3"
    const cameraSize = getCameraSizeToFitInScreen(screenSize, cameraRatio)

    expect(cameraSize).toEqual({
      width: 360,
      height: 480,
    })
  })

  it("should return the correct camera size to fit in screen for '16:9' ratio", () => {
    const cameraRatio: CameraRatio = "16:9"
    const cameraSize = getCameraSizeToFitInScreen(screenSize, cameraRatio)

    expect(cameraSize).toEqual({
      width: 360,
      height: 640,
    })
  })

  it("should throw when passing invalid camera ratio", () => {
    const cameraRatio = "invalid" as CameraRatio

    expect(() => getCameraSizeToFitInScreen(screenSize, cameraRatio))
      .toThrow('Invalid camera ratio provided: "invalid"')
  })
})
