import tool from './tool'
import Element from './element'
import macro from './macro'

class Floating extends Element {
    constructor(x, y, score) {
        const radius = tool.gridSize() / 2
        super(x, y, radius)
        this.score = score
        this.moveTime = 0.1
        this.showTime = this.moveTime + 0.2
        this.pass = 0
        this.speed = 300
        this.active = true
    }

    reset(x, y, score) {
        this.x = x
        this.y = y
        this.score = score
        this.pass = 0
        this.active = true
    }

    update(elapsed) {
        if (!this.active) return

        if (this.pass < this.moveTime) {
            this.pass += elapsed
            this.y -= elapsed * this.speed
        } else if (this.pass < this.showTime) {
            this.pass += elapsed
        } else {
            this.active = false
        }
    }

    getColor() {
        let c = 'red'
        switch (this.score) {
            case macro.ScoreMilk:
                c = 'blue'
                break
            case macro.ScoreFence:
                c = 'gold'
                break
            case macro.ScoreLevel:
                c = 'white'
                break
            default:
                c = 'red'
                break
        }
        return c
    }

    draw(context) {
        if (!this.active) return
        const text = `+${this.score}`
        const w = context.measureText(text).width
        context.save()
        context.translate(this.x - 2*w, this.y)
        context.fillStyle = this.getColor()
        context.font = '30px Game Font'
        context.fillText(`+${this.score}`, 0, 0)
        context.restore()
    }
}

export default Floating