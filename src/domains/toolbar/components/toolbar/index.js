import './toolbar.css'

import React from 'react'
import cx from 'classnames'
import { useAppState } from '../../../../services/app-state'
import { Tools } from '../../constants'

function Toolbar() {
  const state = useAppState()

  return (
    <div className="toolbar tools">
      <ul className="toolbar-list">
        <li className="toolbar-item">
          <button
            className={cx('toolbar-btn', {
              selected: state.toolbar.selected === Tools.SELECT,
            })}
            onClick={() => state.toolbar.actions.selectTool(Tools.SELECT)}
          >
            ⍙
          </button>
        </li>
        <li className="toolbar-item">
          <button
            className={cx('toolbar-btn', {
              selected: state.toolbar.selected === Tools.PAN,
            })}
            onClick={() => state.toolbar.actions.selectTool(Tools.PAN)}
          >
            ❖
          </button>
        </li>

        <li className="toolbar-item">
          <button
            className={cx('toolbar-btn', {
              selected: state.toolbar.selected === Tools.LINE,
            })}
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
