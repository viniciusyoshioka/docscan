export const DEFAULT_BATCH_SIZE = 20


export function createBatchArray<T = unknown>(
  array: T[],
  batchSize = DEFAULT_BATCH_SIZE,
): T[][] {
  const batchArray: T[][] = []

  for (let i = 0; i < array.length; i += batchSize) {
    const batch = array.slice(i, i + batchSize)
    batchArray.push(batch)
  }

  return batchArray
}
