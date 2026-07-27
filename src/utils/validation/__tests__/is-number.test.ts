import type { IsNumberOptions } from '../is-number.ts'
import { isNumber } from '../is-number.ts'


const allowAll: IsNumberOptions = {
  allowPositive: true,
  allowNegative: true,
  allowZero: true,
  allowFloat: true,
  allowNaN: true,
  allowInfinite: true,
}

const disallowAll: IsNumberOptions = {
  allowPositive: false,
  allowNegative: false,
  allowZero: false,
  allowFloat: false,
  allowNaN: false,
  allowInfinite: false,
}


describe('isNumber', () => {
  it('should handle data types other than number', () => {
    const values = [
      undefined,
      null,
      'string',
      false,
      true,
      [],
      {},
      () => {},
    ]

    values.forEach(value => {
      const isValid = isNumber(value, allowAll)
      expect(isValid).toBe(false)
    })
  })

  describe('allowNegative', () => {
    const value = -1

    it('should allow when true', () => {
      const isValid = isNumber(value, {
        ...disallowAll,
        allowNegative: true,
      })

      expect(isValid).toBe(true)
    })

    it('should not allow when false', () => {
      const isValid = isNumber(value, {
        ...disallowAll,
        allowNegative: false,
      })

      expect(isValid).toBe(false)
    })

    it('should not allow when not specified', () => {
      const isValid = isNumber(value)

      expect(isValid).toBe(false)
    })
  })

  describe('allowPositive', () => {
    const value = 1

    it('should allow when true', () => {
      const isValid = isNumber(value, {
        ...disallowAll,
        allowPositive: true,
      })

      expect(isValid).toBe(true)
    })

    it('should not allow when false', () => {
      const isValid = isNumber(value, {
        ...disallowAll,
        allowPositive: false,
      })

      expect(isValid).toBe(false)
    })

    it('should not allow when not specified', () => {
      const isValid = isNumber(value)

      expect(isValid).toBe(false)
    })
  })

  describe('allowZero', () => {
    const value = 0

    it('should allow when true', () => {
      const isValid = isNumber(value, {
        ...disallowAll,
        allowZero: true,
      })

      expect(isValid).toBe(true)
    })

    it('should not allow when false', () => {
      const isValid = isNumber(value, {
        ...disallowAll,
        allowZero: false,
      })

      expect(isValid).toBe(false)
    })

    it('should not allow when not specified', () => {
      const isValid = isNumber(value)

      expect(isValid).toBe(false)
    })
  })

  describe('allowFloat', () => {
    const positiveValue = 3.14
    const negativeValue = -3.14

    it('should allow positive float when true', () => {
      const isValid = isNumber(positiveValue, {
        ...disallowAll,
        allowPositive: true,
        allowFloat: true,
      })

      expect(isValid).toBe(true)
    })

    it('should allow negative float when true', () => {
      const isValid = isNumber(negativeValue, {
        ...disallowAll,
        allowNegative: true,
        allowFloat: true,
      })

      expect(isValid).toBe(true)
    })

    it('should not allow positive float when false', () => {
      const isValid = isNumber(positiveValue, {
        ...disallowAll,
        allowPositive: true,
        allowFloat: false,
      })

      expect(isValid).toBe(false)
    })

    it('should not allow negative float when false', () => {
      const isValid = isNumber(negativeValue, {
        ...disallowAll,
        allowNegative: true,
        allowFloat: false,
      })

      expect(isValid).toBe(false)
    })

    it('should not allow positive when not specified', () => {
      const isValid = isNumber(positiveValue)

      expect(isValid).toBe(false)
    })

    it('should not allow negative when not specified', () => {
      const isValid = isNumber(negativeValue)

      expect(isValid).toBe(false)
    })
  })

  describe('allowNaN', () => {
    const value = NaN

    it('should allow when true', () => {
      const isValid = isNumber(value, {
        ...disallowAll,
        allowNaN: true,
      })

      expect(isValid).toBe(true)
    })

    it('should not allow when false', () => {
      const isValid = isNumber(value, {
        ...disallowAll,
        allowNaN: false,
      })

      expect(isValid).toBe(false)
    })

    it('should not allow when not specified', () => {
      const isValid = isNumber(value)

      expect(isValid).toBe(false)
    })
  })

  describe('allowInfinite', () => {
    const value = Infinity

    it('should allow when true', () => {
      const isValid = isNumber(value, {
        ...disallowAll,
        allowInfinite: true,
      })

      expect(isValid).toBe(true)
    })

    it('should not allow when false', () => {
      const isValid = isNumber(value, {
        ...disallowAll,
        allowInfinite: false,
      })

      expect(isValid).toBe(false)
    })

    it('should not allow when not specified', () => {
      const isValid = isNumber(value)

      expect(isValid).toBe(false)
    })
  })
})
