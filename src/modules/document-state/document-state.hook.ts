import { create } from 'zustand'

import type { PictureId } from '@database'
import type {
  DocumentState,
  PersistedDocument,
  Picture,
} from './document-state.types.ts'


function createDocumentStateHook() {
  const documentStateHook = create<DocumentState>()(
    set => ({


      document: null,
      pictures: null,


      closeDocument: (): void => {
        set(state => {
          return {
            document: null,
            pictures: null,
          }
        })
      },


      setDocument: (
        document: PersistedDocument,
        pictures?: Picture[],
      ): void => {
        set(state => {
          return {
            document: document,
            pictures: pictures ?? [],
          }
        })
      },


      setPictures: (pictures: Picture[]): void => {
        set(state => {
          if (state.document === null) {
            throw new Error(
              'Cannot set pictures when no document is open',
            )
          }

          return {
            ...state,
            pictures: pictures,
          }
        })
      },

      addPictures: (
        pictures: Picture[],
        document: PersistedDocument,
      ): void => {
        set(state => {
          const newPictures = [
            ...(state.document ? state.pictures : []),
            ...pictures,
          ]

          return {
            document: document,
            pictures: newPictures,
          }
        })
      },

      updatePicture: (
        picture: Picture,
        document: PersistedDocument,
      ): void => {
        set(state => {
          if (state.document === null) {
            throw new Error(
              'Cannot update picture when no document is open',
            )
          }

          const newPictures = state.pictures.map(pictureFromState => {
            if (pictureFromState.id === picture.id) {
              return picture
            }
            return pictureFromState
          })

          return {
            document: document,
            pictures: newPictures,
          }
        })
      },

      removePictures: (
        pictureIds: PictureId[],
        document: PersistedDocument,
      ): void => {
        set(state => {
          if (state.document === null) {
            throw new Error(
              'Cannot remove pictures when no document is open',
            )
          }

          const newPictures = state.pictures.filter(picture => {
            return !pictureIds.includes(picture.id)
          })

          return {
            document: document,
            pictures: newPictures,
          }
        })
      },
    }),
  )

  return documentStateHook
}


export const useDocumentState = createDocumentStateHook()
