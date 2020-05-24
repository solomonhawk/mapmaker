import { useContext } from 'react'
import { PointerContext } from './context'

export const usePointer = () => useContext(PointerContext)
