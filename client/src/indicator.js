class Indicator {
    constructor(label, posCallback) {
        this.posCallback = posCallback
        this.label = label
        this.updatePos()
        this.pass = 0
        this.dots = ['', '.', '..', '...']
        this.dot = '.'
    }

    setPosCallback(callback) {
        this.posCallback = callback
    }

    updatePos() {
        const info = this.posCallback()
        this.x = info.x
        this.y = info.y
        this.width = info.width
        this.height = info.height
    }

    update(elpased) {
        this.pass += elpased
        const n = Math.round(this.pass / 0.2) % 4
        this.dot = this.dots[n]

        this.updatePos()
    }

    draw(ctx, cur, max) {
        ctx.save()
        ctx.strokeStyle = 'white'
        ctx.fillStyle = 'white'
        ctx.font = `${this.height}pt Arial`
        const t = this.label + this.dot
        const tl = ctx.measureText(this.label).width
        ctx.textAlign = 'left'
        ctx.fillText(t, this.x - tl/2, this.y - this.height * 0.5)
        ctx.beginPath()
        ctx.rect(-this.width / 2 + this.x, this.y, this.width, this.height)
        ctx.stroke()
        ctx.beginPath()
        ctx.rect(-this.width / 2 + this.x, this.y, this.width * (cur / max), this.height)
        ctx.fill()
        ctx.restore()
    }
}

class NumberIndicator {
    constructor(label, x, y, options) {
        options = options || {}
        this.label = label
        this.x = x
        this.y = y
        this.digits = options.digits || 0
        this.pt = options.pt || 8
        this.align = options.align || 'left'
    }

    draw(ctx, value) {
        ctx.save()
        ctx.fillStyle = 'black'
        ctx.font = `${this.pt}pt Comic Sans MS`
        ctx.textAlign = this.align
        ctx.fillText(`${this.label} ${value}`, this.x, this.y + this.pt - 1)
        ctx.restore()
    }
}

export { Indicator, NumberIndicator }