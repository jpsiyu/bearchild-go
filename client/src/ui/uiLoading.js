import React from 'react'
import macro from '../macro'
import gameCookie from '../gameCookie'
import axios from 'axios'

class UILoading extends React.Component {
    constructor() {
        super()
        this.time = 3
        this.pass = 0
        this.timer = undefined
        this.intever = 0.1
        this.state = {
            percent: 0
        }
        this.count = 0
        this.progressEnd = false
        this.loadFinish = false
        this.version = '0.5.3'
    }

    componentDidMount() {
        this.timer = setInterval(() => {
            this.count++
            if (this.pass < this.time) {
                this.pass += this.intever
            } else {
                this.progressEnd = true
            }
            let p = (this.pass / this.time)
            p = Math.min(p, 0.99)
            this.setState({ percent: p })
            if (this.progressEnd && this.loadFinish) {
                clearInterval(this.timer)
                window.g.uiMgr.hide(macro.UILoading)
                window.g.gameEventListener.dispatch(macro.EventLoadFinish)
            }
        }, this.intever * 1000)

        window.g.resMgr.loadRes(() => {
            this.loadFinish = true
        })
        this.getUid()
    }

    getUid() {
        let uid_create = gameCookie.getCookie(macro.UID)
        let uid = 0
        let create = 0
        if (uid_create) {
            const splits = uid_create.split('_')
            uid = splits[0]
            create = splits[1]
        }
        axios.get(`${macro.UID}/?uid=${uid}&create=${create}`).then(response => {
            uid = response.data.uid
            create = response.data.create
            gameCookie.setCookie(macro.UID, `${uid}_${create}`)
            window.g.uid = uid
        })
    }

    dots() {
        return '.'.repeat(this.count % 6)
    }

    render() {
        const wp = Math.floor(this.state.percent * 100)
        const wps = `${wp}%`

        return <div className='uiFull UILoading'>
            <div className='progressBorder'>
                <h2>Bear Child Run</h2>
                <h3>{`Loading ${this.dots()}`}</h3>
                <div className='progressFill' style={{ width: wps }}></div>
                <p>{wps}</p>
            </div>
            <div className='bottom'>
                <div className='container'>
                    <p>Copyright &copy; 2019, Email:blockchainpirate@163.com, Version:{this.version}</p>
                </div>
            </div>
        </div>
    }
}

export default UILoading

