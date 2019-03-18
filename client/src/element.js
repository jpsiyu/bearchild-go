class Element {
    constructor(x, y, radius) {
        this.x = x
        this.y = y
        this.radius = radius
    }

    pos() {
        return { x: this.x, y: this.y }
    }
}

export default Element