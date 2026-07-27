
export enum FileEncoding {
  UTF_8 = 'UTF_8',
  BASE64 = 'BASE64',
  BUFFER = 'BUFFER',
}


export interface FileStat {
  sizeInBytes: number
  createdAt: Date
  modifiedAt: Date
  accessedAt: Date
}


export interface ReadChunkFileOptions {
  startByte?: number
  endByte?: number
  chunkSizeInBytes?: number
  encoding?: FileEncoding
}
