import React from 'react'
import macro from '../macro'

class UIStart extends React.Component {
    constructor() {
        super()
        this.onBtnStartClick = this.onBtnStartClick.bind(this)
        this.onBtnMusicClick = this.onBtnMusicClick.bind(this)
        this.onBtnRankClick = this.onBtnRankClick.bind(this)
        const musicColor = this.getMusicColor()
        this.state = {
            musicColor,
        }
    }

    onBtnStartClick() {
        window.g.uiMgr.hide(macro.UIStart)
        window.g.gameEventListener.dispatch(macro.EventRestart)
    }

    onBtnMusicClick() {
        window.g.gameAudio.active = !window.g.gameAudio.active
        const musicColor = this.getMusicColor()
        this.setState({ musicColor })
    }

    onBtnRankClick() {
        window.g.uiMgr.show(macro.UIRank)
    }

    getMusicColor() {
        const c = window.g.gameAudio.active ? 'lightcoral' : 'rgba(0,0,0,0)'
        return c
    }

    render() {
        return <div className='UIStart uiFull'> 
            <div className='left'></div>
            <div className='mid'>
                <button onClick={this.onBtnStartClick} onTouchEnd={this.onBtnStartClick}>Start Game</button>
            </div>
            <div className='right'>
                <div></div>
                <div className='right-bottom'>
                    <button onClick={this.onBtnMusicClick} onTouchEnd={this.onBtnMusicClick} style={{ backgroundColor: this.state.musicColor }}>♬</button>
                    <button onClick={this.onBtnRankClick} onTouchEnd={this.onBtnRankClick}>✩</button>
                </div>
            </div>
        </div>
    }
}

export default UIStart