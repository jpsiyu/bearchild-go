import Floating from './floating'

class FloatingMgr{
    constructor(){
        this.floatings = []

    }

    update(elapsed){
        this.floatings.forEach(flo => {
            flo.update(elapsed)
        })
    }

    draw(context){
        this.floatings.forEach(flo => {
            flo.draw(context)
        })
    }

    popFloating(x, y, score){
        let element = undefined
        let target = undefined
        for(let i = 0; i < this.floatings.length; i++){
            element = this.floatings[i]
            if(!element.active){
                target = element
                target.reset(x, y, score)
                break
            }
        }
        if(!target){
            target = new Floating(x, y, score)
            this.floatings.push(target)
        }
    }
}

export default FloatingMgr