import tool from './tool'

class Explosion {
    constructor(img, x, y) {
        this.radius = tool.gridSize() / 2
        this.x = x - this.radius
        this.y = y - this.radius
        this.img = img
        this.num = 4
        this.pass = 0
        this.speed = 1000
        this.a = this.speed * 6
        this.setPlaces()
        this.finish = false
    }

    draw(context) {
        context.save()
        context.translate(this.x, this.y)
        for (let i = 0; i < this.num; i++) {
            const place = this.places[i]
            context.save()
            context.drawImage(this.img,
                place.sx, place.sy, place.sw, place.sh,
                place.dx + place.mx, place.dy + place.my, place.dw, place.dh
            )
            context.restore()
        }
        context.restore()
    }

    setPlaces() {
        this.places = []
        for (let i = 0; i < this.num; i++) {
            const imgW = this.img.width
            const imgH = this.img.height
            const r = i % 2
            const c = Math.floor(i / 2)
            const place = {
                sx: imgW / 2 * r,
                sy: imgH / 2 * c,
                sw: imgW / 2,
                sh: imgH / 2,
                dx: this.radius * r,
                dy: this.radius * c,
                dw: this.radius,
                dh: this.radius,
                angle: Math.PI / this.num * i - 0.25 * Math.PI,
                mx: 0,
                my: 0,
            }
            this.places.push(place)
        }
    }

    update(elpased) {
        this.pass += elpased
        this.speed -= elpased * this.a

        if (this.speed > 0) {
            this.places.forEach(place => {
                place.mx += this.speed * Math.cos(place.angle) * elpased
                place.my += this.speed * Math.sin(place.angle) * elpased
            })
        }else{
            this.finish = true
        }
    }
}

export default Explosion