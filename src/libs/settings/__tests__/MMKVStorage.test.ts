import { MMKV } from "react-native-mmkv"

import { MMKVStorage } from "../MMKVStorage"


describe("MMKVStorage", () => {


  const mmkv = new MMKV()
  const stateStorage = new MMKVStorage(mmkv)

  const spyOnGetItem = jest.spyOn(stateStorage, "getItem")
  const spyOnSetItem = jest.spyOn(stateStorage, "setItem")
  const spyOnRemoveItem = jest.spyOn(stateStorage, "removeItem")

  const key = "key"
  const value = "value"


  it("should receive null if calling get when storage is empty", () => {
    const returnedValue = stateStorage.getItem(key)
    expect(returnedValue).toBeNull()
    expect(spyOnGetItem).toHaveBeenCalledTimes(1)
    expect(spyOnGetItem).toHaveBeenCalledWith(key)
  })

  it("should set item in storage", () => {
    stateStorage.setItem(key, value)
    expect(spyOnSetItem).toHaveBeenCalledTimes(1)
    expect(spyOnSetItem).toHaveBeenCalledWith(key, value)
  })

  it("should get item from storage if it were added", () => {
    const returnedValue = stateStorage.getItem(key)
    expect(returnedValue).toBe(value)
    expect(spyOnGetItem).toHaveBeenCalledTimes(2)
    expect(spyOnGetItem).toHaveBeenCalledWith(key)
  })

  it("should remove item from storage if it were added", () => {
    stateStorage.removeItem(key)
    expect(spyOnRemoveItem).toHaveBeenCalledTimes(1)
    expect(spyOnRemoveItem).toHaveBeenCalledWith(key)
  })

  it("should not throw when trying to remove an item that does not exists", () => {
    stateStorage.removeItem(key)
    expect(spyOnRemoveItem).toHaveBeenCalledWith(key)
    expect(spyOnRemoveItem).toHaveBeenCalledTimes(2)
  })
})
