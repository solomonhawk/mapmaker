import { useContext } from 'react'
import { AppState } from './context'

export const useAppState = () => useContext(AppState)
