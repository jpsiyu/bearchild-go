import React from 'react'
import macro from './macro'
import Game from './game'
import global from './global'

class MainScene extends React.Component {
    constructor() {
        super()
        this.canvas = undefined
        this.divUI = undefined
        this.state = {
            gt: 0,
            gl: 0,
            gw: 0,
            gh: 0,
            uiRefresh: 0,
        }
        this.game = undefined
        this.lastTouch = undefined
    }

    componentDidMount() {
        this.div = this.refs.div
        this.divUI = this.refs.divUI
        this.canvas = this.refs.canvasGame
        this.canvas.focus()
        this.context = this.canvas.getContext('2d')

        this.div.addEventListener('touchstart', event => { 
            event.preventDefault() 
        })
        document.addEventListener('visibilitychange', () => {
            if(document.hidden) window.g.gameAudio.pause('bg.mp3')
            this.game.setPause(document.hidden)
        })
        window.addEventListener('resize', ev => { this.resizeCanvas() })
        window.addEventListener('orientationchange', ev => { setTimeout(() => { this.resizeCanvas() }, 200); })
        window.g.gameEventListener.register(macro.UIRefresh, this, () => { 
            this.setState({ uiRefresh: this.state.uiRefresh + 1}) 
        })

        this.initGlobal()
    }

    initGlobal() {
        window.g.context = this.context
        window.g.map.init(() => { this.resizeCanvas() })
        this.startLoading()
    }

    startLoading() {
        window.g.uiMgr.show(macro.UILoading)
        this.game = new Game(this.context)
    }

    resizeCanvas() {
        const updateState = {}
        let gw, gh

        const curruntRatio = (window.innerWidth / window.innerHeight)
        if (curruntRatio > macro.WidthHeightRatio) {
            gh = window.innerHeight
            gw = gh * macro.WidthHeightRatio
        } else {
            gw = window.innerWidth
            gh = gw / macro.WidthHeightRatio
        }

        const size = window.g.map.calGridSize(gw, window.g.map.mapCfg.gridInRow)
        gh -= gh % size

        this.canvas.width = gw
        this.canvas.height = gh

        updateState.gl = (window.innerWidth - gw) / 2
        updateState.gt = (window.innerHeight - gh) / 2
        updateState.gw = gw
        updateState.gh = gh
        this.setState(updateState)

        setTimeout(() => {
            window.scrollTo(0, 0)
        }, 200);
    }

    render() {
        return <div ref='div' className='divRoot' >
            <canvas ref='canvasGame' className='canvasGame'
                style={{ marginTop: this.state.gt, marginLeft: this.state.gl }}>
            </canvas>
            <div ref='divUI' className='divUI'
                style={{
                    marginTop: this.state.gt,
                    marginLeft: this.state.gl,
                    width: this.state.gw,
                    height: this.state.gh,
                    zIndex: 1,
                }}>
                {window.g.uiMgr.getComponent()}
            </div>
        </div>
    }
}

export default MainScene