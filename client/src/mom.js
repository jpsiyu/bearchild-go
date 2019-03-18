import Element from './element'
import drawing from './drawing'
import macro from './macro'
import Sprite from './sprite'
import tool from './tool'

class Mom extends Element {
    constructor(x, y) {
        const radius = tool.gridSize() / 2
        super(x, y, radius)
        this.chaseSpeed = radius * 4
        this.waitTime = 1
        this.waitPass = 0
        this.sprite = new Sprite(2, 2, window.g.resMgr.getImg('mom-run'))
        this.img = window.g.resMgr.getImg('catched')

    }

    update(child, elapsed) {
        this.sprite.update(elapsed)
        if (this.waitPass < this.waitTime) {
            this.waitPass += elapsed
            return
        }
        this.chase(child, elapsed)
    }

    chase(child, elapsed) {
        let stop = false
        window.g.map.shields.forEach( shield => {
            if(shield.isHolding()){
                if(tool.distance(shield, this) < this.radius + shield.radius)
                    stop = true
            }
        })
        if(stop) return
        const dy = child.y - this.y
        const dx = child.x - this.x
        const theta = Math.atan2(dy, dx)
        this.x += Math.cos(theta) * this.chaseSpeed * elapsed
        this.y += Math.sin(theta) * this.chaseSpeed * elapsed
    }

    draw(context) {
        context.save()
        context.translate(this.x, this.y)
        switch (window.g.gameState) {
            case macro.StateGame:
            case macro.StateReachDoor:
                this.sprite.draw(context)
                break
            case macro.StateGameOver:
                this.radius = tool.gridSize()
                drawing.drawImg(context, -this.radius, -this.radius, this.radius, this.img)
                break
        }

        context.restore()
    }
}

export default Mom