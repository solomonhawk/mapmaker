import { useEffect, useCallback } from 'react'

function Hotkeys({ bindings = {}, captureBindings = {} }) {
  const onKeyDown = useCallback(
    (e) => {
      if (e.key in bindings) {
        bindings[e.key](e)
      }
    },
    [bindings]
  )
  const onKeyDownCapture = useCallback(
    (e) => {
      if (e.key in captureBindings) {
        captureBindings[e.key](e)
      }
    },
    [captureBindings]
  )

  useEffect(() => {
    document.body.addEventListener('keydown', onKeyDown)
    document.body.addEventListener('keydown', onKeyDownCapture, true)

    return () => {
      document.body.removeEventListener('keydown', onKeyDown)
      document.body.removeEventListener('keydown', onKeyDownCapture, true)
    }
  }, [onKeyDown, onKeyDownCapture])

  return null
}

export default Hotkeys
