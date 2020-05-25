import React, { useCallback, useState } from 'react'
import cx from 'classnames'

function Debug({ state }) {
  const [expanded, setExpanded] = useState(false)

  const toggleExpanded = useCallback(() => {
    setExpanded((expanded) => !expanded)
  }, [])

  return (
    <div
      className={cx('app-debug', {
        expanded: expanded,
      })}
    >
      <pre>{JSON.stringify(state, null, 2)}</pre>
      <button className="app-debug-toggle" onClick={toggleExpanded}>
        ⌬
      </button>
    </div>
  )
}

export default Debug
