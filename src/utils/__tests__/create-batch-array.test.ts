import { createBatchArray, DEFAULT_BATCH_SIZE } from '../create-batch-array.ts'


describe('createBatchArray', () => {


  const largeSingleArrayWithRegularSize = Array(100).fill(0)
  const largeSingleArrayWithIrregularSize = Array(101).fill(0)

  const CUSTOM_BATCH_SIZE = 11


  describe('create batch array using default batch size', () => {
    it('should create batch array for an array with regular size', () => {
      const arrayToSplitIntoBatches = largeSingleArrayWithRegularSize
      const batchSize = DEFAULT_BATCH_SIZE

      const batchArray = createBatchArray(
        arrayToSplitIntoBatches,
      )

      const batchArraySizeAsFloat = (
        arrayToSplitIntoBatches.length / batchSize
      )

      // Total amount of batches created
      const expectedBatchArraySize = Math.ceil(batchArraySizeAsFloat)
      expect(batchArray.length).toBe(expectedBatchArraySize)

      // Check the size of each complete batch
      const amountOfCompleteBatch = Math.trunc(batchArraySizeAsFloat)
      for (let i = 0; i < amountOfCompleteBatch; i++) {
        const batch = batchArray[i]
        expect(batch.length).toBe(batchSize)
      }

      // Check the size of remaining batch
      const hasRemainingBatch = !Number.isInteger(batchArraySizeAsFloat)
      if (hasRemainingBatch) {
        const expectedSizeOfRemainingBatch = (
          arrayToSplitIntoBatches.length
          - (amountOfCompleteBatch * batchSize)
        )

        const sizeOfRemainingBatch = batchArray[amountOfCompleteBatch].length
        expect(sizeOfRemainingBatch).toBe(expectedSizeOfRemainingBatch)
      }
    })

    it('should create batch array for an array with irregular size', () => {
      const arrayToSplitIntoBatches = largeSingleArrayWithIrregularSize
      const batchSize = DEFAULT_BATCH_SIZE

      const batchArray = createBatchArray(
        arrayToSplitIntoBatches,
      )

      const batchArraySizeAsFloat = (
        arrayToSplitIntoBatches.length / batchSize
      )

      // Total amount of batches created
      const expectedBatchArraySize = Math.ceil(batchArraySizeAsFloat)
      expect(batchArray.length).toBe(expectedBatchArraySize)

      // Check the size of each complete batch
      const amountOfCompleteBatch = Math.trunc(batchArraySizeAsFloat)
      for (let i = 0; i < amountOfCompleteBatch; i++) {
        const batch = batchArray[i]
        expect(batch.length).toBe(batchSize)
      }

      // Check the size of remaining batch
      const hasRemainingBatch = !Number.isInteger(batchArraySizeAsFloat)
      if (hasRemainingBatch) {
        const expectedSizeOfRemainingBatch = (
          arrayToSplitIntoBatches.length
          - (amountOfCompleteBatch * batchSize)
        )

        const sizeOfRemainingBatch = batchArray[amountOfCompleteBatch].length
        expect(sizeOfRemainingBatch).toBe(expectedSizeOfRemainingBatch)
      }
    })
  })


  describe('create batch array using custom batch size', () => {
    it('should create batch array for an array with regular size', () => {
      const arrayToSplitIntoBatches = largeSingleArrayWithRegularSize
      const batchSize = CUSTOM_BATCH_SIZE

      const batchArray = createBatchArray(
        arrayToSplitIntoBatches,
        batchSize,
      )

      const batchArraySizeAsFloat = (
        arrayToSplitIntoBatches.length / batchSize
      )

      // Total amount of batches created
      const expectedBatchArraySize = Math.ceil(batchArraySizeAsFloat)
      expect(batchArray.length).toBe(expectedBatchArraySize)

      // Check the size of each complete batch
      const amountOfCompleteBatch = Math.trunc(batchArraySizeAsFloat)
      for (let i = 0; i < amountOfCompleteBatch; i++) {
        const batch = batchArray[i]
        expect(batch.length).toBe(batchSize)
      }

      // Check the size of remaining batch
      const hasRemainingBatch = !Number.isInteger(batchArraySizeAsFloat)
      if (hasRemainingBatch) {
        const expectedSizeOfRemainingBatch = (
          arrayToSplitIntoBatches.length
          - (amountOfCompleteBatch * batchSize)
        )

        const sizeOfRemainingBatch = batchArray[amountOfCompleteBatch].length
        expect(sizeOfRemainingBatch).toBe(expectedSizeOfRemainingBatch)
      }
    })

    it('should create batch array for an array with irregular size', () => {
      const arrayToSplitIntoBatches = largeSingleArrayWithIrregularSize
      const batchSize = CUSTOM_BATCH_SIZE

      const batchArray = createBatchArray(
        arrayToSplitIntoBatches,
        batchSize,
      )

      const batchArraySizeAsFloat = (
        arrayToSplitIntoBatches.length / batchSize
      )

      // Total amount of batches created
      const expectedBatchArraySize = Math.ceil(batchArraySizeAsFloat)
      expect(batchArray.length).toBe(expectedBatchArraySize)

      // Check the size of each complete batch
      const amountOfCompleteBatch = Math.trunc(batchArraySizeAsFloat)
      for (let i = 0; i < amountOfCompleteBatch; i++) {
        const batch = batchArray[i]
        expect(batch.length).toBe(batchSize)
      }

      // Check the size of remaining batch
      const hasRemainingBatch = !Number.isInteger(batchArraySizeAsFloat)
      if (hasRemainingBatch) {
        const expectedSizeOfRemainingBatch = (
          arrayToSplitIntoBatches.length
          - (amountOfCompleteBatch * batchSize)
        )

        const sizeOfRemainingBatch = batchArray[amountOfCompleteBatch].length
        expect(sizeOfRemainingBatch).toBe(expectedSizeOfRemainingBatch)
      }
    })
  })
})
