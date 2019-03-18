import ResMgr from './resMgr'
import GameAudio from './gameAudio'
import Map from './map'
import macro from './macro'
import GameEventListener from './gameEventListener'
import UIMgr from './ui/uiMgr'
import FloatingMgr from './floatingMgr'

class Global {
    constructor() {
        this.uid = undefined
        this.gameState = macro.StateLoad
        this.gameLv = 1
        this.gameScore = 0
        this.resMgr = new ResMgr()
        this.map = new Map()
        this.gameAudio = new GameAudio()
        this.context = undefined
        this.gameEventListener = new GameEventListener()
        this.uiMgr = new UIMgr()
        this.floatingMgr = new FloatingMgr()
        this.child = undefined
    }

    init(){
        this.map.init()
    }
}

const g = new Global()
window.g = g

export default {g}