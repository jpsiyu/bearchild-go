import drawing from './drawing'
import tool from './tool'
import Element from './element'

class Hole extends Element {
    constructor(x, y) {
        const radius = Math.floor(tool.gridSize()/2)
        super(x, y, radius)
        this.img = window.g.resMgr.getImg('hole')
        this.rotation = 0
    }

    update(elapsed) { 
        this.rotation += 2 * Math.PI * elapsed
    }

    draw(context) {
        context.save()
        context.beginPath()
        context.translate(this.x, this.y)
        context.rotate(this.rotation)
        drawing.drawImg(context, -this.radius, -this.radius, this.radius, this.img)
        context.restore()
    }
}

export default Hole