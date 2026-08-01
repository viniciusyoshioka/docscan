import { TimeUtils } from '../time-utils.ts'


describe('TimeUtils', () => {
  describe('minutesToMilliseconds', () => {
    it('should convert minutes to milliseconds correctly', () => {

      const ZERO_MINUTES_IN_MILLISECONDS = 0 * 60 * 1000
      const ONE_MINUTE_IN_MILLISECONDS = 1 * 60 * 1000
      const TWO_POINT_FIVE_MINUTES_IN_MILLISECONDS = 2.5 * 60 * 1000

      expect(
        TimeUtils.minutesToMilliseconds(0),
      ).toBe(ZERO_MINUTES_IN_MILLISECONDS)
      expect(
        TimeUtils.minutesToMilliseconds(1),
      ).toBe(ONE_MINUTE_IN_MILLISECONDS)
      expect(
        TimeUtils.minutesToMilliseconds(2.5),
      ).toBe(TWO_POINT_FIVE_MINUTES_IN_MILLISECONDS)
    })
  })
})
