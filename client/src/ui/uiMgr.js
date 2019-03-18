import UILoading from './uiLoading'
import UIStart from './uiStart'
import UIEnd from './uiEnd'
import UIRank from './uiRank'
import UIGame from './uiGame'
import macro from '../macro'
import React from 'react'

const uiConfig = {}
uiConfig[macro.UILoading] = {cls: UILoading, full:true}
uiConfig[macro.UIStart] = {cls: UIStart, full:true}
uiConfig[macro.UIEnd] = {cls: UIEnd, full:false}
uiConfig[macro.UIRank] = {cls: UIRank, full:true}
uiConfig[macro.UIGame] = {cls: UIGame, full:true}

class UIMgr{
    constructor(){
        this.showing = {}
    }

    getComponent(){
        const components = []
        let ui
        Object.keys(this.showing).forEach( key => {
            ui = this.showing[key]
            components.push(ui.component)
        })
        return components
    }

    getUIInfo(){
        const firstPageName = Object.keys(this.showing)[0]
        const uiInfo = this.showing[firstPageName]
        return uiInfo
    }

    isShowing(){
        const res = Object.keys(this.showing).length != 0
        return res
    }

    show(uiName){
        const cfg = uiConfig[uiName]
        if(!cfg) return
        this.showing[uiName] = {
            component: <cfg.cls key={uiName}/>,
            cfg: cfg
        }
        window.g.gameEventListener.dispatch(macro.UIRefresh)
    }

    hide(uiName){
        const ui = this.showing[uiName]
        if(!ui) return
        delete this.showing[uiName]
        window.g.gameEventListener.dispatch(macro.UIRefresh)
    }
}

export default UIMgr