import tool from './tool'

class Sprite{
    constructor(row, col, image, options={}) {
        this.row = row
        this.col = col

        this.radius = tool.gridSize()/2
        this.img = image

        this.frameIndex = 0
        this.frameNum = this.row * this.col
        this.frameSize = this.img.width / this.row
        this.frameUpdateTime = options.frameUpdateTime || 0.1
        this.pass = 0
    }

    update(elapsed) { 
        if(this.pass < this.frameUpdateTime){
            this.pass += elapsed
        }else{
            this.frameIndex = (this.frameIndex+1) % this.frameNum
            this.pass = 0
        }
    }

    draw(context) {
        context.save()
        const r = this.calRowIndex()
        const c = this.calColIndex()
        context.drawImage(
            this.img, 
            c*this.frameSize, r*this.frameSize, this.frameSize, this.frameSize,
            -this.radius, -this.radius, 2*this.radius, 2*this.radius)
        context.restore()
    }

    calRowIndex(){
        return Math.floor(this.frameIndex / this.row)
    }

    calColIndex(){
        return this.frameIndex % this.row
    }
}

export default Sprite