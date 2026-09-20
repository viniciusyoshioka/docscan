import { useCallback, useMemo } from 'react'


export interface SelectableItem<T> {

  /**
   * The value of what is being selected
   */
  item: T

  /**
   * Function called when the item is clicked and the component is not
   * in selection mode. Similar to `onClick`/`onPress`.
   */
  onClick: (item: T) => void

  /**
   * When in selection mode, this function is called when the item is
   * not selected and is pressed.
   *
   * If you want to select the item, you still have to call
   * `useSelectionMode().select()`.
   */
  onSelect: (item: T) => void

  /**
   * When in selection mode, this function is called when the item
   * is selected and is pressed.
   *
   * If you want to deselect the item, you still have to call
   * `useSelectionMode().deselect()`.
   */
  onDeselect: (item: T) => void

  /**
   * Indicates the selection mode state to the component.
   */
  isSelectionMode: boolean

  /**
   * Indicates if the component is selected.
   */
  isSelected: boolean
}


export interface UseSelectableItem {

  /**
   * This function should be passed to the components `onPress` or `onClick`
   * prop. It handles whether to call `onClick`, `onSelect` or `onDeselect`
   * from `SelectableItem`.
   */
  onPress: () => void

  /**
   * This function should be called when the component receives a long press
   * or when you want to select the item and activate the selection mode.
   *
   * The difference between `onLongPress` and `SelectionMode.select` is that
   * `onLongPress` will only select the item and activate the selection mode
   * if the selection mode is not active when called.
   */
  onLongPress: () => void
}


export function useSelectableItem<T>(
  props: SelectableItem<T>,
): UseSelectableItem {


  const { item, isSelectionMode, isSelected } = props
  const { onClick, onDeselect, onSelect } = props


  const toggleSelection = useCallback(() => {
    if (isSelected) {
      onDeselect(item)
    } else {
      onSelect(item)
    }
  }, [isSelected, onDeselect, onSelect, item])


  const onPress = useCallback(() => {
    if (isSelectionMode) {
      toggleSelection()
    } else {
      onClick(item)
    }
  }, [isSelectionMode, toggleSelection, onClick, item])

  const onLongPress = useCallback(() => {
    if (isSelectionMode) {
      return
    }
    onSelect(item)
  }, [isSelectionMode, onSelect, item])


  const selectableItem = useMemo(() => {
    return {
      onPress,
      onLongPress,
    }
  }, [onPress, onLongPress])


  return selectableItem
}
