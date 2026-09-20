import { useCallback, useMemo, useState } from 'react'


interface SelectionModeState<T> {
  isSelectionMode: boolean
  isSelectionInverted: boolean
  selectedData: Set<T>
}


export interface SelectionModeParams {
  totalCount: number
}


export interface SelectionMode<T> {

  /**
   * Indicates whether the selection mode is active or not.
   */
  isSelectionMode: boolean

  /**
   * Indicates whether the selection mode is inverted or not.
   *
   * When inverted, the selected data represents the data that is not selected.
   * When not inverted, the default until an explicit call to `invert`, the
   * selected data represents the data that is selected.
   *
   * The inversion of the selected data is useful when selecting items from a
   * paginated list. Its not guaranteed that all data is available to check if
   * something is selected or not or to manually invert the selected data set.
   */
  isSelectionInverted: boolean

  /**
   * Selects the item.
   *
   * - If the item is already selected, nothing happens.
   * - If the selection mode is not active, it will be activated.
   *
   * @param item The item to be selected.
   */
  select: (item: T) => void

  /**
   * Deselects the item.
   *
   * - If the item is not selected, nothing happens.
   * - If there is no item selected after deselect, the selection
   * mode will be deactivated.
   *
   * @param item The item to be deselected.
   */
  deselect: (item: T) => void

  /**
   * Inverts the selection.
   */
  invert: () => void

  /**
   * Checks if the item is selected.
   *
   * @param item The item to be checked.
   *
   * @returns `true` if the item is selected, `false` otherwise.
   */
  isSelected: (item: T) => boolean

  /**
   * The number of selected items.
   */
  length: number

  /**
   * @returns The selected data as array.
   */
  getSelectedData: () => T[]

  /**
   * Exits the selection mode and deselects all items.
   */
  exitSelection: () => void
}


export function useSelectionMode<T>(
  params: SelectionModeParams,
): SelectionMode<T> {
  const { totalCount } = params


  const [state, setState] = useState<SelectionModeState<T>>({
    isSelectionMode: false,
    isSelectionInverted: false,
    selectedData: new Set<T>(),
  })


  const _select = useCallback((item: T) => {
    setState(currentState => {
      const hasEnabledSelectionModeNow = !currentState.isSelectionMode

      const isSelectionMode = hasEnabledSelectionModeNow
        ? true
        : currentState.isSelectionMode
      const isSelectionInverted = hasEnabledSelectionModeNow
        ? false
        : currentState.isSelectionInverted

      currentState.selectedData.add(item)

      return {
        isSelectionMode,
        isSelectionInverted,
        selectedData: currentState.selectedData,
      }
    })
  }, [])

  const _deselect = useCallback((item: T) => {
    setState(currentState => {
      if (!currentState.isSelectionMode) {
        return currentState
      }

      currentState.selectedData.delete(item)

      const hasDisabledSelectionModeNow = currentState.selectedData.size === 0
      const isSelectionNotInverted = !currentState.isSelectionInverted

      const isSelectionMode =
        hasDisabledSelectionModeNow && isSelectionNotInverted
          ? false
          : currentState.isSelectionMode
      const isSelectionInverted =
        hasDisabledSelectionModeNow && isSelectionNotInverted
          ? false
          : currentState.isSelectionInverted

      return {
        isSelectionMode,
        isSelectionInverted,
        selectedData: currentState.selectedData,
      }
    })
  }, [])

  const select = useCallback((item: T) => {
    const isItemSelected = state.selectedData.has(item)
    if (isItemSelected) {
      _deselect(item)
    } else {
      _select(item)
    }
  }, [state.selectedData, _deselect, _select])

  const deselect = useCallback((item: T) => {
    const isItemSelected = state.selectedData.has(item)
    if (isItemSelected) {
      _deselect(item)
    } else {
      _select(item)
    }
  }, [state.selectedData, _deselect, _select])

  const invert = useCallback(() => {
    setState(currentState => {
      if (!currentState.isSelectionMode) {
        return currentState
      }

      return {
        isSelectionMode: currentState.isSelectionMode,
        isSelectionInverted: !currentState.isSelectionInverted,
        selectedData: currentState.selectedData,
      }
    })
  }, [])


  const isSelected = useCallback((item: T) => {
    if (!state.isSelectionMode) {
      return false
    }

    const isItemSelected = state.selectedData.has(item)

    if (state.isSelectionInverted) {
      return !isItemSelected
    }
    return isItemSelected
  }, [state])


  const length = state.isSelectionInverted
    ? totalCount - state.selectedData.size
    : state.selectedData.size


  const getSelectedData = useCallback(() => {
    return Array.from(state.selectedData)
  }, [state.selectedData])


  const exitSelection = useCallback(() => {
    setState(currentState => {
      currentState.selectedData.clear()

      return {
        isSelectionMode: false,
        isSelectionInverted: false,
        selectedData: currentState.selectedData,
      }
    })
  }, [])


  const selectionMode = useMemo(() => {
    return {
      isSelectionMode: state.isSelectionMode,
      isSelectionInverted: state.isSelectionInverted,
      select,
      deselect,
      invert,
      isSelected,
      length,
      getSelectedData,
      exitSelection,
    }
  }, [
    state,
    select,
    deselect,
    invert,
    isSelected,
    length,
    getSelectedData,
    exitSelection,
  ])


  return selectionMode
}
