import { useState } from "react"


export function useSelectionMode<T>() {


    const [isSelectionMode, setIsSelectionMode] = useState(false)
    const [selectedData, setSelectedData] = useState<T[]>([])


    function selectItem(item: T) {
        if (!isSelectionMode) {
            setIsSelectionMode(true)
        }
        if (!selectedData.includes(item)) {
            setSelectedData(current => [...current, item])
        }
    }

    function deselectItem(item: T) {
        const index = selectedData.indexOf(item)
        if (index === -1) {
            return
        }

        const newSelectedData = [...selectedData]
        newSelectedData.splice(index, 1)
        setSelectedData(newSelectedData)

        if (isSelectionMode && newSelectedData.length === 0) {
            setIsSelectionMode(false)
        }
    }

    function exitSelection() {
        setIsSelectionMode(false)
        setSelectedData([])
    }


    return {
        isSelectionMode,
        setIsSelectionMode,
        selectedData,
        setSelectedData,
        selectItem,
        deselectItem,
        exitSelection,
    }
}
