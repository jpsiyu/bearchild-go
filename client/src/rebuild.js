import tool from './tool'
import macro from './macro';
import Hole from './hole'

const ZoomIn = 0
const ZoomOut = 1
const ZoomEnd = 2

class Rebuild {
    constructor() {
        this.angle = 0
        this.img = new Image()
        this.dw = 0
        this.dh = 0
        this.pass = 0
        this.totalTime = 1
        this.zoom = ZoomIn
        this.hole = undefined
    }

    reset(hole) {
        this.hole = hole
        this.zoom = ZoomIn
        this.pass = 0
    }

    update(elapsed) {
        this.pass += elapsed
        let factor
        this.angle += 2 * Math.PI * elapsed  
        switch (this.zoom) {
            case ZoomIn:
                factor = (this.totalTime - this.pass) / this.totalTime
                if (factor < 0) {
                    this.pass = 0
                    this.zoom = ZoomOut
                    window.g.map.reset(true)
                }
                else {
                    this.dw = tool.gameWidth() * factor
                    this.dh = tool.gameHeight() * factor
                }
                break
            case ZoomOut:
                factor = this.pass / this.totalTime
                if (factor > 1) {
                    this.zoom = ZoomEnd
                    window.g.gameState = macro.StateGame
                } else {
                    this.dw = tool.gameWidth() * factor
                    this.dh = tool.gameHeight() * factor
                }
                break
            case ZoomEnd:
                break
        }
    }

    draw(context) {
        const w = tool.gameWidth()
        const h = tool.gameHeight()
        context.save()
        this.img.src = context.canvas.toDataURL()
        context.clearRect(0, 0, w, h)
        context.translate(this.hole.x, this.hole.y)
        context.rotate(this.angle)
        context.drawImage(
            this.img,
            0, 0, this.img.width, this.img.height,
            -this.dw / 2, -this.dh / 2, this.dw, this.dh
        )

        context.translate(-this.hole.x, -this.hole.y)
        this.hole.draw(context)
        context.restore()
    }
}

export default Rebuild