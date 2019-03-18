import React from 'react'
import macro from '../macro'

class UIEnd extends React.Component {
    constructor() {
        super()
        this.quitSymbol = '⏎'
        this.restartSymbol = '↺'
        this.rankSymbal = '✩'
        this.onBtnQuitClick = this.onBtnQuitClick.bind(this)
        this.onBtnRestartClick = this.onBtnRestartClick.bind(this)
        this.onBtnRankClick = this.onBtnRankClick.bind(this)
    }


    onBtnQuitClick() {
        window.g.gameEventListener.dispatch(macro.EventReady)
        window.g.uiMgr.hide(macro.UIEnd)
    }

    onBtnRestartClick() {
        window.g.gameEventListener.dispatch(macro.EventRestart)
        window.g.uiMgr.hide(macro.UIEnd)
    }

    onBtnRankClick(){
        window.g.uiMgr.show(macro.UIRank)
    }

    render() {
        return <div className='uiPop UIEnd'>
            <div className='title'>
                <h2>Game Over</h2>
            </div>
            <div className='btnContainer'>
                <div className='btnGroup'>
                    <button className='btn' onTouchEnd={this.onBtnQuitClick} onClick={this.onBtnQuitClick}>{this.quitSymbol}</button>
                    <label>Quit</label>
                </div>
                <div className='btnGroup'>
                    <button className='btn' onTouchEnd={this.onBtnRankClick} onClick={this.onBtnRankClick}>{this.rankSymbal}</button>
                    <label>Rank</label>
                </div>
                <div className='btnGroup'>
                    <button className='btn' onTouchEnd={this.onBtnRestartClick} onClick={this.onBtnRestartClick}>{this.restartSymbol}</button>
                    <label>Restart</label>
                </div>
            </div>
        </div>
    }
}

export default UIEnd