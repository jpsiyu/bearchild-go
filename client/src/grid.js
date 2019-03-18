import drawing from './drawing'
import macro from './macro'
import tool from './tool'

class Grid {
    constructor() {
        this.xCover = 0
        this.yCover = 0
        this.imgMove = 0
        this.imgSpeed = 50
        this.imgScale = 1.5
    }


    update(elapsed, child) {
        this.imgMove += elapsed * this.imgSpeed
        const gridSize = tool.gridSize()
        this.xCover = child.x - gridSize / 2 + gridSize * macro.Visiable
        this.yCover = child.y + gridSize / 2 - gridSize * macro.Visiable
    }

    draw(context) {
        context.save()
        const bg = window.g.resMgr.getImg('grassland')
        context.drawImage(bg, 0, 0, tool.gameWidth(), tool.gameHeight())
        drawing.drawGrid(context)
        context.restore()
    }

    drawMask(context) {
        context.save()
        const imageData = context.getImageData(
            0, this.yCover, 
            this.xCover, tool.gameHeight() - this.yCover
        )

        const img = window.g.resMgr.getImg('sky')
        const imgW = img.width * this.imgScale
        const imgH = tool.gameHeight()
        let adjustMove = this.imgMove % imgW
        context.drawImage(
            img, -adjustMove, 0, imgW, imgH,
        )
        const diff = (imgW - adjustMove)
        if(diff < tool.gameWidth()){
            context.drawImage(
                img, diff, 0, imgW, imgH,
            )
        }

        context.putImageData(imageData, 0, this.yCover)
        context.restore()
    }
}

export { Grid }