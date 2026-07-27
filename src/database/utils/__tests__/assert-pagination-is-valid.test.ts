import type { Pagination } from '../../types/pagination.ts'
import { assertPaginationIsValid } from '../assert-pagination-is-valid.ts'


function buildPageErrorMessage(page: number): string {
  return `Invalid value for page: "${page}"`
}

function buildLimitErrorMessage(limit: number): string {
  return `Invalid value for limit: "${limit}"`
}


describe('assertPaginationIsValid', () => {
  describe('page', () => {
    it('should not throw when page is positive', () => {
      const page = 1

      const pagination: Pagination = {
        page: page,
        limit: 1,
      }

      expect(
        () => assertPaginationIsValid(pagination),
      ).not.toThrow()
    })

    it('should throw when page is negative', () => {
      const page = -1

      const pagination: Pagination = {
        page: page,
        limit: 1,
      }

      expect(
        () => assertPaginationIsValid(pagination),
      ).toThrow(buildPageErrorMessage(page))
    })

    it('should throw when page is zero', () => {
      const page = 0

      const pagination: Pagination = {
        page: page,
        limit: 1,
      }

      expect(
        () => assertPaginationIsValid(pagination),
      ).toThrow(buildPageErrorMessage(page))
    })

    it('should throw when page is decimal number', () => {
      const page = 3.14

      const pagination: Pagination = {
        page: page,
        limit: 1,
      }

      expect(
        () => assertPaginationIsValid(pagination),
      ).toThrow(buildPageErrorMessage(page))
    })

    it('should throw when page is NaN', () => {
      const page = NaN

      const pagination: Pagination = {
        page: page,
        limit: 1,
      }

      expect(
        () => assertPaginationIsValid(pagination),
      ).toThrow(buildPageErrorMessage(page))
    })

    it('should throw when page is Infinity', () => {
      const page = Infinity

      const pagination: Pagination = {
        page: page,
        limit: 1,
      }

      expect(
        () => assertPaginationIsValid(pagination),
      ).toThrow(buildPageErrorMessage(page))
    })
  })

  describe('limit', () => {
    it('should not throw when limit is positive', () => {
      const limit = 1

      const pagination: Pagination = {
        page: 1,
        limit: limit,
      }

      expect(
        () => assertPaginationIsValid(pagination),
      ).not.toThrow()
    })

    it('should throw when limit is negative', () => {
      const limit = -1

      const pagination: Pagination = {
        page: 1,
        limit: limit,
      }

      expect(
        () => assertPaginationIsValid(pagination),
      ).toThrow(buildLimitErrorMessage(limit))
    })

    it('should not throw when limit is zero', () => {
      const limit = 0

      const pagination: Pagination = {
        page: 1,
        limit: limit,
      }

      expect(
        () => assertPaginationIsValid(pagination),
      ).not.toThrow()
    })

    it('should throw when limit is a decimal number', () => {
      const limit = 3.14

      const pagination: Pagination = {
        page: 1,
        limit: limit,
      }

      expect(
        () => assertPaginationIsValid(pagination),
      ).toThrow(buildLimitErrorMessage(limit))
    })

    it('should throw when limit is NaN', () => {
      const limit = NaN

      const pagination: Pagination = {
        page: 1,
        limit: limit,
      }

      expect(
        () => assertPaginationIsValid(pagination),
      ).toThrow(buildLimitErrorMessage(limit))
    })

    it('should throw when limit is Infinity', () => {
      const limit = Infinity

      const pagination: Pagination = {
        page: 1,
        limit: limit,
      }

      expect(
        () => assertPaginationIsValid(pagination),
      ).toThrow(buildLimitErrorMessage(limit))
    })
  })
})
