import Milk from './milk'
import Ball from './ball'
import Fence from './fence'
import Hole from './hole'
import Eye from './eye'
import Explosion from './explosion'
import tool from './tool'
import gameConfig from './gameConfig'
import Shield from './shield'

class Map {
    constructor() {
        this.milks = []
        this.fences = []
        this.balls = []
        this.posList = []
        this.explosions = []
        this.holes = []
        this.eyes = []
        this.shields = []
        this.mapCfg = undefined
        this.gridSize = undefined
        this.resizeCallback = undefined
    }

    init(resizeCallback) {
        if (resizeCallback) this.resizeCallback = resizeCallback

        this.setMapCfg()
        this.resizeCallback()
        this.gridSize = this.calGridSize(window.g.context.canvas.width, this.mapCfg.gridInRow)
    }

    calGridSize(canvasWidth, gridInRow){
        return (canvasWidth / gridInRow)
    }

    setResizeCallback(resizeCallback) {
        this.resizeCallback = resizeCallback
    }

    setMapCfg() {
        const lv = window.g.gameLv
        let curCfg
        let set = false
        gameConfig.mapConfig.forEach(cfg => {
            if (!set && lv <= cfg.lv) {
                set = true
                curCfg = cfg
            }
        })
        this.mapCfg = curCfg
    }

    reset(rebuild = false) {
        this.init()
        this.posList = []
        this.milks = this.randomObj(this.mapCfg.milks, Milk)
        this.fences = this.randomObj(this.mapCfg.fences, Fence)
        this.balls = this.randomObj(this.mapCfg.balls, Ball)
        this.eyes = this.randomObj(this.mapCfg.eyes, Eye)
        this.shields = this.randomObj(this.mapCfg.shields, Shield)
        if (!rebuild)
            this.holes = this.randomObj(this.mapCfg.holes, Hole)
    }

    posExit(newPos) {
        let exit = false
        let pos
        for (let i = 0; i < this.posList.length; i++) {
            pos = this.posList[i]
            if (pos[0] === newPos[0] && pos[1] === newPos[1]) {
                exit = true
                break
            }
        }
        return exit
    }

    createExplosion(img, x, y) {
        const explosion = new Explosion(img, x, y)
        this.explosions.push(explosion)
    }

    update(elapsed) {
        this.explosions.forEach((explosion, i) => {
            if (explosion.finish)
                this.explosions.splice(i, 1)
            else
                explosion.update(elapsed)
        })
        this.holes.forEach(hole => {
            hole.update(elapsed)
        })
        this.shields.forEach(shield => {
            shield.update(elapsed)
        })
    }

    allDraws() {
        return [
            this.milks,
            this.fences,
            this.balls,
            this.explosions,
            this.holes,
            this.eyes,
            this.shields,
        ]
    }

    draw(context) {
        this.allDraws().forEach(objList => {
            objList.forEach(obj => {
                obj.draw(context)
            })
        })
    }

    randomObj(objNum, objClass) {
        const objList = []
        const inLimit = (row, col) => {
            return col > 2 && col < tool.maxCol() - 2
        }
        const curLen = this.posList.length
        while (this.posList.length < curLen + objNum) {
            let row = Math.round(Math.random() * tool.maxRow())
            if (objClass == Milk)
                row = Math.random() < 0.3 ? tool.maxRow() : row
            const col = Math.round(Math.random() * tool.maxCol())
            const g = [row, col]
            if (!this.posExit(g) && inLimit(row, col)) {
                this.posList.push(g)
                const pos = tool.grid2coord(row, col)
                objList.push(new objClass(pos.x, pos.y))
            }
        }
        return objList
    }
}

export default Map