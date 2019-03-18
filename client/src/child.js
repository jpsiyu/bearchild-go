import drawing from './drawing'
import macro from './macro'
import Element from './element'
import Sprite from './sprite'
import tool from './tool'

class Child extends Element {
    constructor(x, y) {
        const radius = tool.gridSize() / 2
        super(x, y, radius)
        this.spriteNormal = new Sprite(2, 2, window.g.resMgr.getImg('child-roll'), { frameUpdateTime: 1 })
        this.spriteWarrior = new Sprite(2, 2, window.g.resMgr.getImg('warrior'), { frameUpdateTime: 0.2 })
        this.sprite = this.spriteNormal

        this.drinkMilkTime = 1.5
        this.pass = 0
        this.angle = 0
        this.jumpPos = undefined
        this.mode = macro.ChildModeNormal
    }

    changeMode(mode) {
        this.mode = mode
    }


    update(elapsed) {
        switch (window.g.gameState) {
            case macro.StateGame:
                switch (this.mode) {
                    case macro.ChildModeDrink:
                        if (this.pass < this.drinkMilkTime) {
                            this.pass += elapsed
                            this.angle = -0.05 * Math.PI * Math.sin(this.pass * 8)
                        } else {
                            this.changeMode(macro.ChildModeNormal)
                            this.pass = 0
                        }
                        break
                    case macro.ChildModeNormal:
                        this.sprite = this.spriteNormal
                        this.angle = 0
                        break
                    case macro.ChildModeWarrior:
                        this.sprite = this.spriteWarrior
                        this.angle = 0
                        break
                }
                this.sprite.update(elapsed)
                break
            case macro.StateReachDoor:
                this.jumpPos = this.jumpPos || this.y
                this.pass += elapsed
                this.y = this.jumpPos + 10 * Math.sin(this.pass * 20)
                break
            default:
                break
        }
    }

    draw(context) {
        switch (window.g.gameState) {
            case macro.StateGame:
            case macro.StateReachDoor:
                context.save()
                context.translate(this.x, this.y)
                switch (this.mode) {
                    case macro.ChildModeDrink:
                        context.rotate(this.angle)
                        this.img = window.g.resMgr.getImg('drink')
                        drawing.drawImg(context, -tool.gridSize() / 2, -tool.gridSize() / 2, this.radius, this.img)
                        break
                    default:
                        this.sprite.draw(context)
                        break
                }
                context.restore()
                break
        }
    }

    move(context, keyCode) {
        switch (keyCode) {
            case 'ArrowUp':
                this.moveUp()
                break
            case 'ArrowRight':
                this.moveRight()
                break
        }
    }

    moveRight(context) {
        if (this.mode == macro.ChildModeDrink) return
        if (!this.checkPosInFense({ x: this.x + tool.gridSize(), y: this.y }))
            this.x += tool.gridSize()
        this.moveLimit(context)
    }

    moveUp() {
        if (this.mode == macro.ChildModeDrink) return
        if (!this.checkPosInFense({ x: this.x, y: this.y - tool.gridSize() }))
            this.y -= tool.gridSize()
        this.moveLimit()
    }

    checkPosInFense(pos) {
        let inFense = false
        switch (this.mode) {
            case macro.ChildModeNormal:
                window.g.map.fences.forEach(fence => {
                    if (tool.distancePos(pos, fence.pos()) < fence.radius)
                        inFense = true
                })
                break
            case macro.ChildModeWarrior:
                inFense = false
                break
        }
        return inFense
    }

    moveLimit() {
        const w = tool.gameWidth()
        const h = tool.gameHeight()
        const halfGrid = tool.gridSize() / 2
        this.x = Math.min(this.x, w - halfGrid)
        this.x = Math.max(this.x, 0 + halfGrid)
        this.y = Math.min(this.y, h - halfGrid)
        this.y = Math.max(this.y, 0 + halfGrid)
    }
}

export default Child