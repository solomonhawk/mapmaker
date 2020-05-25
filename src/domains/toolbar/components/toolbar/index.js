import './toolbar.css'

import React, { useCallback, useMemo } from 'react'
import cx from 'classnames'
import { useAppState } from '../../../../services/app-state'
import { Tools } from '../../constants'
import Hotkeys from '../hotkeys'

function Toolbar() {
  const state = useAppState()

  const { selectTool } = state.toolbar.actions

  const onSelectTool = useCallback(
    (tool) => (e) => {
      if (!e.shiftKey && !e.metaKey && !e.altKey) {
        e.preventDefault()
        e.stopPropagation()
        selectTool(tool)
      }
    },
    [selectTool]
  )

  const tools = useMemo(
    () =>
      [
        { type: Tools.SELECT, icon: '⍙' },
        { type: Tools.PAN, icon: '❖' },
        { type: Tools.LINE, icon: '⎮' },
        { type: Tools.RECT, icon: '□' },
        { type: Tools.CIRCLE, icon: ' ⃝' },
      ].map((t, i) => ({ ...t, binding: i + 1 })),
    []
  )

  return (
    <>
      <Hotkeys
        bindings={tools.reduce(
          (acc, tool) => ({
            ...acc,
            [tool.binding]: onSelectTool(tool.type),
          }),
          {}
        )}
      />

      <div className="toolbar tools">
        <ul className="toolbar-list">
          {tools.map((tool) => (
            <li
              key={tool.type}
              data-hotkey={tool.binding}
              className={cx('toolbar-item', {
                selected: state.toolbar.selected === tool.type,
              })}
            >
              <button onClick={onSelectTool(tool.type)} className="toolbar-btn">
                {tool.icon}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}

export default Toolbar
