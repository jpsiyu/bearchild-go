import drawing from './drawing'
import tool from './tool'
import Element from './element'
import macro from './macro'

const ShieldUnactive = 0
const ShieldActive = 1
const ShieldFinish = 2

class Shield extends Element {
    constructor(x, y) {
        const radius = tool.gridSize()/2
        super(x, y, radius)
        this.img = window.g.resMgr.getImg('shield')
        this.state = ShieldUnactive
        this.activeTime = 3
        this.pass = 0
        this.child = undefined
        this.alpha = 0
    }

    isHolding(){
        return this.state === ShieldActive
    }

    holdShield(child){
        this.child = child
        this.state = ShieldActive
        this.radius = tool.gridSize()
    }

    update(elapsed) { 
        if(this.state === ShieldActive){
            this.alpha = this.pass - Math.floor(this.pass)
            this.x = this.child.x
            this.y = this.child.y
            this.pass += elapsed
            if(this.pass > this.activeTime){
                this.state = ShieldFinish
            }
        }
    }

    draw(context) {
        if(this.state === ShieldFinish || window.g.gameState === macro.StateReachDoor) return
        context.save()
        context.translate(this.x, this.y)
        context.beginPath()
        if(this.state === ShieldActive){
            context.fillStyle = `rgba(255, 200, 0, ${this.alpha})`
            context.arc(0, 0, this.radius, 0, 2 * Math.PI)
            context.fill()
        }
        drawing.drawImg(context, -this.radius, -this.radius, this.radius, this.img)
        context.restore()
    }
}

export default Shield