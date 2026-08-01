import { merge } from 'lodash'
import { create } from 'zustand'

import type { DocumentEntity, PictureEntity, PictureId } from '@database'
import type { DocumentState } from './document-state.types.ts'


function createDocumentStateHook() {
  const documentStateHook = create<DocumentState>()(
    set => ({
      document: null,
      pictures: null,


      closeDocument: () => {
        set(state => {
          return {
            document: null,
            pictures: null,
          }
        })
      },


      setDocument: (document: DocumentEntity) => {
        set(state => {
          return {
            document: document,
            pictures: [],
          }
        })
      },

      updateDocumentTitle: (newTitle: DocumentEntity['title']) => {
        set(state => {
          if (state.document === null) {
            throw new Error(
              'Cannot update document title when no document is open',
            )
          }

          const updatedDocument = merge(
            state.document,
            { title: newTitle },
          )

          return {
            ...state,
            document: updatedDocument,
          }
        })
      },


      setPictures: (pictures: PictureEntity[]) => {
        set(state => {
          if (state.document === null) {
            throw new Error('Cannot set pictures when no document is open')
          }

          return {
            ...state,
            pictures: pictures,
          }
        })
      },

      addPictures: (pictures: PictureEntity[]) => {
        set(state => {
          if (state.document === null) {
            throw new Error('Cannot add pictures when no document is open')
          }

          const newPictures = [...state.pictures, ...pictures]

          return {
            ...state,
            pictures: newPictures,
          }
        })
      },

      removePictures: (pictureIds: PictureId[]) => {
        set(state => {
          if (state.document === null) {
            throw new Error('Cannot remove pictures when no document is open')
          }

          const newPictures = state.pictures.filter(picture => {
            return !pictureIds.includes(picture.id)
          })

          return {
            ...state,
            pictures: newPictures,
          }
        })
      },
    }),
  )

  return documentStateHook
}


export const useDocumentState = createDocumentStateHook()
