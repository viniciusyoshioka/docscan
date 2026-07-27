import { useEffect, useState } from 'react'


export function useDebounce<T>(value: T, delayInMs = 500): T {


  const [debouncedValue, setDebouncedValue] = useState(value)


  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedValue(value)
    }, delayInMs)

    return () => clearTimeout(timeout)
  }, [value, delayInMs])


  return debouncedValue
}
