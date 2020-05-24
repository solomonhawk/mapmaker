import './toolbar.css'

import React from 'react'
import cx from 'classnames'
import { useAppState } from '../../../../services/app-state'
import { Tools } from '../../constants'

const stopPropagation = (e) => {
  e.stopPropagation()
}

function Toolbar() {
  const state = useAppState()

  return (
    <div className="toolbar tools">
      <ul className="toolbar-list">
        <li className="toolbar-item">
          <button
            className={cx('toolbar-btn', {
              selected: state.toolbar.selected === Tools.PAN,
            })}
            onMouseDownCapture={stopPropagation}
            onMouseUpCapture={stopPropagation}
            onClick={() => state.toolbar.actions.selectTool(Tools.PAN)}
          >
            ◇
          </button>
        </li>
        <li className="toolbar-item">
          <button
            className={cx('toolbar-btn', {
              selected: state.toolbar.selected === Tools.LINE,
            })}
            onMouseDownCapture={stopPropagation}
            onMouseUpCapture={stopPropagation}
            onClick={() => state.toolbar.actions.selectTool(Tools.LINE)}
          >
            ⎮
          </button>
        </li>
        <li className="toolbar-item">
          <button
            className={cx('toolbar-btn', {
              selected: state.toolbar.selected === Tools.RECT,
            })}
            onMouseDownCapture={stopPropagation}
            onMouseUpCapture={stopPropagation}
            onClick={() => state.toolbar.actions.selectTool(Tools.RECT)}
          >
            □
          </button>
        </li>
        <li className="toolbar-item">
          <button
            className={cx('toolbar-btn', {
              selected: state.toolbar.selected === Tools.CIRCLE,
            })}
            onMouseDownCapture={stopPropagation}
            onMouseUpCapture={stopPropagation}
            onClick={() => state.toolbar.actions.selectTool(Tools.CIRCLE)}
          >
            ⃝
          </button>
        </li>
      </ul>
    </div>
  )
}

export default Toolbar
